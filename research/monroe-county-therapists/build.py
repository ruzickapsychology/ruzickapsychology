#!/usr/bin/env python3
"""How many therapists does Monroe County have? (Ruzicka Psychology /research)

Inputs (raw/, downloaded by fetch.sh; sources.json holds URL, retrieval date and SHA-256):
  * NYSED Office of the Professions "License Statistics" pages for psychology, licensed clinical social work (LCSW),
    mental health counseling (LMHC) and marriage and family therapy (LMFT): licensees by county of the primary
    mailing address on record, as of July 1, 2026, plus licenses issued statewide per calendar year 2021-2025.
  * U.S. Census Bureau Vintage 2025 county population estimates (POPESTIMATE2025 = July 1, 2025).
Rate = licensees / population x 100,000. "Neighboring counties" = the five counties that border Monroe:
Genesee, Livingston, Ontario, Orleans and Wayne.

Writes results.json (here), src/data/research/monroe-county-therapists.json (page) and
public/research/monroe-county-therapists.csv (all 62 counties + New York State).
"""
import csv, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '_lib'))
from page import verify_sources, html_text, n, d1, write_csv, write_page, assert_text_has, LICENSE  # noqa: E402

SLUG = 'monroe-county-therapists'
PUBLISHED = '2026-11-13'
RAW = os.path.join(HERE, 'raw')
verify_sources(HERE)

PROF = [  # key, file, short label, long label
    ('psych', 'nysed-psychology.html', 'Psychologists', 'licensed psychologists'),
    ('lcsw', 'nysed-licensed-clinical-social-worker.html', 'LCSWs', 'licensed clinical social workers (LCSWs)'),
    ('lmhc', 'nysed-mental-health-counselors.html', 'LMHCs', 'licensed mental health counselors (LMHCs)'),
    ('lmft', 'nysed-marriage-and-family-therapists.html', 'LMFTs', 'licensed marriage and family therapists (LMFTs)'),
]
KEYS = [p[0] for p in PROF]
RING = ['Genesee', 'Livingston', 'Ontario', 'Orleans', 'Wayne']  # the five counties bordering Monroe
PEERS = [('Erie', 'Erie County (Buffalo)'), ('Onondaga', 'Onondaga County (Syracuse)')]


def parse(path):
    """County counts read from the page text with a regex (check.py reads the table cells instead)."""
    s = html_text(path)
    asof = re.search(r'as of (\w+ \d{1,2}, \d{4})', s, re.I).group(1)
    m = re.search(r'Licenses Issued, Past 5 Calendar Years Profession Title ((?:\d{4} ){5})(.+?) ((?:[\d,]+ ){4}[\d,]+)', s, re.I)
    issued = dict(zip([int(y) for y in m.group(1).split()], [int(x.replace(',', '')) for x in m.group(3).split()]))
    i, j = s.find('County Number County Number County Number'), s.find('County of location')
    assert i > 0 and j > i, path
    block = s[i + len('County Number County Number County Number'):j]
    d = {}
    for name, num in re.findall(r"([A-Z][A-Za-z.' ]*?|OTHER US|NON-US|N?Y?S TOTAL|TOTAL) (\d[\d,]*)", block):
        name = 'NYS TOTAL' if name.strip() == 'YS TOTAL' else name.strip()
        d[name] = int(num.replace(',', ''))
    note = 'being registered, however, does not necessarily mean the licensee is actively engaged in practice' in s
    return asof, issued, d, note


lic, issued, gaps = {}, {}, {}
for key, f, *_ in PROF:
    asof, iss, d, note = parse(os.path.join(RAW, f))
    assert asof == 'July 1, 2026', (key, asof)
    assert note, f'{key}: NYSED footnote about registration not found'
    counties = {k: v for k, v in d.items() if k not in ('NYS TOTAL', 'OTHER US', 'NON-US', 'TOTAL')}
    assert len(counties) == 62, (key, len(counties))
    assert d['NYS TOTAL'] + d['OTHER US'] + d['NON-US'] == d['TOTAL'], key
    # NYSED's county rows do not always add up to its own "NYS TOTAL" (LCSW: 7 short; LMFT: 1 over).
    # Keep both as published, record the gap, stop if it is ever above 0.1%.
    gap = d['NYS TOTAL'] - sum(counties.values())
    assert abs(gap) <= 0.001 * d['NYS TOTAL'], (key, gap)
    if gap:
        gaps[key] = gap
    lic[key] = {'counties': counties, 'nys': d['NYS TOTAL']}
    issued[key] = iss

