#!/usr/bin/env python3
"""Mental health in Rochester and Monroe County: statistics (Ruzicka Psychology /research)

A statistics page that gathers figures from the four studies in ../ (their results.json, each with its own check.py)
plus three sources of its own (raw/, fetch.sh; sources.json holds URL, retrieval date and SHA-256):
  * CDC PLACES 2025 county data for all 62 New York counties (Monroe's rank on four measures).
  * HRSA mental health HPSA detail file, Monroe County rows (the City of Rochester Medicaid-eligible designation).
  * 988 Lifeline In-State KPI report for July 2026 (New York row). Needs pypdf (pip install pypdf).
Writes results.json, src/data/research/rochester-monroe-county-mental-health-statistics.json and the CSV (one row per statistic).
"""
import json, os, re, sys

ordn = lambda x: f'{x}{"th" if 10 <= x % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(x % 10, "th")}'
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '_lib'))
from page import verify_sources, n, d1, write_csv, write_page, assert_text_has  # noqa: E402

SLUG = 'rochester-monroe-county-mental-health-statistics'
PUBLISHED = '2026-11-13'
RAW = os.path.join(HERE, 'raw')
verify_sources(HERE)
study = lambda s: json.load(open(os.path.join(HERE, '..', s, 'results.json')))
for s in ('monroe-county-therapists', 'monroe-county-postpartum-depression', 'monroe-county-divorce-couples', 'rochester-loneliness-map'):
    assert not json.load(open(os.path.join(HERE, '..', s, 'check.json')))['fails'], s  # only cite studies whose own check passed
S1, S2, S3, S4 = (study(s) for s in ('monroe-county-therapists', 'monroe-county-postpartum-depression', 'monroe-county-divorce-couples', 'rochester-loneliness-map'))

# ---------- PLACES county ranks ----------
cty = defaultdict(dict)
for r in json.load(open(os.path.join(RAW, 'places-county-ny-2025.json'))):
    assert r['year'] == '2023'
    cty[r['measureid']][r['locationname']] = float(r['data_value'])
assert all(len(v) == 62 for v in cty.values()), {k: len(v) for k, v in cty.items()}
import statistics  # noqa: E402
rank = {m: 1 + sum(1 for x in v.values() if x > v['Monroe']) for m, v in cty.items()}  # 1 = highest; ties share the best rank
ties = {m: sum(1 for x in v.values() if x == v['Monroe']) for m, v in cty.items()}
median = {m: statistics.median(v.values()) for m, v in cty.items()}
assert median['LONELINESS'] == 32.3 and median['MHLTH'] == 16.2, median
WORDS = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five'}
dep_rank_text = f'tied with {WORDS[ties["DEPRESSION"] - 1]} other counties for the {ordn(rank["DEPRESSION"])} highest share' if ties['DEPRESSION'] > 1 else f'the {ordn(rank["DEPRESSION"])} highest share'
mon = {m: v['Monroe'] for m, v in cty.items()}
assert mon == {k: S4['county'][f'{k}_CrdPrv'][0] for k in mon}, 'county figures differ from the loneliness study'

# ---------- HRSA ----------
hp = [r for r in json.load(open(os.path.join(RAW, 'hrsa-mh-hpsa-monroe.json'))) if r['HPSA Name'] == 'ME-City of Rochester' and r['HPSA Status'] == 'Designated']
assert len({r['HPSA ID'] for r in hp}) == 1
h = hp[0]
hpsa = {'id': h['HPSA ID'], 'score': int(h['HPSA Score']), 'population': int(float(h['HPSA Designation Population'])), 'type': h['HPSA Population Type'],
        'discipline': h['HPSA Discipline Class'], 'designated': h['HPSA Designation Date'], 'updated': h['HPSA Designation Last Update Date']}
