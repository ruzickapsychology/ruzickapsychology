#!/usr/bin/env python3
"""Independent check of the headline figures, by a different route than build.py.

  * Marriages and divorces: the NYS DOH tables re-read LIVE from the canonical www.health.ny.gov host (build.py reads saved
    copies from the healthweb-back mirror) and parsed cell by cell with an HTML table parser (build.py uses a text regex).
    No open-data copy of these tables exists on health.data.ny.gov, so the check also ties tables to each other:
    Table 48 divorces = Table 51 total = Table 52 total, and Table 47 marriages = Table 47a total.
  * Licensed MFTs: the NYSED page re-read live and parsed by table cell (build.py takes them from study 1's CSV).
  * Population: New York State's county table on data.ny.gov (krt9-ym2k), years 2023 and 2025, instead of the Census file.
Recomputes every rate and rank and checks the page text holds those values. Writes check.json; exits 1 on any mismatch.
"""
import json, os, re, sys, urllib.request
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
PAGE_TEXT = json.dumps(json.load(open(os.path.join(REPO, 'src', 'data', 'research', 'monroe-county-divorce-couples.json'))), ensure_ascii=False)
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'}
RING = ['Genesee', 'Livingston', 'Ontario', 'Orleans', 'Wayne']


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read().decode('utf-8', errors='replace')


