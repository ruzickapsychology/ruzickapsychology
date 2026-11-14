#!/usr/bin/env python3
"""Independent check of the statistics page, by a different route than build.py.

  * PLACES county estimates re-queried LIVE (one query per measure); ranks, ties and medians recomputed.
  * HRSA: the full mental health HPSA file re-downloaded LIVE and read by HPSA ID (build.py reads the Monroe extract).
  * 988: the July 2026 PDF re-downloaded and the New York row rebuilt from text positions (build.py uses layout text).
  * Figures carried over from the four studies: each study's own check.json must have passed, and each figure must
    appear in that study's page text, so the two pages cannot disagree.
Checks the page text holds every recomputed value. Writes check.json; exits 1 on any mismatch.
"""
import csv, io, json, os, re, statistics, sys, urllib.parse, urllib.request
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
pj = lambda s: json.dumps(json.load(open(os.path.join(REPO, 'src', 'data', 'research', f'{s}.json'))), ensure_ascii=False)
PAGE_TEXT = pj('rochester-monroe-county-mental-health-statistics')
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'}


def get(url, params=None, raw=False):
    if params:
        url += '?' + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
        b = r.read()
    return b if raw else json.loads(b.decode('utf-8'))


out, fails = [], []


def check(name, expected, got):
    ok = expected == got
    out.append({'check': name, 'expected': expected, 'source': got, 'ok': ok})
    if not ok:
        fails.append(name)
    print(('OK  ' if ok else 'FAIL'), name, '| expected', expected, '| source', got)


# PLACES county
cty = {}
for m in ('LONELINESS', 'EMOTIONSPT', 'MHLTH', 'DEPRESSION'):
    rows = get('https://data.cdc.gov/resource/swc5-untb.json', {'$where': f"stateabbr='NY' AND measureid='{m}' AND datavaluetypeid='CrdPrv'", '$limit': 200})
    cty[m] = {r['locationname']: float(r['data_value']) for r in rows}
check('NY counties per measure', [62, 62, 62, 62], [len(v) for v in cty.values()])
mon = {m: v['Monroe'] for m, v in cty.items()}
check('Monroe loneliness / support / distress / depression', {'LONELINESS': 32.5, 'EMOTIONSPT': 22.9, 'MHLTH': 15.3, 'DEPRESSION': 21.9}, mon)
check('county medians: loneliness / distress', [32.3, 16.2], [statistics.median(cty['LONELINESS'].values()), statistics.median(cty['MHLTH'].values())])
dep = cty['DEPRESSION']
check('depression: counties strictly higher / tied at 21.9', [5, 3], [sum(1 for x in dep.values() if x > 21.9), sum(1 for x in dep.values() if x == 21.9)])

# HRSA, full file live
data = get('https://data.hrsa.gov/DataDownload/DD_Files/BCD_HPSA_FCT_DET_MH.csv', raw=True).decode('utf-8-sig')
h = [r for r in csv.DictReader(io.StringIO(data)) if r['HPSA ID'] == '7368573260']
check('HPSA 7368573260 rows found', True, len(h) > 0)
r = h[0]
check('HPSA name / status / discipline / type', ['ME-City of Rochester', 'Designated', 'Mental Health', 'Medicaid Eligible Population HPSA'],
      [r['HPSA Name'], r['HPSA Status'], r['HPSA Discipline Class'], r['HPSA Population Type']])
check('HPSA score / population / designation date', [19, 129319, '06/28/2022'], [int(r['HPSA Score']), int(float(r['HPSA Designation Population'])), r['HPSA Designation Date']])
comps = {re.match(r'Census Tract ([\d.]+),', x['HPSA Component Name']).group(1) for x in h}
city2020 = {r['tract'] for r in csv.DictReader(open(os.path.join(REPO, 'public', 'research', 'rochester-loneliness-map.csv'))) if r['town'] == 'Rochester (city)'}
check('HPSA tract components / of them 2020 city tracts ("most of them in the City")', [88, 69], [len(comps), len(comps & city2020)])
check('one designated "ME-City of Rochester" HPSA in the file', 1, len({x['HPSA ID'] for x in csv.DictReader(io.StringIO(data)) if x['HPSA Name'] == 'ME-City of Rochester' and x['HPSA Status'] == 'Designated'}))

