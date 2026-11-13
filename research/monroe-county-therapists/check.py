#!/usr/bin/env python3
"""Independent check of the headline figures, by a different route than build.py.

  * Licensee counts: refetches each NYSED license-statistics page LIVE and reads the county table cell by cell with
    an HTML table parser (build.py reads the saved pages as flattened text with a regex).
  * Population: New York State's own county table on data.ny.gov (dataset krt9-ym2k, "Annual Population Estimates
    for New York State and Counties", year 2025, postcensal) instead of the Census Bureau's co-est2025-alldata.csv.
Recomputes every figure on the page and checks that the page text holds exactly those values.
Writes check.json; exits 1 on any mismatch.
"""
import json, os, sys, urllib.request
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
PAGE = json.load(open(os.path.join(REPO, 'src', 'data', 'research', 'monroe-county-therapists.json')))
PAGE_TEXT = json.dumps(PAGE, ensure_ascii=False)
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'}
PAGES = {'psych': 'psychology', 'lcsw': 'licensed-clinical-social-worker', 'lmhc': 'mental-health-counselors',
         'lmft': 'marriage-and-family-therapists'}
RING = ['Genesee', 'Livingston', 'Ontario', 'Orleans', 'Wayne']


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read().decode('utf-8')


class Tables(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables, self.cell, self.row = [], None, None

    def handle_starttag(self, tag, a):
        if tag == 'table':
            self.tables.append({'summary': dict(a).get('summary') or '', 'rows': []})
        elif tag == 'tr' and self.tables:
            self.row = []
        elif tag in ('td', 'th') and self.row is not None:
            self.cell = ''

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.cell is not None:
            self.row.append(self.cell.strip())
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            self.tables[-1]['rows'].append(self.row)
            self.row = None

    def handle_data(self, d):
        if self.cell is not None:
            self.cell += d


out, fails = [], []


def check(name, expected, got):
    ok = expected == got
    out.append({'check': name, 'expected': expected, 'source': got, 'ok': ok})
    if not ok:
        fails.append(name)
    print(('OK  ' if ok else 'FAIL'), name, '| expected', expected, '| source', got)


def on_page(s):
    check(f'page text contains "{s}"', True, s in PAGE_TEXT)


lic, issued = {}, {}
for key, slug in PAGES.items():
    html = get(f'https://www.op.nysed.gov/professions/{slug}/license-statistics')
    check(f'{key}: page says "as of July 1, 2026"', True, 'as of july 1, 2026' in html.lower())
    p = Tables()
    p.feed(html)
    t = [x for x in p.tables if 'per county' in x['summary'].lower()]
    assert len(t) == 1, (key, [x['summary'] for x in p.tables])
    cells = {}
    for row in t[0]['rows'][1:]:
        for i in range(0, len(row) - 1, 2):
            name, num = row[i].replace('\xa0', ' ').strip(), row[i + 1].replace(',', '').strip()
            if name and num.isdigit():
                cells[name] = int(num)
    lic[key] = {k: v for k, v in cells.items() if 'TOTAL' not in k and k not in ('OTHER US', 'NON-US')}
    lic[key]['__nys'] = next(v for k, v in cells.items() if k.endswith('S TOTAL'))
    check(f'{key}: counties in table', 62, len(lic[key]) - 1)
    it = [x for x in p.tables if x['rows'] and x['rows'][0] and x['rows'][0][0].lower().startswith('profession')]
    assert len(it) == 1, key
    hdr, vals = it[0]['rows'][0], it[0]['rows'][1]
    issued[key] = {int(y): int(v.replace(',', '')) for y, v in zip(hdr[1:], vals[1:])}

rows = json.loads(get('https://data.ny.gov/resource/krt9-ym2k.json?$where=year=2025%20AND%20program_type=%27Postcensal%20Population%20Estimate%27&$limit=200'))
pop = {r['geography'].replace(' County', ''): int(r['population']) for r in rows}
pop['NYS'] = pop.pop('New York State')
check('population rows (62 counties + state)', 63, len(pop))

K = list(PAGES)
tot = lambda c: sum(lic[k][c] for k in K)
fmt = lambda x: f'{x:,}'
f1 = lambda x: f'{x:,.1f}'

m_total, m_pop = tot('Monroe'), pop['Monroe']
m_rate = round(m_total / m_pop * 1e5, 1)
r_total, r_pop = sum(tot(c) for c in RING), sum(pop[c] for c in RING)
r_rate = round(r_total / r_pop * 1e5, 1)
nys_total = sum(lic[k]['__nys'] for k in K)
nys_rate = round(nys_total / pop['NYS'] * 1e5, 1)
m_psych_rate = round(lic['psych']['Monroe'] / m_pop * 1e5, 1)
r_psych = sum(lic['psych'][c] for c in RING)
r_psych_rate = round(r_psych / r_pop * 1e5, 1)
counties = [c for c in lic['psych'] if c != '__nys']
rank = sorted(counties, key=lambda c: -tot(c) / pop[c]).index('Monroe') + 1
prank = sorted(counties, key=lambda c: -lic['psych'][c] / pop[c]).index('Monroe') + 1
i24, i25 = sum(issued[k][2024] for k in K), sum(issued[k][2025] for k in K)
orleans = tot('Orleans')

check('Monroe total, four professions', 2291, m_total)
check('Monroe psychologists', 423, lic['psych']['Monroe'])
check('Monroe LCSW / LMHC / LMFT', [990, 734, 144], [lic['lcsw']['Monroe'], lic['lmhc']['Monroe'], lic['lmft']['Monroe']])
check('Monroe population 2025 (NYS table)', 750506, m_pop)
check('Monroe per 100,000', 305.3, m_rate)
check('Five neighboring counties total', 704, r_total)
check('Five neighboring counties population', 364059, r_pop)
check('Five neighboring counties per 100,000', 193.4, r_rate)
check('Five neighboring counties psychologists', 74, r_psych)
check('NYS total (NYSED "NYS TOTAL" lines)', 57196, nys_total)
check('NYS per 100,000', 285.9, nys_rate)
check('Monroe rank of 62', 13, rank)
check('Monroe psychologist rank of 62', 8, prank)
check('Monroe psychologists per 100,000', 56.4, m_psych_rate)
check('Neighbors psychologists per 100,000', 20.3, r_psych_rate)
check('Erie psychologists', 347, lic['psych']['Erie'])
check('Orleans total', 38, orleans)
check('New licenses, four professions, 2024', 4485, i24)
check('New licenses, four professions, 2025', 5611, i25)
check('Change 2024 to 2025 (%)', 25, round((i25 - i24) / i24 * 100))
check('Psychologist licenses 2024 / 2025', [706, 915], [issued['psych'][2024], issued['psych'][2025]])
check('Monroe / neighbors ratio', 1.6, round(m_rate / r_rate, 1))
for s in [fmt(m_total), f1(m_rate), f1(r_rate), fmt(r_total), fmt(r_pop), f1(nys_rate), f'{rank} of 62', fmt(i25), fmt(i24),
          f1(m_psych_rate), f1(r_psych_rate), '423', '347', '1.6 times']:
    on_page(s)

json.dump({'checked': __import__('datetime').date.today().isoformat(), 'fails': fails, 'checks': out},
          open(os.path.join(HERE, 'check.json'), 'w'), indent=1)
print(f"\n{len(out) - len(fails)}/{len(out)} checks passed")
sys.exit(1 if fails else 0)
