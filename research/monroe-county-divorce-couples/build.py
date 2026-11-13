#!/usr/bin/env python3
"""Marriage, divorce and couples therapists in Monroe County (Ruzicka Psychology /research)

Inputs (raw/, fetch.sh; sources.json holds URL, retrieval date and SHA-256):
  * NYS DOH Vital Statistics Table 47 (marriages by county of occurrence) and Table 48 (dissolutions of marriage by county
    of decree), 2015-2023; Table 51 (divorces by duration of marriage) and Table 52 (by number of children under 18), 2023.
  * From ../monroe-county-therapists: Census Vintage 2025 county population (POPESTIMATE2023 for the 2023 rates) and the
    NYSED licensed marriage and family therapist (LMFT) counts by county (mailing address, as of July 1, 2026).
Writes results.json, src/data/research/monroe-county-divorce-couples.json and the public CSV.
Divorces are counted where the decree was granted, not where the couple lived; marriages where the ceremony took place.
"""
import csv, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '_lib'))
from page import REPO, verify_sources, html_text, n, d1, write_csv, write_page, assert_text_has  # noqa: E402

SLUG = 'monroe-county-divorce-couples'
PUBLISHED = '2026-11-13'
RAW = os.path.join(HERE, 'raw')
T1 = os.path.join(HERE, '..', 'monroe-county-therapists')
verify_sources(HERE)
verify_sources(T1)
YEARS = list(range(2015, 2024))
RING = ['Genesee', 'Livingston', 'Ontario', 'Orleans', 'Wayne']
BOROUGHS = ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond']
AGG = ['New York State', 'New York City', 'Rest of State']
TITLES = {47: 'Marriages by County of Occurrence and Month of Ceremony', 48: 'Dissolutions of Marriage by County of Decree and Type of Decree',
          51: 'Divorces by County of Decree and Duration of Marriage', 52: 'Divorces by County of Decree and Number of Children Under 18'}
NCOLS = {47: 13, 48: 4, 51: 8, 52: 8}

# 62 county names, as NYSED/study 1 spell them
COUNTIES = [r['county'] for r in csv.DictReader(open(os.path.join(REPO, 'public', 'research', 'monroe-county-therapists.csv')))
            if not r['county'].startswith('New York State')]
assert len(COUNTIES) == 62
key = lambda s: s.replace('.', '').replace(' ', '').lower()
CANON = {key(c): c for c in COUNTIES}


GAPS = []


def table(year, t):
    s = html_text(os.path.join(RAW, f'nysdoh-{year}-table{t}.htm'))
    assert f'Table {t}: {TITLES[t]}'.replace('Occurrence', 'Occur') in s.replace('Occurrence', 'Occur').replace('Occurence', 'Occur'), (year, t)
    i = s.find('County Total')
    assert i > 0, (year, t)
    body = s[i:s.find('Back to top', i)]
    k = NCOLS[t]
    rows = {}
    num = r'(?:\d[\d,]*|-)'
    for label, nums in re.findall(r"([A-Za-z][A-Za-z.' ]*?) ((?:%s ){%d}%s)(?= |$)" % (num, k - 1, num), body):
        label = label.strip()
        for a in AGG:
            if label.endswith(a + ' ' + a) or label == a:
                label = a
        name = a if label in AGG else CANON.get(key(label))
        if label in AGG:
            name = label
        assert name, (year, t, label)
        assert name not in rows, (year, t, name)
        rows[name] = [0 if x == '-' else int(x.replace(',', '')) for x in nums.split()]
    assert len(rows) == 65, (year, t, len(rows))
    for c in [c for c in rows if c not in AGG]:  # row totals and region sums must add up
        if t == 47:
            assert rows[c][0] == sum(rows[c][1:]), (year, t, c)
    for col in range(k):  # published region totals vs county sums: log any gap, stop if more than 2
        for region, members in (('New York State', COUNTIES), ('New York City', BOROUGHS), ('Rest of State', [c for c in COUNTIES if c not in BOROUGHS])):
            gap = rows[region][col] - sum(rows[c][col] for c in members)
            if gap:
                GAPS.append({'year': year, 'table': t, 'column': col, 'region': region, 'published_minus_sum': gap})
            assert abs(gap) <= 2, (year, t, col, region, gap)
    provisional = 'Data is provisional' in body
    return rows, provisional