# 988 PDF by text position
import pypdf  # noqa: E402
pdf = pypdf.PdfReader(io.BytesIO(get('https://988lifeline.org/wp-content/uploads/2026/08/July-26-988-In-State-Monthly-Report.pdf', raw=True)))
items = []
pdf.pages[0].extract_text(visitor_text=lambda text, cm, tm, fd, fs: items.append((round(tm[5], 0), tm[4], text.strip())) if text.strip() else None)
ny_y = [y for y, x, t in items if t == 'NY']
check('988 PDF: one "NY" label', 1, len(ny_y))
row = [t for y, x, t in sorted(items, key=lambda i: i[1]) if abs(y - ny_y[0]) <= 2 and t != 'NY']
nums = [t.replace('\t', ' ') for t in row]
check('988 NY row (routed, answered, rate, abandoned, flowout, speed, talk)', ['52,475', '46,892', '89%', '4,543', '1,040', '35.8 sec', '13.5 min'], nums[:7])
check('988 NY answer rate recomputed', 89, round(46892 / 52475 * 100))

# carried over from the studies
studies = {'monroe-county-therapists': ['2,291', '423', '990', '734', '144', '305.3', '285.9', '193.4', '56.4', '5,611', '4,485', '25%'],
           'monroe-county-postpartum-depression': ['7,151', '8,707', 'down 18%', '12.4%', '11.9%', 'About 890', '82.4%', '76.1%'],
           'monroe-county-divorce-couples': ['144', '9.5%', '1,518', '3,008', '1,387', '39%', '59%'],
           'rochester-loneliness-map': ['37.2%', '28.3% to 32.6%', '18 of', '23 of', '25', '28.7%', '18.8%', '32.5%', '22.9%', '15.3%', '21.9%']}
for s, vals in studies.items():
    cj = json.load(open(os.path.join(REPO, 'research', s, 'check.json')))
    check(f'{s}: its own check passed', [], cj['fails'])
    st = pj(s)
    for v in vals:
        check(f'{s}: "{v}" on both pages', [True, True], [v in st, v in PAGE_TEXT])
s1 = json.load(open(os.path.join(REPO, 'research', 'monroe-county-therapists', 'results.json')))
check('therapists study: rank 13 / psychologist rank 8', [13, 8], [s1['monroe_rank_of_62'], s1['monroe_psych_rank_of_62']])

for s in ['2,291 licensed mental health clinicians, 305.3 per 100,000', 'Monroe ranks 13th of New York\'s 62 counties', '8th for psychologists (56.4 per 100,000)',
          'second-highest count of any county after Manhattan', '129,319 people, with a shortage score of 19', 'June 28, 2022', 'residents of 88 census tracts, most of them in the City of Rochester',
          '129,319 Medicaid-eligible residents, mostly in the city, live in a federal mental health shortage area',
          'close to the median for New York\'s 62 counties (32.3%)', 'below the median for New York\'s 62 counties (16.2%)',
          'tied with two other counties for the 6th highest share', 'In July 2026, 52,475 calls to 988', '89% (46,892) were answered in state',
          '1,040 went to the national backup network', 'average of 35.8 seconds', 'In 2022, 12.4% of mothers', 'about 890 mothers a year',
          '3,008 couples married in Monroe County in 2023, and county courts granted 1,387 divorces']:
    check(f'page text contains "{s}"', True, s in PAGE_TEXT)

json.dump({'checked': __import__('datetime').date.today().isoformat(), 'fails': fails, 'checks': out}, open(os.path.join(HERE, 'check.json'), 'w'), indent=1, default=str)
print(f"\n{len(out) - len(fails)}/{len(out)} checks passed")
sys.exit(1 if fails else 0)
