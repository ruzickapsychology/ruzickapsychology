#!/usr/bin/env python3
"""Independent check of the headline figures, by a different route than build.py.

  * 2023 births: Health Data NY open-data API (dataset i7yg-w5rg, live) instead of the saved Table 7 HTML page.
  * 2008 births (trend): NYS DOH Vital Statistics 2008 Table 7 HTML page (live) instead of the open-data series.
  * PRAMS rates: the NYS DOH maternal depression page re-read LIVE from the canonical www.health.ny.gov host (build.py
    reads a saved copy from the healthweb-back mirror), parsed by splitting the sentence rather than one regex.
    No second publisher of the 2022 by-site PRAMS rate could be reached (CDC's PRAMS pages answer 403/404 to scripts).
Recomputes every estimate and checks the page text holds exactly those values. Writes check.json; exits 1 on mismatch.
"""
import html, json, os, re, sys, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
PAGE_TEXT = json.dumps(json.load(open(os.path.join(REPO, 'src', 'data', 'research', 'monroe-county-postpartum-depression.json'))), ensure_ascii=False)
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'}
RING = ['Genesee', 'Livingston', 'Ontario', 'Orleans', 'Wayne']


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read().decode('utf-8', errors='replace')


def text(h):
    h = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', h)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h)))


out, fails = [], []


def check(name, expected, got):
    ok = expected == got
    out.append({'check': name, 'expected': expected, 'source': got, 'ok': ok})
    if not ok:
        fails.append(name)
    print(('OK  ' if ok else 'FAIL'), name, '| expected', expected, '| source', got)


# 2023 births from the open-data API
q = urllib.parse.quote("year=2023 AND mother_s_age_range in('Total','25-29','30-34')")
rows = json.loads(get(f'https://health.data.ny.gov/resource/i7yg-w5rg.json?$where={q}&$limit=1000'))
b = {}
for r in rows:
    b.setdefault(r['county'], {})[r['mother_s_age_range']] = int(r['value'])
mon = b['Monroe']['Total']
ring = sum(b[c]['Total'] for c in RING)
check('Monroe births 2023 (open data)', 7151, mon)
check('Five neighboring counties births 2023', 3090, ring)
check('Orleans / Genesee / Livingston / Wayne / Ontario', [354, 475, 479, 853, 929], [b[c]['Total'] for c in ['Orleans', 'Genesee', 'Livingston', 'Wayne', 'Ontario']])
check('Monroe births to mothers 25-34', 4251, b['Monroe']['25-29'] + b['Monroe']['30-34'])
check('NYS excluding NYC births 2023', 111798, b['Rest of State']['Total'])
check('NYS births 2023', 202667, b['New York State']['Total'])

# 2008 births from the 2008 Table 7 page
t08 = text(get('https://www.health.ny.gov/statistics/vital_statistics/2008/table07.htm'))
m = re.search(r'Monroe ([\d,]+) ', t08)
check('Monroe births 2008 (2008 Table 7)', 8707, int(m.group(1).replace(',', '')))

# PRAMS rates, live from www.health.ny.gov
p = text(get('https://www.health.ny.gov/community/pregnancy/health_care/perinatal/maternal_depression/providers/what_is_maternial_depression.htm'))
i = p.find('In New York State,')
sentence = p[i:p.find('.', p.find('excluding New York City', i)) + 1]
pcts = [float(x) for x in re.findall(r'([\d.]+)%', sentence)]
check('NY PRAMS sentence: [NYS, NYC, NYS excl NYC]', [11.9, 11.5, 12.4], pcts)
j = p.find('Survey data collected in')
check('PRAMS survey year stated before the NY figures', '2022', p[j + len('Survey data collected in '):j + len('Survey data collected in ') + 4])
check('All 2022 PRAMS sites (approximately)', 12.7, float(re.search(r'approximately ([\d.]+)%', p[j:j + 300]).group(1)))
k = p.find('postpartum checkup were asked about depression')
check('Screening rate 2020', 82.4, float(re.findall(r'([\d.]+)%', p[k - 80:k])[-1]))
check('10 to 20 percent clinical range present', True, '10 to 20 percent of new mothers' in p)

est = mon * 12.4 / 100
r10 = lambda x: int(round(x / 10.0) * 10)
check('Monroe estimate (exact)', 886.7, round(est, 1))
check('Monroe estimate shown (nearest 10)', 890, r10(est))
check('Neighbors estimate shown', 380, r10(ring * 12.4 / 100))
check('Monroe at statewide 11.9%', 850, r10(mon * 11.9 / 100))
check('Monroe 10-20% range', [720, 1430], [r10(mon * 0.10), r10(mon * 0.20)])
check('Births change 2008-2023 (%)', -18, round((mon - 8707) / 8707 * 100))
for s in ['About 890', '7,151', '12.4%', '11.9%', '11.5%', '12.7%', 'About 380', '3,090', '82.4%', '76.1%', '8,707', 'down 18%',
          'about 850', '720 to 1,430', '4,251', 'one in eight', '7,151 x 12.4% = 887',
          'would be likely to report symptoms of postpartum depression', 'Estimated mothers likely to report symptoms']:
    check(f'page text contains "{s}"', True, s in PAGE_TEXT)
check('page text does not say "with symptoms" or "would have symptoms"', [False, False], ['mothers with symptoms' in PAGE_TEXT, 'would have symptoms' in PAGE_TEXT])
check('Dataset temporalCoverage', '2008/2023', json.loads(PAGE_TEXT)['dataset']['temporalCoverage'])

json.dump({'checked': __import__('datetime').date.today().isoformat(), 'fails': fails, 'checks': out},
          open(os.path.join(HERE, 'check.json'), 'w'), indent=1)
print(f"\n{len(out) - len(fails)}/{len(out)} checks passed")
sys.exit(1 if fails else 0)