assert hpsa['type'] == 'Medicaid Eligible Population HPSA' and hpsa['discipline'] == 'Mental Health', hpsa
# Components are census tracts named "Census Tract N, Monroe County, New York". Matched by tract number to the 2020 tracts on the
# loneliness map: most are city tracts, a few are suburban, some numbers no longer exist (2010 numbering). Hence "mostly in the city".
import csv as _csv  # noqa: E402
tract_town = {r['tract']: r['town'] for r in _csv.DictReader(open(os.path.join(HERE, '..', '..', 'public', 'research', 'rochester-loneliness-map.csv')))}
comp = sorted({re.fullmatch(r'Census Tract ([\d.]+), Monroe County, New York', r['HPSA Component Name']).group(1) for r in hp})
hpsa['tracts'] = len(comp)
hpsa['tracts_city_2020'] = sum(1 for c in comp if tract_town.get(c) == 'Rochester (city)')
hpsa['tracts_suburban_2020'] = sum(1 for c in comp if c in tract_town and tract_town[c] != 'Rochester (city)')
hpsa['tracts_not_in_2020'] = sum(1 for c in comp if c not in tract_town)
assert hpsa['tracts_city_2020'] > hpsa['tracts'] / 2, hpsa
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
mm, dd, yy = hpsa['designated'].split('/')
hpsa_date = f'{MONTHS[int(mm) - 1]} {int(dd)}, {yy}'

# ---------- 988 (New York row, July 2026) ----------
import pypdf  # noqa: E402
pdf = pypdf.PdfReader(os.path.join(RAW, '988-in-state-kpi-2026-07.pdf'))
layout = pdf.pages[0].extract_text(extraction_mode='layout')
assert 'In-State KPIs by Responsible State for July 2026' in layout.replace('\t', ' ')
m = re.search(r'^\s*NY\s+([\d,]+)\s+([\d,]+)\s+(\d+)%\s+([\d,]+)\s+([\d,]+)\s+([\d.]+)\s+sec\s+([\d.]+)\s+min', layout.replace('\t', ' '), re.M)
assert m, 'NY row not found'
k = [int(x.replace(',', '')) for x in m.groups()[:5]]
ny988 = {'routed': k[0], 'answered': k[1], 'rate_pct': k[2], 'abandoned': k[3], 'flowout': k[4], 'speed_sec': float(m.group(6)), 'talk_min': float(m.group(7))}
assert round(ny988['answered'] / ny988['routed'] * 100) == ny988['rate_pct']
assert ny988['answered'] + ny988['abandoned'] + ny988['flowout'] == ny988['routed']

# ---------- figures from the studies ----------
M1 = S1['monroe']
roc = S4['places']['3663000']
mon_births = S2['births']['Monroe']['total']
results = {'slug': SLUG, 'places_county_rank_highest_first': rank, 'places_county_ties': ties, 'places_county_median': median, 'monroe_places': mon, 'hpsa': hpsa, 'ny988_july_2026': ny988}
json.dump(results, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)

