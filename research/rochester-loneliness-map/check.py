#!/usr/bin/env python3
"""Independent check of the headline figures, by a different route than build.py.

  * PLACES estimates re-queried LIVE from data.cdc.gov with different filters (by measure and by Census place GEOID).
  * Tract-to-town assignment done by the Census server: one TIGERweb point query per tract internal point against the
    Census 2020 county subdivision layer (build.py does its own point-in-polygon test on downloaded polygons).
  * Place types (city / village / CDP) read from TIGERweb's Census 2020 Incorporated Places and CDP layers.
  * The published SVG is re-read and its shaded tract count per color compared with the recomputed bins.
Recomputes every town average, count, range and comparison and checks the page text holds them. Writes check.json.
"""
import csv, json, os, re, sys, urllib.parse, urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
PAGE = json.load(open(os.path.join(REPO, 'src', 'data', 'research', 'rochester-loneliness-map.json')))
PAGE_TEXT = json.dumps(PAGE, ensure_ascii=False)
SVG = open(os.path.join(REPO, 'public', 'research', 'rochester-loneliness-map.svg')).read()
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'}
TW = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb'


def get(url, params=None):
    if params:
        url += '?' + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return json.loads(r.read().decode('utf-8'))


out, fails = [], []


def check(name, expected, got):
    ok = expected == got
    out.append({'check': name, 'expected': expected, 'source': got, 'ok': ok})
    if not ok:
        fails.append(name)
    print(('OK  ' if ok else 'FAIL'), name, '| expected', expected, '| source', got)


# tracts, per measure
tr = defaultdict(dict)
for m in ('LONELINESS', 'EMOTIONSPT', 'MHLTH', 'DEPRESSION'):
    for r in get('https://data.cdc.gov/resource/cwsq-ngmh.json', {'$where': f"countyname='Monroe' AND stateabbr='NY' AND measureid='{m}'", '$limit': 1000}):
        tr[r['locationname']][m] = float(r['data_value'])
        tr[r['locationname']]['adults'] = int(r['totalpop18plus'])
check('PLACES Monroe tracts with estimates', 207, len(tr))

# server-side tract -> town
tracts = get(f'{TW}/Tracts_Blocks/MapServer/10/query', {'where': "STATE='36' AND COUNTY='055'", 'outFields': 'GEOID,INTPTLAT,INTPTLON', 'returnGeometry': 'false', 'f': 'json'})['features']


def town_for(a):
    pt = {'x': float(a['INTPTLON']), 'y': float(a['INTPTLAT']), 'spatialReference': {'wkid': 4326}}
    res = get(f'{TW}/Places_CouSub_ConCity_SubMCD/MapServer/22/query', {'geometry': json.dumps(pt), 'geometryType': 'esriGeometryPoint', 'inSR': 4326,
                                                                          'spatialRel': 'esriSpatialRelIntersects', 'outFields': 'NAME', 'returnGeometry': 'false', 'f': 'json'})
    return a['GEOID'], [f['attributes']['NAME'] for f in res['features']]


with ThreadPoolExecutor(8) as ex:
    town = dict(ex.map(town_for, [f['attributes'] for f in tracts if f['attributes']['GEOID'] in tr]))
check('every tract with an estimate falls in exactly one town', 207, sum(1 for v in town.values() if len(v) == 1))
town = {g: v[0] for g, v in town.items()}
CITY = 'Rochester city'

agg = defaultdict(lambda: defaultdict(float))
for g, v in tr.items():
    a = agg[town[g]]
    a['adults'] += v['adults']
    for m in ('LONELINESS', 'EMOTIONSPT', 'MHLTH', 'DEPRESSION'):
        a[m] += v[m] * v['adults']
avg = {t: {m: a[m] / a['adults'] for m in ('LONELINESS', 'EMOTIONSPT', 'MHLTH', 'DEPRESSION')} for t, a in agg.items()}
check('towns (incl. city)', 21, len(avg))
r1 = lambda x: round(x + 1e-9, 1)
sub = {t: r1(v['LONELINESS']) for t, v in avg.items() if t != CITY}
low = sorted(v for v in sub.values() if v < 33)
check('suburban towns under 33% / range', [18, 28.3, 32.6], [len(low), low[0], low[-1]])
top = sorted(sub.items(), key=lambda kv: -kv[1])
check('two highest suburban towns', [['Sweden town', 36.0], ['Henrietta town', 35.1]], [list(x) for x in top[:2]])
check('three lowest suburban towns', [['Mendon town', 28.3], ['Perinton town', 28.5], ['Rush town', 29.0]], [list(x) for x in sorted(sub.items(), key=lambda kv: kv[1])[:3]])
check('city town-average loneliness', 37.2, r1(avg[CITY]['LONELINESS']))
check('city highest lack of support among towns', CITY, max(avg, key=lambda t: avg[t]['EMOTIONSPT']))
check('frequent mental distress: city ties Sweden at the top', [18.8, 18.8, True],
      [r1(avg[CITY]['MHLTH']), r1(avg['Sweden town']['MHLTH']), all(r1(v['MHLTH']) <= 18.8 for v in avg.values())])