class Cells(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell, self.summaries = [], None, None, []

    def handle_starttag(self, tag, a):
        if tag == 'table':
            self.summaries.append(dict(a).get('summary') or '')
        if tag == 'tr':
            self.row = []
        elif tag in ('td', 'th') and self.row is not None:
            self.cell = ''

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.cell is not None:
            self.row.append(' '.join(self.cell.split()))
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            self.rows.append(self.row)
            self.row = None

    def handle_data(self, d):
        if self.cell is not None:
            self.cell += d


def doh(year, t):
    p = Cells()
    p.feed(get(f'https://www.health.ny.gov/statistics/vital_statistics/{year}/table{t}.htm'))
    out = {}
    for r in p.rows:
        if len(r) >= 2 and all(re.fullmatch(r'[\d,]+|-', x) for x in r[1:]):
            out.setdefault(r[0], [0 if x == '-' else int(x.replace(',', '')) for x in r[1:]])
    return out


out, fails = [], []


def check(name, expected, got):
    ok = expected == got
    out.append({'check': name, 'expected': expected, 'source': got, 'ok': ok})
    if not ok:
        fails.append(name)
    print(('OK  ' if ok else 'FAIL'), name, '| expected', expected, '| source', got)


t47, t47a, t48, t51, t52 = doh(2023, '47'), doh(2023, '47a'), doh(2023, '48'), doh(2023, '51'), doh(2023, '52')
check('Monroe divorces 2023 (Table 48 total)', 1387, t48['Monroe'][0])
check('Table 48 divorce column = Table 51 total = Table 52 total', [1387, 1387, 1387], [t48['Monroe'][1], t51['Monroe'][0], t52['Monroe'][0]])
check('Monroe marriages 2023 (Table 47 = Table 47a)', [3008, 3008], [t47['Monroe'][0], t47a['Monroe'][0]])
check('NYS divorces / marriages 2023', [51332, 124301], [t48['New York State'][0], t47['New York State'][0]])
check('Erie / Onondaga / Jefferson divorces 2023', [2303, 6138, 2226], [t48['Erie'][0], t48['Onondaga'][0], t48['Jefferson'][0]])
check('Manhattan ("New York") divorces 2023', 1390, t48['New York'][0])
check('Five neighbors divorces / marriages 2023', [843, 1952], [sum(t48[c][0] for c in RING), sum(t47[c][0] for c in RING)])
dur = t51['Monroe'][1:]
check('Monroe divorces by duration (<5,5-9,10-14,15-19,20-29,30+,NS)', [240, 325, 254, 174, 225, 165, 4], dur)
check('Monroe divorces, marriage of 10+ years', [818, 59], [sum(dur[2:6]), round(sum(dur[2:6]) / 1387 * 100)])
kids = t52['Monroe'][1:]
check('Monroe divorces with a child under 18', [542, 39], [sum(kids[1:6]), round(sum(kids[1:6]) / 1387 * 100)])

trend = {}
for y in range(2015, 2023):
    a, b = doh(y, '47'), doh(y, '48')
    trend[y] = (a['Monroe'][0], b['Monroe'][0], b['Rest of State'][0])
trend[2023] = (t47['Monroe'][0], t48['Monroe'][0], t48['Rest of State'][0])
check('Monroe trend 2015-2023 (marriages, divorces, NYS-outside-NYC divorces)',
      {2015: (3587, 1871, 29276), 2016: (3612, 1814, 28882), 2017: (3491, 1739, 28278), 2018: (3307, 1665, 29387), 2019: (3224, 653, 18701),
       2020: (2525, 1178, 22677), 2021: (3072, 1031, 26719), 2022: (3093, 1262, 27724), 2023: (3008, 1387, 32842)}, trend)
check('Marriage change 2015-2023 (%)', -16, round((3008 - 3587) / 3587 * 100))
check('Onondaga / Jefferson / Manhattan divorces 2015', [1220, 619, 10452], [doh(2015, '48')[c][0] for c in ('Onondaga', 'Jefferson', 'New York')])

pop = {}
for y in (2023, 2025):
    for r in json.loads(get(f'https://data.ny.gov/resource/krt9-ym2k.json?$where=year={y}%20AND%20program_type=%27Postcensal%20Population%20Estimate%27&$limit=200')):
        pop[(r['geography'].replace(' County', ''), y)] = int(r['population'])
check('Monroe / NYS population 2023', [748957, 19786543], [pop[('Monroe', 2023)], pop[('New York State', 2023)]])
r1 = lambda x: round(x, 1)
check('Monroe divorces / marriages per 1,000 (2023)', [1.9, 4.0], [r1(1387 / pop[('Monroe', 2023)] * 1000), r1(3008 / pop[('Monroe', 2023)] * 1000)])
check('NYS divorces per 1,000 (2023)', 2.6, r1(51332 / pop[('New York State', 2023)] * 1000))
check('Erie / Onondaga / neighbors divorces per 1,000', [2.4, 13.1, 2.3],
      [r1(2303 / pop[('Erie', 2023)] * 1000), r1(6138 / pop[('Onondaga', 2023)] * 1000), r1(843 / sum(pop[(c, 2023)] for c in RING) * 1000)])

p = Cells()
p.feed(get('https://www.op.nysed.gov/professions/marriage-and-family-therapists/license-statistics'))
lm = {}
for r in p.rows:
    for i in range(0, len(r) - 1, 2):
        if r[i] and r[i + 1].replace(',', '').isdigit():
            lm.setdefault(r[i].replace('\xa0', ' ').strip(), int(r[i + 1].replace(',', '')))
nys_lm = next(v for k, v in lm.items() if k.endswith('S TOTAL'))
counties = {k.title().replace('St. Lawrence', 'St. Lawrence'): v for k, v in lm.items() if 'TOTAL' not in k and k not in ('OTHER US', 'NON-US')}
counties = {k: v for k, v in counties.items() if (k.replace('St. ', 'St ').replace('St Lawrence', 'St. Lawrence'), 2025) in pop or (k, 2025) in pop}
check('NYSED LMFT counties matched to population', 62, len(counties))
check('Monroe / NYS / Erie LMFTs', [144, 1518, 51], [counties['Monroe'], nys_lm, counties['Erie']])
check('Five neighbors LMFTs', 28, sum(counties[c] for c in RING))
rate = lambda c: counties[c] / pop[(c, 2025)] * 1e5
check('LMFT per 100,000: Monroe / NYS / neighbors', [19.2, 7.6, 7.7],
      [r1(rate('Monroe')), r1(nys_lm / pop[('New York State', 2025)] * 1e5), r1(sum(counties[c] for c in RING) / sum(pop[(c, 2025)] for c in RING) * 1e5)])
by_count = sorted(counties, key=lambda c: -counties[c])
by_rate = sorted(counties, key=lambda c: -rate(c))
check('Monroe rank by LMFT count (1st is Manhattan)', [2, 'New York', 191], [by_count.index('Monroe') + 1, by_count[0], counties['New York']])
check('Monroe rank by LMFT per resident (1st is Onondaga)', [2, 'Onondaga', 27.4], [by_rate.index('Monroe') + 1, by_rate[0], r1(rate('Onondaga'))])
check('Monroe share of NYS LMFTs / of population / ratio', [9.5, 3.8, 2.5],
      [r1(144 / nys_lm * 100), r1(pop[('Monroe', 2025)] / pop[('New York State', 2025)] * 100), r1((144 / nys_lm) / (pop[('Monroe', 2025)] / pop[('New York State', 2025)]))])

for s in ['second-highest number of licensed marriage and family therapists in New York (144)', '19.2 per 100,000, against 7.6 statewide',
          'granted 1,387 divorces in 2023', '3,008 couples married', '9.5% of New York', 'about 1.9 per 1,000 residents', '(statewide: 2.6)',
          'down 16% from 3,587 in 2015', '542 of 1,387', '818 of 1,387', '59%', '39%', 'Only Manhattan has more (191)', '(27.4 per 100,000)',
          'Erie County, with more people than Monroe, has 51', 'have 28 between them', 'about 2.5 times', 'Onondaga County granted 6,138 in 2023 (up from 1,220 in 2015)',
          'Jefferson County 2,226 (up from 619)', 'Manhattan fell from 10,452 to 1,390', '29,387 in 2018, 18,701 in 2019', 'between 1,665 and 1,871',
          '7.7 marriage and family therapists per 100,000', '3.8% of the state', '13.1', '2.4', '2.3', '1,952', '843']:
    check(f'page text contains "{s}"', True, s in PAGE_TEXT)

json.dump({'checked': __import__('datetime').date.today().isoformat(), 'fails': fails, 'checks': out},
          open(os.path.join(HERE, 'check.json'), 'w'), indent=1, default=str)
print(f"\n{len(out) - len(fails)}/{len(out)} checks passed")
sys.exit(1 if fails else 0)