T1, T2, T3, T4 = ('/research/monroe-county-therapists', '/research/monroe-county-postpartum-depression', '/research/monroe-county-divorce-couples', '/research/rochester-loneliness-map')
U_NYSED = 'https://www.op.nysed.gov/professions/psychology/license-statistics'
U_PLACES_C, U_PLACES_P = 'https://data.cdc.gov/d/swc5-untb', 'https://data.cdc.gov/d/eav7-hnsx'
U_HRSA = 'https://data.hrsa.gov/topics/health-workforce/shortage-areas'
U_988 = 'https://988lifeline.org/wp-content/uploads/2026/08/July-26-988-In-State-Monthly-Report.pdf'
U_T7 = 'https://www.health.ny.gov/statistics/vital_statistics/2023/table07.htm'
U_MD = 'https://www.health.ny.gov/community/pregnancy/health_care/perinatal/maternal_depression/providers/what_is_maternial_depression.htm'
U_T48 = 'https://www.health.ny.gov/statistics/vital_statistics/2023/table48.htm'
lmft = S3['monroe']
pp_est = S2['monroe_estimate_shown']
groups = [
    ('Therapists and access to care', 'Access', [
        (f'Monroe County has {n(M1["total"])} licensed psychologists, clinical social workers, mental health counselors and marriage and family therapists: '
         f'{M1["counts"]["psych"]} psychologists, {M1["counts"]["lcsw"]} LCSWs, {M1["counts"]["lmhc"]} LMHCs and {M1["counts"]["lmft"]} LMFTs, counted by mailing address as of July 1, 2026. '
         f'[See the study]({T1}).', 'NYSED Office of the Professions, license statistics', U_NYSED, n(M1['total']), 'licensed clinicians', 'Monroe County', 'July 1, 2026'),
        (f'That is {d1(M1["rate"])} clinicians per 100,000 residents, against {d1(S1["nys"]["rate"])} statewide and {d1(S1["ring"]["rate"])} in the five neighboring counties '
         f'(Genesee, Livingston, Ontario, Orleans and Wayne).', 'NYSED license statistics; U.S. Census Bureau 2025 population estimates', U_NYSED, d1(M1['rate']), 'per 100,000 residents', 'Monroe County', 'July 1, 2026'),
        (f'Monroe ranks {ordn(S1["monroe_rank_of_62"])} of New York\'s 62 counties for these clinicians per resident, and {ordn(S1["monroe_psych_rank_of_62"])} for psychologists ({d1(M1["psych_rate"])} per 100,000).',
         'NYSED license statistics', U_NYSED, ordn(S1['monroe_rank_of_62']), 'rank of 62 counties', 'Monroe County', 'July 1, 2026'),
        (f'Monroe has {lmft["lmft"]} licensed marriage and family therapists, {d1(lmft["lmft_share_pct"])}% of New York\'s {n(S3["nys"]["lmft"])} and the second-highest count of any county after Manhattan. '
         f'[See the study]({T3}).', 'NYSED license statistics, marriage and family therapists', 'https://www.op.nysed.gov/professions/marriage-and-family-therapists/license-statistics',
         str(lmft['lmft']), 'licensed marriage and family therapists', 'Monroe County', 'July 1, 2026'),
        (f'New York issued {n(S1["issued_four"]["2025"])} new licenses in these four professions in 2025, up {S1["issued_change_2024_2025_pct"]}% from {n(S1["issued_four"]["2024"])} in 2024.',
         'NYSED license statistics, licenses issued by year', U_NYSED, n(S1['issued_four']['2025']), 'new licenses statewide', 'New York State', '2025'),
        (f'The federal government designates a mental health professional shortage area for Medicaid-eligible residents of {hpsa["tracts"]} census tracts, most of them in the City of Rochester '
         f'(HRSA\'s name for it is "ME-City of Rochester"): {n(hpsa["population"])} people, with a shortage score of {hpsa["score"]} (higher scores mean greater need). The designation dates from {hpsa_date}.',
         'HRSA, Health Professional Shortage Areas (mental health), designation "ME-City of Rochester"', U_HRSA, n(hpsa['population']), 'people in the designation', 'Rochester area: 88 census tracts, mostly in the City of Rochester (Medicaid-eligible population)', f'designated {hpsa_date}'),
    ]),
    ('Loneliness, distress and depression', 'Wellbeing', [
        (f'An estimated {mon["LONELINESS"]}% of Monroe County adults feel lonely always, usually or sometimes, close to the median for New York\'s 62 counties ({d1(median["LONELINESS"])}%). '
         f'[See the map]({T4}).', 'CDC PLACES 2025 release, county estimates (BRFSS 2023)', U_PLACES_C, f'{mon["LONELINESS"]}%', 'of adults', 'Monroe County', '2023'),
        (f'In the City of Rochester the estimate is {roc["LONELINESS_CrdPrv"][0]}%, against {d1(S4["suburban_range_under_33"][0])}% to {d1(S4["suburban_range_under_33"][1])}% in {S4["suburban_towns_under_33"]} of the county\'s 20 suburban towns. '
         f'{S4["high_in_city"]} of the {len(S4["high_tracts_40plus"])} census tracts where 40% or more of adults are estimated to be lonely are in the city.',
         'CDC PLACES 2025 release, place and census tract estimates', U_PLACES_P, f'{roc["LONELINESS_CrdPrv"][0]}%', 'of adults', 'City of Rochester', '2023'),
        (f'An estimated {mon["EMOTIONSPT"]}% of Monroe County adults lack the social and emotional support they need; in the City of Rochester, {roc["EMOTIONSPT_CrdPrv"][0]}%.',
         'CDC PLACES 2025 release', U_PLACES_C, f'{mon["EMOTIONSPT"]}%', 'of adults', 'Monroe County', '2023'),
        (f'An estimated {mon["MHLTH"]}% of Monroe County adults have frequent mental distress (14 or more poor mental health days in the past month), below the median for New York\'s 62 counties ({d1(median["MHLTH"])}%); in the City of Rochester, {roc["MHLTH_CrdPrv"][0]}%.',
         'CDC PLACES 2025 release', U_PLACES_C, f'{mon["MHLTH"]}%', 'of adults', 'Monroe County', '2023'),
        (f'An estimated {mon["DEPRESSION"]}% of Monroe County adults have ever been told they have depression, {dep_rank_text} among New York\'s 62 counties.',
         'CDC PLACES 2025 release', U_PLACES_C, f'{mon["DEPRESSION"]}%', 'of adults', 'Monroe County', '2023'),
    ]),
    ('New parents', 'Perinatal', [
        (f'Monroe County residents had {n(mon_births)} babies in 2023, down {abs(S2["monroe_births_change_pct"])}% from {n(S2["monroe_births_2008"])} in 2008.',
         'NYS Department of Health, Vital Statistics of New York State 2023, Table 7', U_T7, n(mon_births), 'births', 'Monroe County', '2023'),
        (f'In 2022, {S2["rates"]["nys_excl_nyc"]}% of mothers in New York State outside New York City reported symptoms of postpartum depression after giving birth ({S2["rates"]["nys"]}% statewide).',
         'NYS Department of Health, from CDC PRAMS 2022 survey data', U_MD, f'{S2["rates"]["nys_excl_nyc"]}%', 'of mothers', 'New York State excluding New York City', '2022'),
        (f'Applied to Monroe County births, that rate suggests about {n(pp_est)} mothers a year with symptoms of postpartum depression. This is an estimate, not a count. [See the study]({T2}).',
         'Ruzicka Psychology calculation from NYS DOH Table 7 and PRAMS', U_T7, f'about {n(pp_est)}', 'mothers a year (estimate)', 'Monroe County', '2023 births, 2022 rate'),
        (f'{S2["screening"]["rate"]}% of New York mothers who had a postpartum checkup were asked about depression in {S2["screening"]["year"]}, up from {S2["screening"]["prev_rate"]}% in {S2["screening"]["prev_year"]}.',
         'NYS Department of Health, from New York PRAMS data', U_MD, f'{S2["screening"]["rate"]}%', 'of mothers asked about depression', 'New York State', str(S2['screening']['year'])),
    ]),
    ('Couples and families', 'Relationships', [
        (f'{n(S3["monroe"]["marriages"])} couples married in Monroe County in 2023, and county courts granted {n(S3["monroe"]["divorces"])} divorces. [See the study]({T3}).',
         'NYS Department of Health, Vital Statistics of New York State 2023, Tables 47 and 48', U_T48, n(S3['monroe']['divorces']), 'divorces granted', 'Monroe County', '2023 (provisional)'),
        (f'{S3["monroe"]["with_children_pct"]}% of those divorces involved at least one child under 18, and {S3["monroe"]["ten_plus_pct"]}% ended a marriage of 10 years or more.',
         'NYS Department of Health, Vital Statistics 2023, Tables 51 and 52', 'https://www.health.ny.gov/statistics/vital_statistics/2023/table52.htm', f'{S3["monroe"]["with_children_pct"]}%', 'of divorces', 'Monroe County', '2023 (provisional)'),
    ]),
    ('Crisis lines', 'Crisis', [
        (f'In July 2026, {n(ny988["routed"])} calls to 988 were routed to New York\'s crisis centers, and {ny988["rate_pct"]}% ({n(ny988["answered"])}) were answered in state. '
         f'{n(ny988["flowout"])} went to the national backup network. These are statewide figures; the report does not break them down by county.',
         '988 Suicide & Crisis Lifeline, In-State KPI Report, July 2026', U_988, f'{ny988["rate_pct"]}%', 'of routed calls answered in state', 'New York State', 'July 2026'),
        (f'Calls answered in New York were picked up in an average of {ny988["speed_sec"]} seconds.',
         '988 Suicide & Crisis Lifeline, In-State KPI Report, July 2026', U_988, f'{ny988["speed_sec"]} seconds', 'average speed to answer', 'New York State', 'July 2026'),
    ]),
]
for g in groups:
    for it in g[2]:
        assert it[3] in it[0], (it[3], it[0])