pop = {}
for r in csv.DictReader(open(os.path.join(RAW, 'co-est2025-alldata.csv'), encoding='latin-1')):
    if r['STATE'] == '36':
        pop['NYS' if r['COUNTY'] == '000' else r['CTYNAME'].replace(' County', '')] = int(r['POPESTIMATE2025'])
assert len(pop) == 63 and set(lic['psych']['counties']) <= set(pop)

rate = lambda c, p: c / p * 100000


def area(name, label, counties):
    p = sum(pop[c] for c in counties)
    counts = {k: sum(lic[k]['counties'][c] for c in counties) for k in KEYS}
    total = sum(counts.values())
    return {'name': label, 'counties': counties, 'pop': p, 'counts': counts, 'total': total,
            'rate': round(rate(total, p), 1), 'psych_rate': round(rate(counts['psych'], p), 1),
            'per_clinician': round(p / total)}


monroe = area('Monroe', 'Monroe County', ['Monroe'])
ring = area('ring', 'Five neighboring counties', RING)
ring_each = [area(c, f'{c} County', [c]) for c in RING]
peers = [area(c, label, [c]) for c, label in PEERS]
nys_counts = {k: lic[k]['nys'] for k in KEYS}
nys_total = sum(nys_counts.values())
nys = {'name': 'New York State', 'pop': pop['NYS'], 'counts': nys_counts, 'total': nys_total,
       'rate': round(rate(nys_total, pop['NYS']), 1), 'psych_rate': round(rate(nys_counts['psych'], pop['NYS']), 1),
       'per_clinician': round(pop['NYS'] / nys_total)}

all62 = sorted(lic['psych']['counties'])
tot = lambda c: sum(lic[k]['counties'][c] for k in KEYS)
rank_total = sorted(all62, key=lambda c: -tot(c) / pop[c])
rank_psych = sorted(all62, key=lambda c: -lic['psych']['counties'][c] / pop[c])
monroe_rank = rank_total.index('Monroe') + 1
monroe_psych_rank = rank_psych.index('Monroe') + 1
ratio = round(monroe['rate'] / ring['rate'], 1)
psych_ratio = round(monroe['psych_rate'] / ring['psych_rate'], 1)
iss_years = sorted(issued['psych'])
iss4 = {y: sum(issued[k][y] for k in KEYS) for y in iss_years}
iss_change = round((iss4[2025] - iss4[2024]) / iss4[2024] * 100)
lowest_ring = min(ring_each, key=lambda a: a['rate'])

results = {'slug': SLUG, 'as_of': 'July 1, 2026', 'population_year': 2025, 'monroe': monroe, 'ring': ring,
           'ring_each': ring_each, 'peers': peers, 'nys': nys, 'monroe_rank_of_62': monroe_rank,
           'monroe_psych_rank_of_62': monroe_psych_rank, 'ratio_monroe_ring': ratio, 'psych_ratio_monroe_ring': psych_ratio,
           'issued_statewide': {k: issued[k] for k in KEYS}, 'issued_four': iss4, 'issued_change_2024_2025_pct': iss_change,
           'nysed_table_gaps': gaps}
json.dump(results, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)

# ---------- CSV: all 62 counties + New York State ----------
rows = []
for c in all62:
    counts = [lic[k]['counties'][c] for k in KEYS]
    rows.append([c, 'yes' if c in RING else ('Monroe' if c == 'Monroe' else ''), pop[c], *counts, sum(counts),
                 d1(rate(sum(counts), pop[c])).replace(',', ''), d1(rate(counts[0], pop[c])).replace(',', ''),
                 rank_total.index(c) + 1])
rows.append(['New York State (NYSED "NYS TOTAL")', '', pop['NYS'], *[nys_counts[k] for k in KEYS], nys_total,
             str(nys['rate']), str(nys['psych_rate']), ''])
csv_href, csv_rows = write_csv(SLUG, [
    'county', 'borders_monroe', 'population_2025', 'psychologists', 'lcsw', 'lmhc', 'lmft', 'four_professions_total',
    'per_100k_residents', 'psychologists_per_100k', 'rank_of_62_per_100k'], rows)