hi = [g for g in tr if tr[g]['LONELINESS'] >= 40]
check('tracts at 40%+ / in city', [25, 23], [len(hi), sum(1 for g in hi if town[g] == CITY)])
check('tracts at 40%+ outside city', ['Henrietta town', 'Sweden town'], sorted(town[g] for g in hi if town[g] != CITY))
lo_g, hi_g = min(tr, key=lambda g: tr[g]['LONELINESS']), max(tr, key=lambda g: tr[g]['LONELINESS'])
check('tract minimum / maximum', [[26.2, 'Perinton town'], [47.6, 'Sweden town']], [[tr[lo_g]['LONELINESS'], town[lo_g]], [tr[hi_g]['LONELINESS'], town[hi_g]]])
city = [tr[g]['LONELINESS'] for g in tr if town[g] == CITY]
check('city tract range / count', [27.7, 43.4, 80], [min(city), max(city), len(city)])
check('city tracts in the two darkest shades (36%+)', 57, sum(1 for x in city if x >= 36))
bins = [sum(1 for g in tr if sum(tr[g]['LONELINESS'] >= b for b in (30, 33, 36, 40)) == i) for i in range(5)]
check('tracts per map shade', [47, 68, 29, 38, 25], bins)
RAMP = ['#f0dcdc', '#dcadb3', '#bf7c88', '#985060', '#5c2634']
check('SVG: shaded tracts per color', bins, [len(re.findall(f'<path d="[^"]+" fill="{c}"/>', SVG)) for c in RAMP])
check('SVG: no-estimate tracts', 3, len(re.findall('<path d="[^"]+" fill="#dedad3"/>', SVG)))

# places
pids = ['3663000', '3637737', '3608257', '3630279', '3652040', '3663014', '3608466', '3622865', '3634847', '3678960', '3625076', '3631786', '3628453',
        '3615946', '3670189', '3635364', '3615638', '3665959', '3658354', '3664606', '3649715']
pl = defaultdict(dict)
for r in get('https://data.cdc.gov/resource/eav7-hnsx.json', {'$where': 'locationid in(' + ','.join(f"'{p}'" for p in pids) + ')', '$limit': 2000}):
    pl[r['locationid']][(r['measureid'], r['datavaluetypeid'])] = (float(r['data_value']), float(r['low_confidence_limit']), float(r['high_confidence_limit']))
    pl[r['locationid']]['name'] = r['locationname']
c = lambda p, m, t='CrdPrv': pl[p][(m, t)][0]
check('Rochester loneliness (CI)', (37.2, 32.7, 41.5), pl['3663000'][('LONELINESS', 'CrdPrv')])
check('Rochester support / distress / depression', [28.7, 18.8, 22.3], [c('3663000', 'EMOTIONSPT'), c('3663000', 'MHLTH'), c('3663000', 'DEPRESSION')])
check('Brighton / Irondequoit support', [20.1, 21.7], [c('3608257', 'EMOTIONSPT'), c('3637737', 'EMOTIONSPT')])
check('Brighton / Irondequoit distress', [12.9, 14.7], [c('3608257', 'MHLTH'), c('3637737', 'MHLTH')])
check('Brighton / Irondequoit depression', [20.2, 22.0], [c('3608257', 'DEPRESSION'), c('3637737', 'DEPRESSION')])
check('Age-adjusted loneliness Rochester / Brighton / Irondequoit', [36.4, 31.0, 32.9], [c(p, 'LONELINESS', 'AgeAdjPrv') for p in ('3663000', '3608257', '3637737')])
check('Campus places loneliness (Nazareth, RIT, Fisher)', [46.2, 45.5, 44.9], [c(p, 'LONELINESS') for p in ('3649715', '3663014', '3664606')])
for p, t in (('3663000', CITY), ('3608257', 'Brighton town'), ('3637737', 'Irondequoit town'), ('3622865', 'East Rochester town')):
    check(f'town average within 0.1 of CDC place estimate: {pl[p]["name"]}', True,
          all(abs(avg[t][m] - c(p, m)) <= 0.1 for m in ('LONELINESS', 'EMOTIONSPT', 'MHLTH', 'DEPRESSION')))