mar, div, prov = {}, {}, {}
for y in YEARS:
    mar[y], p47 = table(y, 47)
    div[y], p48 = table(y, 48)
    prov[y] = p47 or p48
t51, _ = table(2023, 51)
t52, _ = table(2023, 52)
PROV = [y for y in YEARS if prov[y]]
assert PROV == [2021, 2022, 2023], PROV  # the page text names these years
assert t51['Monroe'][0] == div[2023]['Monroe'][1] == t52['Monroe'][0]  # divorce totals agree across tables

# ---------- populations (Census Vintage 2025) and LMFT counts (NYSED via study 1) ----------
pop23 = {}
for r in csv.DictReader(open(os.path.join(T1, 'raw', 'co-est2025-alldata.csv'), encoding='latin-1')):
    if r['STATE'] != '36':
        continue
    if r['SUMLEV'] == '040':
        pop23['New York State'] = int(r['POPESTIMATE2023'])
    else:
        pop23[CANON[key(r['CTYNAME'].replace(' County', ''))]] = int(r['POPESTIMATE2023'])
pop23['New York City'] = sum(pop23[c] for c in BOROUGHS)
pop23['Rest of State'] = pop23['New York State'] - pop23['New York City']
assert len(pop23) == 65
lmft, pop25 = {}, {}
for r in csv.DictReader(open(os.path.join(REPO, 'public', 'research', 'monroe-county-therapists.csv'))):
    name = 'New York State' if r['county'].startswith('New York State') else r['county']
    lmft[name], pop25[name] = int(r['lmft']), int(r['population_2025'])
assert lmft['Monroe'] == 144 and lmft['New York State'] == 1518

# ---------- figures ----------
per1k = lambda x, p: x / p * 1000
per100k = lambda x, p: x / p * 1e5
M = 'Monroe'
m_div, m_mar = div[2023][M][0], mar[2023][M][0]
m_div_rate, m_mar_rate = per1k(m_div, pop23[M]), per1k(m_mar, pop23[M])
nys_div_rate, nys_mar_rate = per1k(div[2023]['New York State'][0], pop23['New York State']), per1k(mar[2023]['New York State'][0], pop23['New York State'])
ring_div, ring_mar, ring_pop = (sum(d[c] for c in RING) for d in ({c: div[2023][c][0] for c in RING}, {c: mar[2023][c][0] for c in RING}, pop23))
m_mar15 = mar[2015][M][0]
mar_change = round((m_mar - m_mar15) / m_mar15 * 100)
DUR = ['Under 5', '5-9', '10-14', '15-19', '20-29', '30+', 'Not stated']
dur = dict(zip(DUR, t51[M][1:]))
ten_plus = dur['10-14'] + dur['15-19'] + dur['20-29'] + dur['30+']
ten_plus_pct = round(ten_plus / t51[M][0] * 100)
KIDS = ['None', 'One', 'Two', 'Three', 'Four', 'Five or more', 'Not stated']
kids = dict(zip(KIDS, t52[M][1:]))
with_kids = sum(kids[k] for k in KIDS[1:6])
with_kids_pct = round(with_kids / t52[M][0] * 100)
m_lmft, nys_lmft = lmft[M], lmft['New York State']
lmft_share = m_lmft / nys_lmft * 100
pop_share = pop25[M] / pop25['New York State'] * 100
share_ratio = lmft_share / pop_share
m_lmft_rate, nys_lmft_rate = per100k(m_lmft, pop25[M]), per100k(nys_lmft, pop25['New York State'])
ring_lmft = sum(lmft[c] for c in RING)
ring_pop25 = sum(pop25[c] for c in RING)
by_count = sorted(COUNTIES, key=lambda c: -lmft[c])
by_rate = sorted(COUNTIES, key=lambda c: -lmft[c] / pop25[c])
count_rank, rate_rank = by_count.index(M) + 1, by_rate.index(M) + 1
assert (count_rank, rate_rank) == (2, 2) and by_count[0] == 'New York' and by_rate[0] == 'Onondaga', (count_rank, rate_rank, by_count[0], by_rate[0])
ordinal = {1: 'highest', 2: 'second-highest', 3: 'third-highest'}
pre = [div[y][M][0] for y in range(2015, 2019)]
ros18, ros19 = div[2018]['Rest of State'][0], div[2019]['Rest of State'][0]
hubs = {c: (div[2015][c][0], div[2023][c][0]) for c in ('Onondaga', 'Jefferson', 'New York')}