# ---------- Page text (every figure below is formatted from the computed values) ----------
M, R = monroe, ring
headline = (f'As of July 1, 2026, Monroe County had {n(M["total"])} licensed psychologists, clinical social workers, '
            f'mental health counselors and marriage and family therapists on New York\'s licensing rolls: '
            f'{d1(M["rate"])} per 100,000 residents, compared with {d1(R["rate"])} per 100,000 in the five counties around it.')

def area_row(a):
    return [a['name'], n(a['pop']), *[n(a['counts'][k]) for k in KEYS], n(a['total']), d1(a['rate'])]

table_rows = [area_row(monroe)] + [area_row(a) for a in sorted(ring_each, key=lambda a: -a['rate'])] + \
    [area_row(ring)] + [area_row(a) for a in peers] + [area_row(nys)]

bars = [{'label': 'Monroe County', 'value': M['rate'], 'display': d1(M['rate']), 'tone': 'highlight'}]
bars += [{'label': f'{a["name"]}', 'value': a['rate'], 'display': d1(a['rate']), 'tone': 'default'}
         for a in sorted(ring_each, key=lambda a: -a['rate'])]
bars += [{'label': 'Five neighboring counties combined', 'value': R['rate'], 'display': d1(R['rate']), 'tone': 'muted'}]
bars += [{'label': a['name'], 'value': a['rate'], 'display': d1(a['rate']), 'tone': 'compare'} for a in peers]
bars += [{'label': 'New York State', 'value': nys['rate'], 'display': d1(nys['rate']), 'tone': 'compare'}]