csv_rows = [[g[0], re.sub(r' \[See the (study|map)\]\([^)]+\)\.', '', it[0]), it[3], it[4], it[5], it[6], it[1], it[2]] for g in groups for it in g[2]]
csv_href, csv_n = write_csv(SLUG, ['topic', 'statistic', 'value', 'unit', 'geography', 'period', 'source', 'source_url'], csv_rows)

headline = (f'Monroe County has {n(M1["total"])} licensed mental health clinicians, {d1(M1["rate"])} per 100,000 residents. An estimated {mon["LONELINESS"]}% of adults '
            f'feel lonely at least some of the time ({roc["LONELINESS_CrdPrv"][0]}% in the City of Rochester), and {n(hpsa["population"])} Medicaid-eligible residents, '
            f'mostly in the city, live in a federal mental health shortage area.')
page = {
    'slug': SLUG,
    'kind': 'statistics',
    'title': 'Mental Health in Rochester and Monroe County: Statistics',
    'metaTitle': 'Rochester and Monroe County Mental Health Statistics (2026)',
    'metaDescription': (f'Monroe County mental health statistics: {n(M1["total"])} licensed clinicians, {mon["LONELINESS"]}% of adults lonely, '
                        f'{mon["DEPRESSION"]}% ever told they have depression, new parents, divorce and 988 data, with sources.'),
    'eyebrow': 'Statistics · Rochester and Monroe County',
    'headline': headline,
    'datePublished': PUBLISHED,
    'dateModified': PUBLISHED,
    'card': {'value': n(M1['total']), 'label': 'licensed mental health clinicians in Monroe County',
             'summary': f'Key figures on therapists, loneliness, depression, new parents, divorce and 988 for Rochester and Monroe County, each with its source.'},
    'blocks': [
        {'type': 'keyNumbers', 'heading': 'At a glance', 'items': [
            {'value': n(M1['total']), 'label': f'licensed psychologists, social workers, counselors and marriage and family therapists in Monroe County ({d1(M1["rate"])} per 100,000 residents)', 'source': 'NYSED, as of July 1, 2026'},
            {'value': f'{mon["LONELINESS"]}%', 'label': f'of Monroe County adults estimated to feel lonely at least some of the time ({roc["LONELINESS_CrdPrv"][0]}% in the City of Rochester)', 'source': 'CDC PLACES 2025 release'},
            {'value': f'{mon["DEPRESSION"]}%', 'label': f'of Monroe County adults estimated to have ever been told they have depression, {dep_rank_text} among New York\'s 62 counties', 'source': 'CDC PLACES 2025 release'},
            {'value': n(hpsa['population']), 'label': f'Medicaid-eligible residents, mostly in the City of Rochester, in a federal mental health shortage area (score {hpsa["score"]})', 'source': 'HRSA'},
            {'value': f'About {n(pp_est)}', 'label': f'Monroe County mothers a year estimated to have symptoms of postpartum depression', 'source': 'Ruzicka Psychology estimate from NYS DOH data'},
            {'value': f'{ny988["rate_pct"]}%', 'label': f'of 988 calls routed to New York centers answered in state in July 2026 ({n(ny988["routed"])} calls)', 'source': '988 Lifeline In-State KPI report'},
        ]},
        {'type': 'notice', 'text': 'If you are in crisis or thinking about harming yourself, call or text 988 (Suicide & Crisis Lifeline, free, 24/7). If you or anyone else is in immediate danger, call 911. Local crisis and support lines are on our [resources page](/resources).'},
        *[{'type': 'statGroup', 'eyebrow': g[1], 'heading': g[0], 'items': [{'text': it[0], 'source': it[1], 'url': it[2]} for it in g[2]]} for g in groups],
        {'type': 'prose', 'eyebrow': 'Notes', 'heading': 'About these statistics', 'paragraphs': [
            'Each figure links to its public source. Figures marked as studies come from our own research pages, where the method, the limits and a downloadable table are set out in full.',
            'Loneliness, support, distress and depression figures are CDC model-based estimates, not counts. Licensed clinicians are counted by mailing address and include people who are not currently practicing. Divorces are counted where the court granted them. The postpartum figure is an estimate that applies a regional survey rate to county births.',
            'These statistics describe how common things are in the area. They are not medical advice and say nothing about any one person.',
        ]},
    ],
    'sources': [
        {'name': 'NYSED Office of the Professions, license statistics (psychology, clinical social work, mental health counseling, marriage and family therapy)', 'period': 'As of July 1, 2026', 'url': U_NYSED},
        {'name': 'CDC PLACES: Local Data for Better Health, County Data 2025 release', 'period': 'BRFSS 2023 model-based estimates', 'url': U_PLACES_C},
        {'name': 'CDC PLACES: Local Data for Better Health, Place Data 2025 release', 'period': 'BRFSS 2023 model-based estimates', 'url': U_PLACES_P},
        {'name': 'HRSA Data Warehouse, Health Professional Shortage Areas: mental health (HPSA ID ' + hpsa['id'] + ', "ME-City of Rochester")', 'period': f'Designated {hpsa_date}; data downloaded November 13, 2026', 'url': U_HRSA},
        {'name': '988 Suicide & Crisis Lifeline, In-State KPI Report, July 2026', 'period': 'July 2026', 'url': U_988},
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 7 (births)', 'period': '2023', 'url': U_T7},
        {'name': 'NYS Department of Health, "What is Maternal Depression?" (PRAMS figures)', 'period': 'PRAMS 2022; screening 2020', 'url': U_MD},
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 48 (dissolutions of marriage)', 'period': '2023 (provisional)', 'url': U_T48},
    ],
    'citation': 'Ruzicka Psychology. "Mental Health in Rochester and Monroe County: Statistics." November 13, 2026. https://www.ruzickapsychology.com/research/rochester-monroe-county-mental-health-statistics.',
    'csv': {'href': csv_href, 'rows': csv_n, 'label': f'Every statistic on this page with its value, unit, place, period and source (CSV, {csv_n} rows)'},
    'dataset': {
        'name': 'Mental health statistics for Rochester and Monroe County, New York',
        'description': 'Licensed clinicians (NYSED), CDC PLACES estimates, HRSA shortage designation, births and PRAMS postpartum depression, marriages and divorces, and New York 988 performance, with sources.',
        'temporalCoverage': '2022/2026',
        'spatialCoverage': 'Monroe County, New York, United States',
        'variableMeasured': ['Licensed mental health clinicians', 'Loneliness', 'Lack of social and emotional support', 'Frequent mental distress', 'Depression', 'Births', 'Postpartum depression symptoms', 'Divorces', '988 in-state answer rate'],
    },
    'related': [
        {'label': 'How many therapists does Monroe County have?', 'href': T1},
        {'label': 'Loneliness in Rochester and its suburbs, mapped', 'href': T4},
        {'label': 'Local support and crisis lines', 'href': '/resources'},
    ],
}
assert_text_has(page, n(M1['total']), f'{mon["LONELINESS"]}%', n(hpsa['population']), f'{ny988["rate_pct"]}%')
write_page(page)
print(json.dumps({'rank': rank, 'ties': ties, 'mon': mon, 'hpsa': hpsa, '988': ny988, 'csv_rows': csv_n}))