results = {'slug': SLUG, 'year': 2023, 'monroe': {'divorces': m_div, 'marriages': m_mar, 'div_per_1000': m_div_rate, 'mar_per_1000': m_mar_rate, 'pop2023': pop23[M],
           'marriages_2015': m_mar15, 'marriage_change_pct': mar_change, 'duration': dur, 'ten_plus': ten_plus, 'ten_plus_pct': ten_plus_pct,
           'children': kids, 'with_children': with_kids, 'with_children_pct': with_kids_pct, 'lmft': m_lmft, 'lmft_per_100k': m_lmft_rate,
           'lmft_share_pct': lmft_share, 'pop_share_pct': pop_share, 'share_ratio': share_ratio, 'lmft_count_rank': count_rank, 'lmft_rate_rank': rate_rank},
           'nys': {'divorces': div[2023]['New York State'][0], 'marriages': mar[2023]['New York State'][0], 'div_per_1000': nys_div_rate, 'mar_per_1000': nys_mar_rate,
                   'lmft': nys_lmft, 'lmft_per_100k': nys_lmft_rate},
           'ring': {'divorces': ring_div, 'marriages': ring_mar, 'pop2023': ring_pop, 'lmft': ring_lmft, 'lmft_per_100k': per100k(ring_lmft, ring_pop25)},
           'erie': {'divorces': div[2023]['Erie'][0], 'marriages': mar[2023]['Erie'][0], 'lmft': lmft['Erie']},
           'trend': {y: {'monroe_marriages': mar[y][M][0], 'monroe_dissolutions': div[y][M][0], 'rest_of_state_dissolutions': div[y]['Rest of State'][0],
                         'nys_dissolutions': div[y]['New York State'][0]} for y in YEARS},
           'decree_hubs': hubs, 'provisional_years': PROV, 'published_total_gaps': GAPS}
json.dump(results, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)

# ---------- CSV: every county ----------
rows = []
for c in COUNTIES + AGG:
    lm = lmft.get(c, '') if c != 'New York State' else lmft['New York State']
    rows.append([c, 'state' if c == 'New York State' else ('region' if c in AGG else 'county'), 'yes' if c in RING else '',
                 mar[2023][c][0], div[2023][c][0], div[2023][c][1], pop23[c], f'{per1k(mar[2023][c][0], pop23[c]):.2f}',
                 f'{per1k(div[2023][c][0], pop23[c]):.2f}', lm, pop25.get(c, ''), f'{per100k(lm, pop25[c]):.1f}' if lm != '' and c in pop25 else '',
                 *[div[y][c][0] for y in YEARS]])
csv_href, csv_rows = write_csv(SLUG, ['area', 'level', 'borders_monroe', 'marriages_2023_county_of_occurrence', 'dissolutions_2023_county_of_decree',
                                      'divorces_2023', 'population_2023', 'marriages_per_1000_2023', 'dissolutions_per_1000_2023',
                                      'lmft_july_2026', 'population_2025', 'lmft_per_100k',
                                      *[f'dissolutions_{y}' for y in YEARS]], rows)

# ---------- page ----------
doh = 'NYS Department of Health, Vital Statistics of New York State 2023'
nysed = 'NYSED Office of the Professions, license statistics (as of July 1, 2026)'
headline = (f'Monroe County has the {ordinal[count_rank]} number of licensed marriage and family therapists in New York ({m_lmft}) and the '
            f'{ordinal[rate_rank]} per resident: {d1(m_lmft_rate)} per 100,000, against {d1(nys_lmft_rate)} statewide. '
            f'Its courts granted {n(m_div)} divorces in 2023, the same year {n(m_mar)} couples married in the county.')
dur_labels = {'Under 5': 'Under 5 years', '5-9': '5 to 9 years', '10-14': '10 to 14 years', '15-19': '15 to 19 years', '20-29': '20 to 29 years', '30+': '30 years or more'}
peak = max(dur_labels, key=lambda k: dur[k])
dur_bars = [{'label': lab, 'value': dur[k], 'display': n(dur[k]), 'tone': 'highlight' if k == peak else 'default'} for k, lab in dur_labels.items()]


def area_row(label, mar_, div_, p23, lm, p25):
    return [label, n(mar_), n(div_), d1(per1k(div_, p23)), n(lm), d1(per100k(lm, p25))]


