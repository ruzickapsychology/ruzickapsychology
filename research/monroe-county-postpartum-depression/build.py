#!/usr/bin/env python3
"""New parents and postpartum depression in Monroe County (Ruzicka Psychology /research)

An ESTIMATE, labeled as one on the page: births to Monroe County residents (NYS DOH Vital Statistics 2023, Table 7)
times the share of mothers in New York State outside New York City who reported symptoms of postpartum depression
in the 2022 PRAMS survey (12.4%, as published by NYS DOH). PRAMS does not publish county rates.

Inputs (raw/, fetch.sh; sources.json holds URL, retrieval date and SHA-256):
  * nysdoh-2023-table07.htm: Table 7, live births by mother's age and resident county, 2023.
  * nysdoh-maternal-depression.htm: NYS DOH page with the PRAMS figures (NYS 11.9%, NYC 11.5%, NYS excl. NYC 12.4%,
    about 12.7% across 2022 PRAMS sites) and the 10-20% clinical range it cites.
  * births-by-age-monroe-region-2008-2023.json: Health Data NY i7yg-w5rg, total births by year (trend only).
Writes results.json, src/data/research/monroe-county-postpartum-depression.json and the public CSV.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '_lib'))
from page import verify_sources, html_text, n, write_csv, write_page, assert_text_has  # noqa: E402

SLUG = 'monroe-county-postpartum-depression'
PUBLISHED = '2026-11-13'
RAW = os.path.join(HERE, 'raw')
verify_sources(HERE)
RING = ['Genesee', 'Livingston', 'Ontario', 'Orleans', 'Wayne']
AGES = ['10-14', '15-17', '18-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45+', 'N.S.']

# ---------- Table 7 (regex over page text) ----------
s = html_text(os.path.join(RAW, 'nysdoh-2023-table07.htm'))
assert "Table 7: Live Births by Mother's Age and Resident County, New York State - 2023" in s
head = s.find('County Mother\'s Age Total 10-14 15-17 18-19 20-24 25-29 30-34 35-39 40-44 45+ N.S.')
assert head > 0
body = s[head:s.find('Back to top', head)]
num = r'(\d[\d,]*)'
births = {}
for name in ['New York State', 'New York City', 'Rest of State', 'Monroe'] + RING:
    label = re.escape(name) + (' ' + re.escape(name) if name in ('New York State', 'New York City', 'Rest of State') else '')
    m = re.search(label + r' ' + ' '.join([num] * 11) + r'(?= [A-Z])', body)
    assert m, name
    vals = [int(x.replace(',', '')) for x in m.groups()]
    assert vals[0] == sum(vals[1:]), (name, vals)
    births[name] = {'total': vals[0], 'by_age': dict(zip(AGES, vals[1:]))}

# ---------- PRAMS rates as published on the NYS DOH page ----------
p = html_text(os.path.join(RAW, 'nysdoh-maternal-depression.htm'))
m = re.search(r'Survey data collected in (\d{4}) from new mothers through the CDC.s Pregnancy Risk Assessment Monitoring Systems \(PRAMS\) indicate that approximately ([\d.]+)% of women reported symptoms of postpartum depression within three months after the birth of a child', p)
assert m, 'PRAMS national sentence not found'
prams_year, us_rate = int(m.group(1)), float(m.group(2))
m = re.search(r'In New York State, ([\d.]+)% of mothers reported symptoms of postpartum depression after giving birth, ([\d.]+)% in New York City and ([\d.]+)% in New York State excluding New York City', p)
assert m, 'NY PRAMS sentence not found'
nys_rate, nyc_rate, rest_rate = (float(x) for x in m.groups())
m = re.search(r'In (\d{4}), the New York State Department of Health \(NYSDOH\) reported data from the Pregnancy Risk Assessment Monitoring Systems \(PRAMS\) examining postpartum depression screening in NYS\. The data showed that ([\d.]+)% of individuals who received a postpartum checkup were asked about depression, an increase from ([\d.]+)% in (\d{4})', p)
assert m, 'screening sentence not found'
screen_year, screen_rate, screen_prev, screen_prev_year = int(m.group(1)), float(m.group(2)), float(m.group(3)), int(m.group(4))
assert 'Postpartum Depression Usually within the first two to three months post-partum' in p and '10 to 20 percent of new mothers' in p
assert (prams_year, us_rate, nys_rate, nyc_rate, rest_rate) == (2022, 12.7, 11.9, 11.5, 12.4), (prams_year, us_rate, nys_rate, nyc_rate, rest_rate)

# ---------- Trend (Health Data NY) ----------
series = {}
for r in json.load(open(os.path.join(RAW, 'births-by-age-monroe-region-2008-2023.json'))):
    series.setdefault(r['county'], {})[int(r['year'])] = int(r['value'])
for c in ['Monroe'] + RING:  # the 2023 value in the open-data series must equal Table 7
    assert series[c][2023] == births[c]['total'], (c, series[c][2023], births[c]['total'])
m08, m23 = series['Monroe'][2008], series['Monroe'][2023]
m_change = round((m23 - m08) / m08 * 100)

# ---------- Estimates ----------
est = lambda b, r: b * r / 100
r10 = lambda x: int(round(x / 10.0) * 10)  # estimates are shown to the nearest 10
mon = births['Monroe']['total']
mon_est = est(mon, rest_rate)
ring_b = sum(births[c]['total'] for c in RING)
ring_est = est(ring_b, rest_rate)
mon_low, mon_high = est(mon, 10), est(mon, 20)
mon_nys = est(mon, nys_rate)
age25_34 = births['Monroe']['by_age']['25-29'] + births['Monroe']['by_age']['30-34']
under20 = sum(births['Monroe']['by_age'][a] for a in ('10-14', '15-17', '18-19'))
over35 = sum(births['Monroe']['by_age'][a] for a in ('35-39', '40-44', '45+'))
one_in = {6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten'}[round(100 / rest_rate)]

results = {'slug': SLUG, 'births_year': 2023, 'prams_year': prams_year, 'rates': {'us_sites': us_rate, 'nys': nys_rate, 'nyc': nyc_rate, 'nys_excl_nyc': rest_rate},
           'screening': {'year': screen_year, 'rate': screen_rate, 'prev_year': screen_prev_year, 'prev_rate': screen_prev},
           'births': births, 'monroe_estimate': mon_est, 'monroe_estimate_shown': r10(mon_est), 'ring_births': ring_b,
           'ring_estimate': ring_est, 'ring_estimate_shown': r10(ring_est), 'monroe_range_10_20': [mon_low, mon_high],
           'monroe_estimate_at_nys_rate': mon_nys, 'monroe_births_2008': m08, 'monroe_births_change_pct': m_change,
           'monroe_age_25_34': age25_34, 'monroe_under20': under20, 'monroe_35plus': over35, 'series': series}
json.dump(results, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)

# ---------- CSV ----------
rows = []
for name in ['Monroe'] + RING:
    b = births[name]
    rows.append([name + ' County', 'county', b['total'], *[b['by_age'][a] for a in AGES], rest_rate, f'{est(b["total"], rest_rate):.1f}'])
rows.append(['Five neighboring counties combined', 'sum', ring_b, *[sum(births[c]['by_age'][a] for c in RING) for a in AGES], rest_rate, f'{ring_est:.1f}'])
rows.append(['New York State excluding New York City', 'region', births['Rest of State']['total'], *[births['Rest of State']['by_age'][a] for a in AGES], rest_rate, f'{est(births["Rest of State"]["total"], rest_rate):.1f}'])
rows.append(['New York State', 'state', births['New York State']['total'], *[births['New York State']['by_age'][a] for a in AGES], nys_rate, f'{est(births["New York State"]["total"], nys_rate):.1f}'])
csv_href, csv_rows = write_csv(SLUG, ['area', 'level', 'births_2023', *[f'births_mother_age_{a.replace("+", "plus").replace(".", "").replace("-", "_")}' for a in AGES],
                                      'prams_2022_rate_pct_applied', 'estimated_mothers_likely_to_report_symptoms'], rows)

# ---------- Page ----------
E, RE_ = r10(mon_est), r10(ring_est)
headline = (f'About {n(E)} Monroe County mothers a year are likely to report symptoms of postpartum depression. '
            f'That estimate applies the {rest_rate}% rate reported by mothers in New York State outside New York City in {prams_year} '
            f'to the {n(mon)} babies born to Monroe County residents in 2023.')
age_bars = []
labels = {'10-14': 'Under 15', '15-17': '15 to 17', '18-19': '18 to 19', '20-24': '20 to 24', '25-29': '25 to 29', '30-34': '30 to 34',
          '35-39': '35 to 39', '40-44': '40 to 44', '45+': '45 and older'}
peak = max(labels, key=lambda a: births['Monroe']['by_age'][a])
for a, lab in labels.items():
    v = births['Monroe']['by_age'][a]
    age_bars.append({'label': lab, 'value': v, 'display': n(v), 'tone': 'highlight' if a == peak else 'default'})

def row(label, b, rate):
    return [label, n(b), f'{rate}%', n(r10(est(b, rate)))]
table_rows = [row('Monroe County', mon, rest_rate)] + \
    [row(f'{c} County', births[c]['total'], rest_rate) for c in sorted(RING, key=lambda c: -births[c]['total'])] + \
    [row('Five neighboring counties combined', ring_b, rest_rate),
     row('New York State excluding New York City', births['Rest of State']['total'], rest_rate),
     row('New York State', births['New York State']['total'], nys_rate)]

doh = 'NYS Department of Health, Vital Statistics of New York State 2023, Table 7'
prams = f'NYS Department of Health, from CDC PRAMS {prams_year} survey data'
page = {
    'slug': SLUG,
    'kind': 'study',
    'title': 'New Parents and Postpartum Depression in Monroe County',
    'metaTitle': 'Postpartum Depression in Monroe County, NY: New Parent Data',
    'metaDescription': (f'About {n(E)} Monroe County mothers a year are likely to report postpartum depression symptoms: '
                        f'{rest_rate}% of {n(mon)} births in 2023. NYS DOH and PRAMS data.'),
    'eyebrow': 'Data study · Rochester and Monroe County',
    'headline': headline,
    'datePublished': PUBLISHED,
    'dateModified': PUBLISHED,
    'card': {'value': f'About {n(E)}', 'label': 'Monroe County mothers a year likely to report postpartum depression symptoms (estimate)',
             'summary': f'{rest_rate}% of new mothers in New York outside New York City reported symptoms in {prams_year}; Monroe County had {n(mon)} births in 2023.'},
    'blocks': [
        {'type': 'keyNumbers', 'heading': 'Key numbers', 'items': [
            {'value': n(mon), 'label': f'babies born to Monroe County residents in 2023, down {abs(m_change)}% from {n(m08)} in 2008', 'source': doh},
            {'value': f'{rest_rate}%', 'label': f'of mothers in New York State outside New York City reported symptoms of postpartum depression after giving birth, about one in {one_in} (statewide: {nys_rate}%; New York City: {nyc_rate}%)', 'source': prams},
            {'value': f'About {n(E)}', 'label': f'Monroe County mothers a year likely to report symptoms, if the {rest_rate}% rate applies to the county\'s {n(mon)} births (an estimate, not a count)', 'source': 'Ruzicka Psychology calculation from the two sources above'},
            {'value': f'About {n(RE_)}', 'label': f'more in Genesee, Livingston, Ontario, Orleans and Wayne counties, which had {n(ring_b)} births between them in 2023 (same method)', 'source': 'Ruzicka Psychology calculation from the two sources above'},
            {'value': f'{screen_rate}%', 'label': f'of New York mothers who had a postpartum checkup were asked about depression in {screen_year}, up from {screen_prev}% in {screen_prev_year}', 'source': 'NYS Department of Health, from New York PRAMS data'},
        ]},
        {'type': 'notice', 'text': f'If you are in crisis or thinking about harming yourself, call or text 988 (Suicide & Crisis Lifeline, free, 24/7). If you or anyone else is in immediate danger, call 911. The National Maternal Mental Health Hotline, 1-833-TLC-MAMA (1-833-852-6262), offers free, confidential support before, during and after pregnancy, 24/7; it is not a crisis line. Local lines are on our [resources page](/resources).'},
        {'type': 'chart', 'heading': 'Monroe County births by mother\'s age, 2023',
         'description': f'{n(mon)} live births to Monroe County residents. Most were to mothers aged 25 to 34 ({n(age25_34)}).',
         'unit': 'births', 'bars': age_bars,
         'note': f'Source: {doh}. Mother\'s age not stated: {births["Monroe"]["by_age"]["N.S."]}.'},
        {'type': 'table', 'heading': 'Estimated mothers likely to report symptoms, by area',
         'caption': f'Births in 2023 and the {prams_year} PRAMS rate applied to them. Estimates rounded to the nearest 10.',
         'columns': ['Area', 'Births (2023)', 'PRAMS rate applied', 'Estimated mothers likely to report symptoms'],
         'rows': table_rows, 'csv': True},
        {'type': 'prose', 'eyebrow': 'Findings', 'heading': 'What the data shows', 'paragraphs': [
            f'In {prams_year}, {rest_rate}% of mothers in New York State outside New York City told the PRAMS survey they had symptoms of postpartum depression after giving birth, according to the New York State Department of Health. That is about one mother in {one_in}. The statewide figure was {nys_rate}%, and across the states and territories in the {prams_year} survey it was about {us_rate}%.',
            f'Monroe County residents had {n(mon)} babies in 2023. If Monroe mothers report symptoms at the same rate as mothers elsewhere in upstate and suburban New York, about {n(E)} of them would be likely to report symptoms of postpartum depression each year. Using the statewide rate of {nys_rate}% instead gives about {n(r10(mon_nys))}.',
            f'NYS Department of Health also cites a wider clinical range: postpartum depression affects 10 to 20 percent of new mothers. Applied to Monroe County births, that would be roughly {n(r10(mon_low))} to {n(r10(mon_high))} mothers a year.',
            f'Most Monroe County babies are born to mothers in their late twenties and early thirties: {n(age25_34)} of the {n(mon)} births in 2023 were to mothers aged 25 to 34. {n(under20)} were to mothers under 20 and {n(over35)} to mothers 35 or older.',
            f'Births in the county have been falling, from {n(m08)} in 2008 to {n(mon)} in 2023.',
        ]},
        {'type': 'points', 'eyebrow': 'For new and expecting parents', 'heading': 'What this means for new and expecting parents', 'items': [
            f'Postpartum depression symptoms are common. About one in {one_in} new mothers in New York outside New York City reported them. Feeling this way is not a personal failing.',
            'Symptoms can begin during pregnancy or at any point in the first year after birth, and they can look different from the short-lived "baby blues" that many parents have in the first two weeks.',
            f'Asking about mood is now a routine part of postpartum care in New York: {screen_rate}% of mothers who had a postpartum checkup were asked about depression in {screen_year}. You can raise it with your obstetrician, midwife or your baby\'s pediatrician at any visit.',
            'Support exists between appointments too. Free lines for new and expecting parents, such as the National Maternal Mental Health Hotline (1-833-TLC-MAMA), are listed on our [resources page](/resources). Ruzicka Psychology offers [postpartum depression therapy](/specialties/postpartum-depression-therapy) in Rochester and virtually across New York.',
        ]},
        {'type': 'prose', 'eyebrow': 'Method', 'heading': 'How we estimated it', 'paragraphs': [
            'Births: the number of live births to mothers living in each county in 2023, from the New York State Department of Health\'s Vital Statistics of New York State 2023, Table 7. Counties are where the mother lives, not where the baby was born. The 2008 figure for the trend comes from the same series on Health Data NY.',
            f'Rate: the share of mothers who reported symptoms of postpartum depression in the {prams_year} Pregnancy Risk Assessment Monitoring System (PRAMS) survey, as published by the New York State Department of Health. PRAMS surveys a sample of new mothers a few months after birth. In New York, the State Health Department runs the survey outside New York City, so the "New York State excluding New York City" rate of {rest_rate}% is the closest published rate for Monroe County.',
            f'Estimate: births multiplied by the rate, rounded to the nearest 10. For Monroe County: {n(mon)} x {rest_rate}% = {mon_est:,.0f}, shown as about {n(E)}.',
        ]},
        {'type': 'prose', 'eyebrow': 'Limits', 'heading': 'What this estimate cannot tell you', 'paragraphs': [
            'This is an estimate, not a count. PRAMS does not publish rates for single counties, and Monroe County\'s true rate may be higher or lower than the regional one.',
            'Births are not exactly mothers: twins and triplets count as separate births, so the number of mothers is a little lower than the number of births.',
            f'The years differ: births are from 2023 and the survey rate from {prams_year}.',
            'PRAMS measures symptoms that mothers report on a short survey, not a diagnosis. It covers mothers only, so it says nothing about fathers or partners, who can also have depression after a baby arrives.',
            'This page describes how common symptoms are. It is not a screening tool and it is not medical advice.',
        ]},
    ],
    'sources': [
        {'name': 'NYS Department of Health, Vital Statistics of New York State 2023, Table 7: Live Births by Mother\'s Age and Resident County', 'period': '2023 births (table revised January 2026)', 'url': 'https://www.health.ny.gov/statistics/vital_statistics/2023/table07.htm'},
        {'name': 'NYS Department of Health, Maternal Depression: Information for Health Care Providers, "What is Maternal Depression?"', 'period': f'PRAMS {prams_year} survey data; screening data {screen_year}; page revised November 2025', 'url': 'https://www.health.ny.gov/community/pregnancy/health_care/perinatal/maternal_depression/providers/what_is_maternial_depression.htm'},
        {'name': 'Health Data NY, Vital Statistics Live Births by Mother\'s Age and Resident County: Beginning 2008', 'period': '2008-2023', 'url': 'https://health.data.ny.gov/d/i7yg-w5rg'},
    ],
    'citation': 'Ruzicka Psychology. "New Parents and Postpartum Depression in Monroe County." November 13, 2026. https://www.ruzickapsychology.com/research/monroe-county-postpartum-depression. Data: NYS Department of Health; CDC PRAMS.',
    'csv': {'href': csv_href, 'rows': csv_rows, 'label': f'Births by mother\'s age in 2023 for Monroe County, its five neighboring counties, New York State excluding New York City and New York State, with the PRAMS rate applied and the estimate (CSV, {csv_rows} rows)'},
    'dataset': {
        'name': 'Estimated mothers likely to report postpartum depression symptoms, Monroe County and neighboring counties, New York',
        'description': f'Live births by mother\'s age and resident county in 2023 (NYS DOH Vital Statistics Table 7) with the {prams_year} PRAMS rate of self-reported postpartum depression symptoms for New York State excluding New York City ({rest_rate}%) applied as an estimate.',
        'temporalCoverage': '2008/2023',  # births trend 2008-2023; PRAMS rate 2022; screening 2016 and 2020
        'spatialCoverage': 'Monroe, Genesee, Livingston, Ontario, Orleans and Wayne counties, New York, United States',
        'variableMeasured': ['Live births by mother\'s age', 'Share of mothers reporting postpartum depression symptoms (PRAMS)', 'Estimated mothers with postpartum depression symptoms'],
    },
    'related': [
        {'label': 'Postpartum depression therapy', 'href': '/specialties/postpartum-depression-therapy'},
        {'label': 'Perinatal and postpartum therapy', 'href': '/specialties/perinatal-postpartum-therapy'},
        {'label': 'Crisis and pregnancy support resources', 'href': '/resources'},
    ],
}
assert_text_has(page, n(mon), f'{rest_rate}%', f'About {n(E)}', f'{nys_rate}%', n(RE_))
write_page(page)
print(json.dumps({'births': {k: v['total'] for k, v in births.items()}, 'rates': [us_rate, nys_rate, nyc_rate, rest_rate], 'est': [mon_est, E],
                  'ring': [ring_b, ring_est, RE_], 'range': [mon_low, mon_high], 'nys_rate_est': mon_nys, 'trend': [m08, m23, m_change],
                  'age': [age25_34, under20, over35, peak], 'screen': [screen_year, screen_rate, screen_prev_year, screen_prev], 'one_in': one_in}))