nysed = 'NYSED Office of the Professions, as of July 1, 2026; population: U.S. Census Bureau, July 1, 2025'
page = {
    'slug': SLUG,
    'kind': 'study',
    'title': 'How Many Therapists Does Monroe County Have?',
    'metaTitle': 'How Many Therapists Does Monroe County, NY Have?',
    'metaDescription': (f'Monroe County has {n(M["total"])} licensed psychologists and therapists, {d1(M["rate"])} per 100,000 '
                        f'residents, vs {d1(R["rate"])} in the five counties around it. NYSED data, July 2026.'),
    'eyebrow': 'Data study · Rochester and Monroe County',
    'headline': headline,
    'datePublished': PUBLISHED,
    'dateModified': PUBLISHED,
    'card': {'value': d1(M['rate']), 'label': 'licensed psychologists and therapists per 100,000 Monroe County residents',
             'summary': f'Monroe County vs the five counties around it ({d1(R["rate"])} per 100,000), from New York State licensing data.'},
    'blocks': [
        {'type': 'keyNumbers', 'heading': 'Key numbers', 'items': [
            {'value': n(M['total']),
             'label': f'licensed psychologists ({n(M["counts"]["psych"])}), LCSWs ({n(M["counts"]["lcsw"])}), LMHCs ({n(M["counts"]["lmhc"])}) and LMFTs ({n(M["counts"]["lmft"])}) with a Monroe County mailing address',
             'source': 'NYSED Office of the Professions, as of July 1, 2026'},
            {'value': d1(M['rate']),
             'label': f'per 100,000 Monroe County residents, about one for every {n(M["per_clinician"])} people; New York State: {d1(nys["rate"])}',
             'source': nysed},
            {'value': d1(R['rate']),
             'label': f'per 100,000 residents in Genesee, Livingston, Ontario, Orleans and Wayne counties combined ({n(R["total"])} clinicians for {n(R["pop"])} people)',
             'source': nysed},
            {'value': f'{monroe_rank} of 62',
             'label': f'Monroe County\'s rank among New York\'s 62 counties by licensed psychologists and therapists per resident ({monroe_psych_rank} of 62 for psychologists alone)',
             'source': nysed},
            {'value': n(iss4[2025]),
             'label': f'new licenses issued statewide in these four professions in 2025, up {iss_change}% from {n(iss4[2024])} in 2024 (psychologists: {n(issued["psych"][2025])}, up from {n(issued["psych"][2024])})',
             'source': 'NYSED Office of the Professions, licenses issued by calendar year'},
        ]},
        {'type': 'chart', 'heading': 'Licensed psychologists and therapists per 100,000 residents',
         'description': f'Psychologists, LCSWs, LMHCs and LMFTs combined, by county of mailing address, as of July 1, 2026. Monroe County is highlighted.',
         'unit': 'per 100,000 residents', 'bars': bars,
         'note': 'Sources: NYSED Office of the Professions license statistics (July 1, 2026); U.S. Census Bureau Vintage 2025 population estimates.'},
        {'type': 'table', 'heading': 'The numbers behind the chart',
         'caption': 'Licensees by county of mailing address, as of July 1, 2026, and population on July 1, 2025',
         'columns': ['Area', 'Population (2025)', 'Psychologists', 'LCSWs', 'LMHCs', 'LMFTs', 'Total', 'Per 100,000'],
         'rows': table_rows, 'csv': True},
        {'type': 'prose', 'eyebrow': 'Findings', 'heading': 'What the data shows', 'paragraphs': [
            f'Monroe County has more licensed psychologists and therapists per resident than New York State as a whole: {d1(M["rate"])} per 100,000 residents against {d1(nys["rate"])} statewide. It ranks {monroe_rank} of New York\'s 62 counties on this measure.',
            f'Step outside the county line and the number drops. The five counties that border Monroe (Genesee, Livingston, Ontario, Orleans and Wayne) have {n(R["total"])} licensed clinicians in these four professions for {n(R["pop"])} residents: {d1(R["rate"])} per 100,000. Monroe\'s rate is {ratio} times theirs.',
            f'The gap is widest for psychologists. Monroe County has {n(M["counts"]["psych"])} licensed psychologists, {d1(M["psych_rate"])} per 100,000 residents. The five neighboring counties have {n(R["counts"]["psych"])} between them, {d1(R["psych_rate"])} per 100,000. Erie County, home to Buffalo, has {n(peers[0]["counts"]["psych"])} psychologists for a larger population ({d1(peers[0]["psych_rate"])} per 100,000).',
            f'{lowest_ring["name"]} has the fewest per resident of the five: {n(lowest_ring["total"])} licensed clinicians in these professions for {n(lowest_ring["pop"])} residents ({d1(lowest_ring["rate"])} per 100,000), including {n(lowest_ring["counts"]["psych"])} psychologists.',
            f'More people are entering these professions. New York issued {n(iss4[2025])} new licenses in the four professions in 2025, up from {n(iss4[2024])} in 2024. NYSED publishes these statewide, not by county.',
        ]},
        {'type': 'points', 'eyebrow': 'For people looking for a therapist', 'heading': 'What this means if you are looking for therapy', 'items': [
            'A license count is not the same as an open appointment. These numbers show how many licensed clinicians list a mailing address in each county. They do not show who is taking new clients, which insurance they accept or how long the wait is.',
            'If you live in Genesee, Livingston, Ontario, Orleans or Wayne County, you may have fewer local choices. Video sessions are one way to widen them: Ruzicka Psychology sees adults in person in Rochester and [virtually across New York](/specialties).',
            'You can check any New York clinician\'s license, and its current registration, on [NYSED\'s free online verification search](https://eservices.nysed.gov/professions/verification-search).',
            'If you are deciding whether to start, a short consultation call can help you ask about fit, fees and availability before you commit. You can [request a free 15-minute phone consultation](/contact).',
        ]},
        {'type': 'prose', 'eyebrow': 'Method', 'heading': 'How we counted', 'paragraphs': [
            'We took the number of licensees in four professions from the New York State Education Department (NYSED) Office of the Professions license statistics pages: psychology, licensed clinical social work (LCSW), mental health counseling (LMHC) and marriage and family therapy (LMFT). NYSED lists licensees by the county of their primary mailing address on record, as of July 1, 2026.',
            'We divided each county\'s total by its population on July 1, 2025, from the U.S. Census Bureau\'s Vintage 2025 county estimates, and multiplied by 100,000. The five neighboring counties are the five that share a border with Monroe County. The New York State row uses NYSED\'s own "NYS TOTAL" line.',
            'The new-license figures come from the "Licenses Issued, Past 5 Calendar Years" table on the same NYSED pages. They are statewide totals.',
        ]},
        {'type': 'prose', 'eyebrow': 'Limits', 'heading': 'What this data cannot tell you', 'paragraphs': [
            'NYSED counts people by mailing address, which may be a home rather than an office. A clinician who lives in Ontario County and practices in Rochester is counted in Ontario County, and the reverse.',
            'NYSED notes that being registered "does not necessarily mean the licensee is actively engaged in practice." The counts include people who are retired from practice, work in hospitals, schools or research, see only children, or do not provide therapy at all. They do not include psychiatrists or psychiatric nurse practitioners, who are licensed separately.',
            f'NYSED\'s county rows do not always add up to its statewide line: on the LCSW page the counties sum to {abs(gaps.get("lcsw", 0))} fewer than the "NYS TOTAL", and on the LMFT page to {abs(gaps.get("lmft", 0))} more. We show the figures as NYSED publishes them.',
            'This study measures supply only. It does not measure wait times, insurance acceptance, quality of care or need.',
        ]},
    ],
    'sources': [
        {'name': 'NYSED Office of the Professions, License Statistics: Psychology', 'period': 'As of July 1, 2026; licenses issued 2021-2025', 'url': 'https://www.op.nysed.gov/professions/psychology/license-statistics'},
        {'name': 'NYSED Office of the Professions, License Statistics: Licensed Clinical Social Worker', 'period': 'As of July 1, 2026; licenses issued 2021-2025', 'url': 'https://www.op.nysed.gov/professions/licensed-clinical-social-worker/license-statistics'},
        {'name': 'NYSED Office of the Professions, License Statistics: Mental Health Counselors', 'period': 'As of July 1, 2026; licenses issued 2021-2025', 'url': 'https://www.op.nysed.gov/professions/mental-health-counselors/license-statistics'},
        {'name': 'NYSED Office of the Professions, License Statistics: Marriage and Family Therapists', 'period': 'As of July 1, 2026; licenses issued 2021-2025', 'url': 'https://www.op.nysed.gov/professions/marriage-and-family-therapists/license-statistics'},
        {'name': 'U.S. Census Bureau, County Population Totals, Vintage 2025 (co-est2025-alldata)', 'period': 'July 1, 2025 estimates', 'url': 'https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv'},
    ],
    'citation': 'Ruzicka Psychology. "How Many Therapists Does Monroe County Have?" November 13, 2026. https://www.ruzickapsychology.com/research/monroe-county-therapists. Data: NYSED Office of the Professions; U.S. Census Bureau.',
    'csv': {'href': csv_href, 'rows': csv_rows, 'label': f'Licensed psychologists, LCSWs, LMHCs and LMFTs for all 62 New York counties, with 2025 population, rate per 100,000 and rank (CSV, {csv_rows} rows)'},
    'dataset': {
        'name': 'Licensed psychologists and therapists per 100,000 residents, New York counties, July 2026',
        'description': 'Licensees in four NYSED-licensed professions (psychology, LCSW, LMHC, LMFT) by county of primary mailing address as of July 1, 2026, with U.S. Census Bureau July 1, 2025 county population and rate per 100,000, for all 62 New York counties and New York State.',
        'temporalCoverage': '2025-07-01/2026-07-01',
        'spatialCoverage': 'New York State, United States (62 counties; focus on Monroe County and Genesee, Livingston, Ontario, Orleans and Wayne counties)',
        'variableMeasured': ['Licensed psychologists', 'Licensed clinical social workers', 'Licensed mental health counselors', 'Licensed marriage and family therapists', 'Population', 'Licensees per 100,000 residents'],
    },
    'related': [
        {'label': 'Therapy specialties', 'href': '/specialties'},
        {'label': 'Crisis and support resources', 'href': '/resources'},
    ],
}
assert_text_has(page, n(M['total']), d1(M['rate']), d1(R['rate']), n(M['counts']['psych']), d1(nys['rate']))
write_page(page)
print(json.dumps({'monroe': [M['total'], M['rate'], M['psych_rate'], M['per_clinician']], 'ring': [R['total'], R['pop'], R['rate'], R['psych_rate']],
                  'nys': [nys_total, nys['rate']], 'rank': monroe_rank, 'psych_rank': monroe_psych_rank, 'ratio': ratio,
                  'iss4': iss4, 'iss_change': iss_change, 'gaps': gaps, 'lowest_ring': [lowest_ring['name'], lowest_ring['rate']]}))