area_rows = [area_row('Monroe County', m_mar, m_div, pop23[M], m_lmft, pop25[M]),
             area_row('Five neighboring counties', ring_mar, ring_div, ring_pop, ring_lmft, ring_pop25),
             area_row('Erie County (Buffalo)', mar[2023]['Erie'][0], div[2023]['Erie'][0], pop23['Erie'], lmft['Erie'], pop25['Erie']),
             area_row('Onondaga County (Syracuse)', mar[2023]['Onondaga'][0], div[2023]['Onondaga'][0], pop23['Onondaga'], lmft['Onondaga'], pop25['Onondaga']),
             area_row('New York State', mar[2023]['New York State'][0], div[2023]['New York State'][0], pop23['New York State'], nys_lmft, pop25['New York State'])]
trend_rows = [[str(y) + (' (provisional)' if y in PROV else ''), n(mar[y][M][0]), n(div[y][M][0]), n(div[y]['Rest of State'][0])] for y in reversed(YEARS)]
on15, on23 = hubs['Onondaga']
j15, j23 = hubs['Jefferson']
ny15, ny23 = hubs['New York']

page = {
    'slug': SLUG,
    'kind': 'study',
    'title': 'Marriage, Divorce and Couples Therapists in Monroe County',
    'metaTitle': 'Monroe County, NY Divorce and Marriage Data, With Couples Therapists',
    'metaDescription': (f'Monroe County courts granted {n(m_div)} divorces in 2023 and {n(m_mar)} couples married there. '
                        f'The county has {m_lmft} licensed marriage and family therapists, {d1(lmft_share)}% of New York\'s {n(nys_lmft)}.'),
    'eyebrow': 'Data study · Rochester and Monroe County',
    'headline': headline,
    'datePublished': PUBLISHED,
    'dateModified': PUBLISHED,
    'card': {'value': n(m_div), 'label': 'divorces granted in Monroe County in 2023',
             'summary': f'Monroe also has {m_lmft} licensed marriage and family therapists, {d1(lmft_share)}% of the state total and the {ordinal[count_rank]} count of any county.'},
    'blocks': [
        {'type': 'keyNumbers', 'heading': 'Key numbers', 'items': [
            {'value': str(m_lmft), 'label': f'licensed marriage and family therapists with a Monroe County address, {d1(lmft_share)}% of New York\'s {n(nys_lmft)} (Erie County: {lmft["Erie"]})', 'source': nysed},
            {'value': d1(m_lmft_rate), 'label': f'marriage and family therapists per 100,000 Monroe residents, against {d1(nys_lmft_rate)} statewide and {d1(per100k(ring_lmft, ring_pop25))} in the five neighboring counties', 'source': f'{nysed}; U.S. Census Bureau 2025 population estimates'},
            {'value': n(m_div), 'label': f'divorces granted in Monroe County in 2023, about {d1(m_div_rate)} per 1,000 residents (statewide: {d1(nys_div_rate)})', 'source': f'{doh}, Table 48'},
            {'value': n(m_mar), 'label': f'marriages in Monroe County in 2023, down {abs(mar_change)}% from {n(m_mar15)} in 2015', 'source': f'{doh}, Table 47'},
            {'value': f'{with_kids_pct}%', 'label': f'of Monroe County divorces in 2023 ({n(with_kids)} of {n(t52[M][0])}) involved at least one child under 18', 'source': f'{doh}, Table 52'},
            {'value': f'{ten_plus_pct}%', 'label': f'ended a marriage that had lasted 10 years or more ({n(ten_plus)} of {n(t51[M][0])})', 'source': f'{doh}, Table 51'},
        ]},
        {'type': 'notice', 'text': 'If you are in crisis or thinking about harming yourself, call or text 988 (Suicide & Crisis Lifeline, free, 24/7). If you or anyone else is in immediate danger, call 911. If you feel unsafe in your relationship, Willow Domestic Violence Center\'s 24-hour hotline is (585) 222-SAFE, call or text. Local lines are on our [resources page](/resources).'},
        {'type': 'chart', 'heading': 'How long Monroe County marriages lasted before divorce, 2023',
         'description': f'{n(t51[M][0])} divorces granted in Monroe County, by length of the marriage. The most common length was {dur_labels[peak].lower()}.',
         'unit': 'divorces', 'bars': dur_bars,
         'note': f'Source: {doh}, Table 51 (provisional). Length not stated: {dur["Not stated"]}.'},
        {'type': 'table', 'heading': 'Marriages, divorces and marriage and family therapists by area',
         'caption': 'Marriages and divorces in 2023 (where the ceremony or decree took place); licensed marriage and family therapists as of July 1, 2026 (mailing address). Onondaga\'s divorce count reflects where decrees were granted, not where couples lived.',
         'columns': ['Area', 'Marriages (2023)', 'Divorces (2023)', 'Divorces per 1,000 residents', 'Licensed MFTs', 'MFTs per 100,000'],
         'rows': area_rows, 'csv': True},
        {'type': 'prose', 'eyebrow': 'Findings', 'heading': 'What the data shows', 'paragraphs': [
            f'Monroe County has {m_lmft} licensed marriage and family therapists (LMFTs), {d1(lmft_share)}% of the {n(nys_lmft)} in New York State. The county has {d1(pop_share)}% of the state\'s residents, so it has about {d1(share_ratio)} times its population share of LMFTs. Only Manhattan has more ({lmft["New York"]}), and only Onondaga County has more per resident ({d1(per100k(lmft["Onondaga"], pop25["Onondaga"]))} per 100,000). Erie County, with more people than Monroe, has {lmft["Erie"]}. The five neighboring counties have {ring_lmft} between them.',
            f'Monroe County courts granted {n(m_div)} divorces in 2023, about {d1(m_div_rate)} for every 1,000 residents. Across New York State the figure was {d1(nys_div_rate)}. In the same year {n(m_mar)} couples married in Monroe County, about {d1(m_mar_rate)} per 1,000 residents.',
            f'Most divorces ended long marriages: {ten_plus_pct}% of Monroe County divorces in 2023 ended a marriage of 10 years or more, and {n(dur["30+"])} ended a marriage of 30 years or more. About four in ten ({with_kids_pct}%) involved at least one child under 18.',
            f'Marriages in the county have declined, from {n(m_mar15)} in 2015 to {n(m_mar)} in 2023. Divorce counts were between {n(min(pre))} and {n(max(pre))} a year from 2015 to 2018. They fell sharply in 2019, as they did across New York outside New York City ({n(ros18)} in 2018, {n(ros19)} in 2019), and have risen each year since 2021.',
        ]},
        {'type': 'table', 'heading': 'Monroe County marriages and divorces, 2023 back to 2015',
         'caption': 'Marriages by county of ceremony and divorces (all dissolutions of marriage) by county of decree, with New York State outside New York City for comparison.',
         'columns': ['Year', 'Monroe marriages', 'Monroe divorces', 'Divorces, NYS outside NYC'],
         'rows': trend_rows},
        {'type': 'points', 'eyebrow': 'For couples', 'heading': 'What this means for couples', 'items': [
            f'Rochester-area couples have more licensed marriage and family therapists nearby than most of New York: {d1(m_lmft_rate)} per 100,000 residents against {d1(nys_lmft_rate)} statewide.',
            'Marriage and family therapists are one of several license types that see couples. Psychologists, clinical social workers and mental health counselors may also offer couples therapy, so it is reasonable to ask any clinician about their training and experience with couples.',
            f'The five counties around Monroe have {d1(per100k(ring_lmft, ring_pop25))} marriage and family therapists per 100,000 residents, close to the statewide level and well below Monroe\'s {d1(m_lmft_rate)}.',
            'Ruzicka Psychology offers [couples therapy](/specialties/couples-therapy) in Rochester. If you feel unsafe in your relationship, local help, including Willow Domestic Violence Center, is listed on our [resources page](/resources).',
        ]},
        {'type': 'prose', 'eyebrow': 'Method', 'heading': 'How we counted', 'paragraphs': [
            'Marriages and divorces: New York State Department of Health, Vital Statistics of New York State, Table 47 (marriages by county where the ceremony took place) and Table 48 (dissolutions of marriage by county where the decree was granted), 2015 to 2023. "Divorces" on this page means all dissolutions in Table 48; in Monroe County in 2023 every one was a divorce. Length of marriage and children under 18 come from Tables 51 and 52.',
            'Marriage and family therapists: New York State Education Department license statistics, which count licensees by the county of their mailing address as of July 1, 2026. The same counts appear in our [study of therapist supply in Monroe County](/research/monroe-county-therapists).',
            'Rates: divorces and marriages per 1,000 residents use U.S. Census Bureau population estimates for 2023 (Vintage 2025); therapists per 100,000 use the 2025 estimates.',
        ]},
        {'type': 'prose', 'eyebrow': 'Limits', 'heading': 'What these numbers cannot tell you', 'paragraphs': [
            f'Divorces are counted in the county where the court granted the decree, not where the couple lived. Some counties grant far more divorces than their own population would explain: Onondaga County granted {n(on23)} in 2023 (up from {n(on15)} in 2015) and Jefferson County {n(j23)} (up from {n(j15)}), while Manhattan fell from {n(ny15)} to {n(ny23)}. Some Monroe County couples may have divorced elsewhere, so county divorce rates are rough.',
            'Marriages are counted where the ceremony took place, so wedding destinations count marriages of couples who live elsewhere.',
            'Counts for 2021, 2022 and 2023 are marked provisional by the Department of Health. The tables do not explain the 2019 drop in divorce counts, and this page does not try to.',
            'Licensed marriage and family therapists are counted by mailing address, which may be a home rather than an office, and a license does not mean the person is currently seeing couples.',
            'These numbers describe how often marriages begin and end. They say nothing about why, and nothing about what helps.',
        ]},
    ],
    'sources': [
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 48: Dissolutions of Marriage by County of Decree and Type of Decree', 'period': '2015-2023 (2021-2023 provisional); one table per year', 'url': 'https://www.health.ny.gov/statistics/vital_statistics/2023/table48.htm'},
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 47: Marriages by County of Occurrence and Month of Ceremony', 'period': '2015-2023 (2021-2023 provisional); one table per year', 'url': 'https://www.health.ny.gov/statistics/vital_statistics/2023/table47.htm'},
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 51: Divorces by County of Decree and Duration of Marriage', 'period': '2023 (provisional)', 'url': 'https://www.health.ny.gov/statistics/vital_statistics/2023/table51.htm'},
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 52: Divorces by County of Decree and Number of Children Under 18', 'period': '2023 (provisional)', 'url': 'https://www.health.ny.gov/statistics/vital_statistics/2023/table52.htm'},
        {'name': 'NYSED Office of the Professions, Marriage and Family Therapists: License Statistics', 'period': 'As of July 1, 2026', 'url': 'https://www.op.nysed.gov/professions/marriage-and-family-therapists/license-statistics'},
        {'name': 'U.S. Census Bureau, County Population Totals and Components of Change: 2020-2025 (Vintage 2025)', 'period': 'July 1, 2023 and July 1, 2025 estimates', 'url': 'https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv'},
    ],
    'citation': 'Ruzicka Psychology. "Marriage, Divorce and Couples Therapists in Monroe County." November 13, 2026. https://www.ruzickapsychology.com/research/monroe-county-divorce-couples. Data: NYS Department of Health; NYSED; U.S. Census Bureau.',
    'csv': {'href': csv_href, 'rows': csv_rows, 'label': f'Marriages, divorces and licensed marriage and family therapists for all 62 New York counties, New York City, the rest of the state and New York State, with divorces for 2015 to 2023 (CSV, {csv_rows} rows)'},
    'dataset': {
        'name': 'Marriages, divorces and licensed marriage and family therapists by New York county',
        'description': 'Marriages by county of occurrence and dissolutions of marriage by county of decree (NYS DOH Vital Statistics, 2015-2023), with NYSED licensed marriage and family therapists by county (July 1, 2026) and rates per resident.',
        'temporalCoverage': '2015/2026',
        'spatialCoverage': 'New York State, United States (all 62 counties)',
        'variableMeasured': ['Marriages', 'Dissolutions of marriage', 'Divorces by duration of marriage', 'Divorces by number of children under 18', 'Licensed marriage and family therapists'],
    },
    'related': [
        {'label': 'Couples therapy', 'href': '/specialties/couples-therapy'},
        {'label': 'How many therapists does Monroe County have?', 'href': '/research/monroe-county-therapists'},
        {'label': 'Local support and crisis lines', 'href': '/resources'},
    ],
}
assert_text_has(page, str(m_lmft), n(m_div), n(m_mar), d1(m_lmft_rate), d1(nys_lmft_rate), f'{with_kids_pct}%', f'{ten_plus_pct}%')
write_page(page)
print(json.dumps({'m': results['monroe'], 'nys': results['nys'], 'ring': results['ring'], 'erie': results['erie'], 'hubs': hubs,
                  'trend': {y: (v['monroe_marriages'], v['monroe_dissolutions'], v['rest_of_state_dissolutions']) for y, v in results['trend'].items()}}, default=str))