non = [p for p in pids if p not in ('3663000', '3663014', '3664606', '3649715')]
below = [pl[p]['name'] for p in non if pl[p][('LONELINESS', 'CrdPrv')][2] < 32.7]
check('non-campus places whose range sits below Rochester\'s', [['Pittsford'], 17], [below, len(non)])
ptype = {}
for layer in (25, 26):
    for f in get(f'{TW}/Places_CouSub_ConCity_SubMCD/MapServer/{layer}/query', {'where': 'GEOID IN (' + ','.join(f"'{p}'" for p in pids) + ')', 'outFields': 'GEOID,LSADC,NAME', 'returnGeometry': 'false', 'f': 'json'})['features']:
        ptype[f['attributes']['GEOID']] = f['attributes']['NAME'].rsplit(' ', 1)[1]
check('place types: villages', sorted(['3608466', '3615638', '3622865', '3625076', '3634847', '3635364', '3658354', '3665959', '3670189', '3678960']),
      sorted(p for p, t in ptype.items() if t == 'village'))
check('place types: CDPs', 10, sum(1 for t in ptype.values() if t == 'CDP'))
cty = {}
for r in get('https://data.cdc.gov/resource/swc5-untb.json', {'$where': "locationid='36055' AND datavaluetypeid='CrdPrv'"}):
    cty[r['measureid']] = float(r['data_value'])
check('Monroe County loneliness / support / distress / depression', [32.5, 22.9, 15.3, 21.9], [cty['LONELINESS'], cty['EMOTIONSPT'], cty['MHLTH'], cty['DEPRESSION']])

for s in ['An estimated 37.2% of adults in the City of Rochester', '28.3% to 32.6% in 18 of Monroe County\'s 20 suburban towns', '25 census tracts', '23 are in the city',
          'Sweden (36.0%) and Henrietta (35.1%)', 'Mendon (28.3%), Perinton (28.5%) and Rush (29.0%)', '26.2% in a tract in Perinton to 47.6% in a tract in Sweden',
          'from 27.7% to 43.4%', 'Nazareth College (46.2%), Rochester Institute of Technology (45.5%), St. John Fisher College (44.9%)',
          '28.7%, against 20.1% in Brighton and 21.7% in Irondequoit', 'ties with Sweden', '18.8%, against 12.9% in Brighton and 14.7% in Irondequoit',
          '36.4%, against 31.0% in Brighton and 32.9% in Irondequoit', '22.3% in the city, 20.2% in Brighton, 22.0% in Irondequoit and 21.9% countywide',
          '32.5%', '22.9% countywide', '15.3% countywide', 'likely range 32.7% to 41.5%', '16 of the 17 other places', 'only the Village of Pittsford',
          '57 of the City of Rochester\'s 80 tracts', 'least lonely neighborhood in the county has an estimated 26.2%']:
    check(f'page text contains "{s}"', True, s in PAGE_TEXT)
# fixes from the independent review (13 Nov)
pop = get(f'{TW}/tigerWMS_Census2020/MapServer/82/query', {'where': "GEOID='36055'", 'outFields': 'POP100', 'returnGeometry': 'false', 'f': 'json'})['features'][0]['attributes']['POP100']
check('Monroe County 2020 Census count (places table county row)', '759,443', f'{int(pop):,}')
check('places table county row shows the 2020 count', True, '"Monroe County", "759,443"' in PAGE_TEXT)
air = get(f'{TW}/tigerWMS_Census2020/MapServer/6/query', {'where': "GEOID='36055980000'", 'outFields': 'POP100', 'returnGeometry': 'false', 'f': 'json'})['features'][0]['attributes']['POP100']
check('airport tract 36055980000 residents (2020 Census)', 0, int(air))
csv_rows = {r['tract_geoid']: r for r in csv.DictReader(open(os.path.join(REPO, 'public', 'research', 'rochester-loneliness-map.csv')))}
check('CSV labels the airport tract', 'Airport (no residents)', csv_rows['36055980000']['town'])
for s in ['in Rochester and virtually across New York', 'from BRFSS survey responses', 'two city tracts with 48 residents between them', 'Residents are 2020 Census counts']:
    check(f'page text contains "{s}"', True, s in PAGE_TEXT)
for s in ['group-therapy', 'group therapy', 'statewide BRFSS']:
    check(f'page text does not contain "{s}"', False, s in PAGE_TEXT)
check('hub card wording', True, '23 of the 25 estimated loneliest census tracts' in PAGE_TEXT)

json.dump({'checked': __import__('datetime').date.today().isoformat(), 'fails': fails, 'checks': out}, open(os.path.join(HERE, 'check.json'), 'w'), indent=1, default=str)
print(f"\n{len(out) - len(fails)}/{len(out)} checks passed")
sys.exit(1 if fails else 0)
