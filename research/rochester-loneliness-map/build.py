#!/usr/bin/env python3
"""Loneliness in Rochester and its suburbs, by town and census tract (Ruzicka Psychology /research)

Inputs (raw/, fetch.sh; sources.json holds URL, retrieval date and SHA-256):
  * CDC PLACES 2025 release (BRFSS 2023 model-based estimates): place, census tract and county data for four measures,
    LONELINESS, EMOTIONSPT (lack of social and emotional support), MHLTH (frequent mental distress), DEPRESSION.
  * Census TIGERweb, Census 2020 vintage: Monroe County tract polygons and county subdivisions (19 towns + City of Rochester).
Town figures are adult-population-weighted averages of PLACES tract estimates, each tract assigned to the town that holds
its Census internal point. For the four places whose area equals a town or city (Rochester, Brighton, Irondequoit,
East Rochester) this reproduces CDC's own place estimate, which build.py asserts.
Writes results.json, the page JSON, the CSV (one row per tract) and public/research/rochester-loneliness-map.svg.
"""
import json, math, os, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '_lib'))
from page import REPO, verify_sources, n, d1, write_csv, write_page, assert_text_has  # noqa: E402

SLUG = 'rochester-loneliness-map'
PUBLISHED = '2026-11-13'
RAW = os.path.join(HERE, 'raw')
verify_sources(HERE)
MEAS = ['LONELINESS', 'EMOTIONSPT', 'MHLTH', 'DEPRESSION']
load = lambda f: json.load(open(os.path.join(RAW, f)))


def rings(g):
    return [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']


def in_ring(pt, r):
    x, y = pt
    c = False
    for i in range(len(r)):
        x1, y1 = r[i]
        x2, y2 = r[i - 1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def in_geom(pt, g):
    return any(in_ring(pt, p[0]) and not any(in_ring(pt, h) for h in p[1:]) for p in rings(g))


# ---------- geography ----------
towns = [f for f in load('tiger2020-cousub-monroe.geojson')['features'] if f['properties']['NAME'] != 'County subdivisions not defined']
assert len(towns) == 21, len(towns)  # 20 towns (incl. East Rochester) + Rochester city
tiger_tracts = load('tiger2020-tracts-monroe.geojson')['features']
assert len(tiger_tracts) == 211
town_of = {}
for f in tiger_tracts:
    p = f['properties']
    pt = (float(p['INTPTLON']), float(p['INTPTLAT']))
    hits = [t['properties']['NAME'] for t in towns if in_geom(pt, t['geometry'])]
    town_of[p['GEOID']] = hits[0] if hits else None
    assert len(hits) <= 1

# ---------- PLACES ----------
tr = defaultdict(dict)
for r in load('places-tract-2025.json'):
    assert r['year'] == '2023' and r['datavaluetypeid'] == 'CrdPrv'
    tr[r['locationname']][r['measureid']] = (float(r['data_value']), float(r['low_confidence_limit']), float(r['high_confidence_limit']))
    tr[r['locationname']]['pop'] = int(r['totalpopulation'])
    tr[r['locationname']]['adults'] = int(r['totalpop18plus'])
assert len(tr) == 207 and all(all(m in v for m in MEAS) for v in tr.values())
no_est = sorted(set(town_of) - set(tr))
no_est_city = [g for g in no_est if town_of[g] == 'Rochester city']
assert len(no_est_city) == 3, no_est
assert all(town_of[g] in (None, 'Rochester city') for g in no_est), no_est
pl = defaultdict(dict)
for r in load('places-place-2025.json'):
    assert r['year'] == '2023'
    d = pl[r['locationid']]
    d['name'], d['pop'], d['pt'] = r['locationname'], int(r['totalpopulation']), tuple(r['geolocation']['coordinates'])
    d[(r['measureid'], r['datavaluetypeid'])] = (float(r['data_value']), float(r['low_confidence_limit']), float(r['high_confidence_limit']))
for k in list(pl):
    hits = [t['properties']['NAME'] for t in towns if in_geom(pl[k]['pt'], t['geometry'])]
    if hits:
        pl[k]['town'] = hits[0]
    else:
        del pl[k]
assert len(pl) == 21, len(pl)
county = {}
for r in load('places-county-2025.json'):
    county[(r['measureid'], r['datavaluetypeid'])] = (float(r['data_value']), float(r['low_confidence_limit']), float(r['high_confidence_limit']))
# Census place type (TIGERweb 2020 Incorporated Places / CDP layers, checked in check.py)
PTYPE = {'3663000': 'city', '3608466': 'village', '3615638': 'village', '3622865': 'village', '3625076': 'village', '3634847': 'village',
         '3635364': 'village', '3658354': 'village', '3665959': 'village', '3670189': 'village', '3678960': 'village',
         '3608257': 'CDP', '3615946': 'CDP', '3628453': 'CDP', '3630279': 'CDP', '3631786': 'CDP', '3637737': 'CDP', '3649715': 'CDP',
         '3652040': 'CDP', '3663014': 'CDP', '3664606': 'CDP'}
CAMPUS = {'3663014', '3664606', '3649715'}
assert set(pl) == set(PTYPE), sorted(set(pl) ^ set(PTYPE))

# ---------- town averages (adult-weighted tract estimates) ----------
tw = defaultdict(lambda: {'adults': 0, 'pop': 0, 'tracts': 0, **{m: 0.0 for m in MEAS}})
for g, v in tr.items():
    t = tw[town_of[g]]
    t['adults'] += v['adults']
    t['pop'] += v['pop']
    t['tracts'] += 1
    for m in MEAS:
        t[m] += v[m][0] * v['adults']
for t in tw.values():
    for m in MEAS:
        t[m] /= t['adults']
assert len(tw) == 21
SAME_GAPS = []
SAME_AREA = {'3663000': 'Rochester city', '3608257': 'Brighton town', '3637737': 'Irondequoit town', '3622865': 'East Rochester town'}
for pid, town in SAME_AREA.items():  # town average reproduces CDC's own place estimate
    for m in MEAS:
        gap = round(tw[town][m] - pl[pid][(m, 'CrdPrv')][0], 2)
        SAME_GAPS.append([pid, m, gap])
        assert abs(gap) <= 0.1, (pid, m, tw[town][m], pl[pid][(m, 'CrdPrv')])
CITY = 'Rochester city'
sub = {k: v for k, v in tw.items() if k != CITY}
assert len(sub) == 20
sub_sorted = sorted(sub, key=lambda k: -sub[k]['LONELINESS'])
lo_cut = 33.0
sub_low = [k for k in sub if sub[k]['LONELINESS'] < lo_cut]
sub_range = (min(sub[k]['LONELINESS'] for k in sub_low), max(sub[k]['LONELINESS'] for k in sub_low))
high = sorted([g for g in tr if tr[g]['LONELINESS'][0] >= 40], key=lambda g: -tr[g]['LONELINESS'][0])
high_city = [g for g in high if town_of[g] == CITY]
high_other = [g for g in high if town_of[g] != CITY]
lo_min = min(tr, key=lambda g: tr[g]['LONELINESS'][0])
lo_max = max(tr, key=lambda g: tr[g]['LONELINESS'][0])
city_tracts = [g for g in tr if town_of[g] == CITY]
city_min = min(tr[g]['LONELINESS'][0] for g in city_tracts)
city_max = max(tr[g]['LONELINESS'][0] for g in city_tracts)
roc = pl['3663000']
c = lambda pid, m, t='CrdPrv': pl[pid][(m, t)][0]
cty = lambda m: county[(m, 'CrdPrv')][0]
campus_sorted = sorted(CAMPUS, key=lambda p: -c(p, 'LONELINESS'))
noncampus = [p for p in pl if p not in CAMPUS and p != '3663000']
no_overlap = sorted([p for p in noncampus if pl[p][('LONELINESS', 'CrdPrv')][2] < pl['3663000'][('LONELINESS', 'CrdPrv')][1]], key=lambda p: -pl[p]['pop'])
overlap = sorted([p for p in noncampus if p not in no_overlap], key=lambda p: -pl[p]['pop'])
city_dark = sum(1 for g in tr if town_of[g] == CITY and tr[g]['LONELINESS'][0] >= 36)
light_towns = sorted({town_of[g] for g in tr if tr[g]['LONELINESS'][0] < 30}, key=lambda k: -sum(1 for g in tr if town_of[g] == k and tr[g]['LONELINESS'][0] < 30))
rank_sup = sorted(tw, key=lambda k: -tw[k]['EMOTIONSPT'])
rank_mh = sorted(tw, key=lambda k: -round(tw[k]['MHLTH'], 1))
assert rank_sup[0] == CITY
mh_top = [k for k in tw if round(tw[k]['MHLTH'], 1) == round(tw[rank_mh[0]]['MHLTH'], 1)]
assert set(mh_top) == {CITY, 'Sweden town'}, mh_top
campus_text = ', '.join(f"{pl[p]['name']} ({c(p, 'LONELINESS')}%)" for p in campus_sorted)
county_adults_lonely = sum(v['adults'] * v['LONELINESS'][0] / 100 for v in tr.values())

# ---------- SVG map ----------
BINS = [30, 33, 36, 40]
RAMP = ['#f0dcdc', '#dcadb3', '#bf7c88', '#985060', '#5c2634']  # one hue, light to dark (OKLab L .91/.79/.66/.52/.35)
NOFILL = '#dedad3'
BIN_LABELS = ['Under 30%', '30% to 32.9%', '33% to 35.9%', '36% to 39.9%', '40% or more']
binof = lambda v: sum(v >= b for b in BINS)
bin_counts = [sum(1 for g in tr if binof(tr[g]['LONELINESS'][0]) == i) for i in range(5)]
drawn = [f for f in tiger_tracts if town_of[f['properties']['GEOID']] is not None]
lons = [x for f in drawn for p in rings(f['geometry']) for r in p for x, _ in r]
lats = [y for f in drawn for p in rings(f['geometry']) for r in p for _, y in r]
W, PAD, TOP = 900, 24, 92
k = math.cos(math.radians((min(lats) + max(lats)) / 2))
S = (W - 2 * PAD) / ((max(lons) - min(lons)) * k)
MAPH = (max(lats) - min(lats)) * S
H = int(TOP + MAPH + 150)
proj = lambda lon, lat: (PAD + (lon - min(lons)) * k * S, TOP + (max(lats) - lat) * S)


def simplify(pts, tol):
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1e-9
        best, bi = -1, None
        for i in range(a + 1, b):
            x0, y0 = pts[i]
            dd = abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1) / L if (dx or dy) else math.hypot(x0 - x1, y0 - y1)
            if dd > best:
                best, bi = dd, i
        if bi is not None and best > tol:
            keep[bi] = True
            stack += [(a, bi), (bi, b)]
    return [p for p, kp in zip(pts, keep) if kp]


def path(g, tol=0.35):
    out = []
    for p in rings(g):
        for r in p:
            pts = simplify([proj(x, y) for x, y in r], tol)
            if len(pts) >= 3:
                out.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z')
    return ''.join(out)


esc = lambda s: s.replace('&', '&amp;').replace('<', '&lt;')
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="t d" font-family="Helvetica, Arial, sans-serif">',
       '<title id="t">Estimated share of adults who feel lonely, by census tract, Monroe County, New York (CDC PLACES 2025 release)</title>',
       f'<desc id="d">Choropleth map of {len(tr)} census tracts. The darkest tracts, where 40% or more of adults are estimated to feel lonely, are almost all inside the City of Rochester; most suburban tracts are under 33%.</desc>',
       f'<rect width="{W}" height="{H}" fill="#fbf8f1"/>',
       f'<text x="{PAD}" y="36" font-size="22" font-weight="700" fill="#3a232a">Loneliness by neighborhood, Monroe County, NY</text>',
       f'<text x="{PAD}" y="62" font-size="15" fill="#514a4c">Estimated share of adults who feel lonely always, usually or sometimes, by census tract (2023)</text>',
       '<g stroke="#fbf8f1" stroke-width="0.6" stroke-linejoin="round">']
for f in sorted(drawn, key=lambda f: f['properties']['GEOID']):
    g = f['properties']['GEOID']
    fill = RAMP[binof(tr[g]['LONELINESS'][0])] if g in tr else NOFILL
    svg.append(f'<path d="{path(f["geometry"])}" fill="{fill}"/>')
svg.append('</g><g fill="none" stroke="#3a232a" stroke-linejoin="round">')
for t in towns:
    city = t['properties']['NAME'] == CITY
    svg.append(f'<path d="{path(t["geometry"], 0.5)}" stroke-width="{2.2 if city else 0.7}" stroke-opacity="{1 if city else 0.55}"/>')
svg.append('</g><g font-size="13" fill="#3a232a" stroke="#fbf8f1" stroke-width="3.5" paint-order="stroke" text-anchor="middle" stroke-linejoin="round">')
for t in towns:
    p = t['properties']
    if p['NAME'] == 'East Rochester town':
        continue
    x, y = proj(float(p['INTPTLON']), float(p['INTPTLAT']))
    if p['NAME'] == CITY:
        svg.append(f'<text x="{x:.0f}" y="{y + 5:.0f}" font-size="16" font-weight="700" letter-spacing="1">ROCHESTER</text>')
    else:
        svg.append(f'<text x="{x:.0f}" y="{y + 4:.0f}">{esc(p["BASENAME"])}</text>')
svg.append('</g>')
ly = TOP + MAPH + 34
svg.append(f'<text x="{PAD}" y="{ly - 10}" font-size="14" font-weight="700" fill="#3a232a">Adults who feel lonely (number of tracts)</text>')
sw = (W - 2 * PAD) / 6
for i, (col, lab) in enumerate(list(zip(RAMP, BIN_LABELS)) + [(NOFILL, 'No estimate')]):
    x = PAD + i * sw
    cnt = bin_counts[i] if i < 5 else len([f for f in drawn if f['properties']['GEOID'] not in tr])
    svg.append(f'<rect x="{x:.0f}" y="{ly}" width="{sw - 8:.0f}" height="16" rx="3" fill="{col}"/>')
    svg.append(f'<text x="{x:.0f}" y="{ly + 36}" font-size="13" fill="#3a232a">{lab} ({cnt})</text>')
svg.append(f'<text x="{PAD}" y="{H - 34}" font-size="12" fill="#514a4c">Data: CDC PLACES 2025 release (model-based estimates from BRFSS 2023); Census 2020 tract and town boundaries.</text>')
svg.append(f'<text x="{PAD}" y="{H - 16}" font-size="12" fill="#514a4c">Thick line: City of Rochester. Map: Ruzicka Psychology, ruzickapsychology.com/research, CC BY 4.0.</text>')
svg.append('</svg>')
svg_text = '\n'.join(svg) + '\n'
os.makedirs(os.path.join(REPO, 'public', 'research'), exist_ok=True)
SVG_PATH = os.path.join(REPO, 'public', 'research', f'{SLUG}.svg')
open(SVG_PATH, 'w').write(svg_text)
svg_kb = round(len(svg_text.encode()) / 1024)
assert svg_kb < 400, svg_kb

# ---------- results ----------
results = {'slug': SLUG, 'brfss_year': 2023, 'county': {f'{m}_{t}': v for (m, t), v in county.items()},
           'places': {pid: {'name': v['name'], 'type': PTYPE[pid], 'town': v['town'], 'pop': v['pop'], **{f'{m}_{t}': v[(m, t)] for m in MEAS for t in ('CrdPrv', 'AgeAdjPrv')}} for pid, v in pl.items()},
           'towns': {k: {kk: (round(vv, 3) if isinstance(vv, float) else vv) for kk, vv in v.items()} for k, v in tw.items()},
           'tracts_with_estimates': len(tr), 'tracts_without': no_est, 'high_tracts_40plus': high, 'high_in_city': len(high_city),
           'high_outside_city': {g: town_of[g] for g in high_other}, 'tract_min': [lo_min, tr[lo_min]['LONELINESS'][0], town_of[lo_min]],
           'tract_max': [lo_max, tr[lo_max]['LONELINESS'][0], town_of[lo_max]], 'city_tract_range': [city_min, city_max],
           'suburban_towns_under_33': len(sub_low), 'suburban_range_under_33': sub_range, 'suburban_order': sub_sorted,
           'county_adults_lonely_est': county_adults_lonely, 'no_overlap_places': no_overlap, 'overlap_places': overlap, 'city_dark_tracts': city_dark, 'light_towns': light_towns, 'town_vs_cdc_place_gaps': SAME_GAPS, 'bin_counts': bin_counts, 'svg_kb': svg_kb}
json.dump(results, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)

# ---------- CSV: one row per tract ----------
rows = []
for f in sorted(tiger_tracts, key=lambda f: f['properties']['GEOID']):
    g = f['properties']['GEOID']
    if town_of[g] is None:
        continue
    v = tr.get(g)
    town = town_of[g].replace(' town', '').replace(' city', ' (city)')
    if v:
        rows.append([g, f['properties']['BASENAME'], town, v['pop'], v['adults'], *[x for m in MEAS for x in v[m]]])
    else:
        rows.append([g, f['properties']['BASENAME'], town, '', '', *([''] * 12)])
csv_href, csv_rows = write_csv(SLUG, ['tract_geoid', 'tract', 'town', 'population', 'adults_18plus',
                                      *[f'{m.lower()}_{s}' for m in MEAS for s in ('pct', 'ci_low', 'ci_high')]], rows)

# ---------- page ----------
TL = lambda k: 'City of Rochester' if k == CITY else k.replace(' town', '')
places_label = {'3663000': 'City of Rochester', '3608257': 'Brighton (same area as the Town of Brighton)',
                '3637737': 'Irondequoit (same area as the Town of Irondequoit)', '3622865': 'East Rochester (village; same area as the town)'}


def place_label(pid):
    v = pl[pid]
    if pid in places_label:
        return places_label[pid]
    town = v['town'].replace(' town', '')
    if pid in CAMPUS:
        return f'{v["name"]} campus (Town of {town})'
    if PTYPE[pid] == 'village':
        return f'Village of {v["name"]} (Town of {town})'
    return f'{v["name"]} (part of the Town of {town})'


ci = lambda pid, m: f'{c(pid, m)}% ({pl[pid][(m, "CrdPrv")][1]} to {pl[pid][(m, "CrdPrv")][2]})'
place_rows = [[place_label(pid), n(pl[pid]['pop']), ci(pid, 'LONELINESS'), f'{c(pid, "EMOTIONSPT")}%', f'{c(pid, "MHLTH")}%', f'{c(pid, "DEPRESSION")}%']
              for pid in sorted(pl, key=lambda p: (p != '3663000', -c(p, 'LONELINESS')))]
place_rows.append(['Monroe County', n(sum(v['pop'] for v in tr.values())), f'{cty("LONELINESS")}% ({county[("LONELINESS", "CrdPrv")][1]} to {county[("LONELINESS", "CrdPrv")][2]})',
                   f'{cty("EMOTIONSPT")}%', f'{cty("MHLTH")}%', f'{cty("DEPRESSION")}%'])
town_bars = [{'label': TL(k), 'value': round(tw[k]['LONELINESS'], 1), 'display': f'{d1(tw[k]["LONELINESS"])}%', 'tone': 'highlight' if k == CITY else 'default'}
             for k in sorted(tw, key=lambda k: -tw[k]['LONELINESS'])]
rl, rlo, rhi = roc[('LONELINESS', 'CrdPrv')]
headline = (f'An estimated {rl}% of adults in the City of Rochester feel lonely at least some of the time, against {d1(sub_range[0])}% to {d1(sub_range[1])}% '
            f'in {len(sub_low)} of Monroe County\'s {len(sub)} suburban towns. Of the {len(high)} census tracts where 40% or more of adults are estimated to be lonely, '
            f'{len(high_city)} are in the city.')
page = {
    'slug': SLUG,
    'kind': 'study',
    'title': 'Loneliness in Rochester and Its Suburbs, Mapped',
    'metaTitle': 'Loneliness in Rochester, NY vs the Suburbs: Neighborhood Map',
    'metaDescription': (f'An estimated {rl}% of Rochester adults feel lonely, against {d1(sub_range[0])}% to {d1(sub_range[1])}% in most suburban towns. '
                        f'Census tract map from CDC PLACES 2025 data.'),
    'eyebrow': 'Data study · Rochester and Monroe County',
    'headline': headline,
    'datePublished': PUBLISHED,
    'dateModified': PUBLISHED,
    'card': {'value': f'{rl}%', 'label': 'of City of Rochester adults estimated to feel lonely',
             'summary': f'{len(high_city)} of the {len(high)} loneliest census tracts in Monroe County are in the city. Most suburban towns are between {d1(sub_range[0])}% and {d1(sub_range[1])}%.'},
    'blocks': [
        {'type': 'keyNumbers', 'heading': 'Key numbers', 'items': [
            {'value': f'{rl}%', 'label': f'of adults in the City of Rochester are estimated to feel lonely always, usually or sometimes (likely range {rlo}% to {rhi}%)', 'source': 'CDC PLACES 2025 release, place estimates'},
            {'value': f'{d1(sub_range[0])}% to {d1(sub_range[1])}%', 'label': f'the estimate in {len(sub_low)} of the {len(sub)} suburban towns; the other two are {TL(sub_sorted[0])} ({d1(sub[sub_sorted[0]]["LONELINESS"])}%) and {TL(sub_sorted[1])} ({d1(sub[sub_sorted[1]]["LONELINESS"])}%)', 'source': 'Ruzicka Psychology, from CDC PLACES tract estimates'},
            {'value': f'{len(high_city)} of {len(high)}', 'label': 'census tracts where 40% or more of adults are estimated to be lonely are in the City of Rochester', 'source': 'CDC PLACES 2025 release, census tract estimates'},
            {'value': f'{c("3663000", "EMOTIONSPT")}%', 'label': f'of Rochester adults are estimated to lack the social and emotional support they need, against {cty("EMOTIONSPT")}% countywide', 'source': 'CDC PLACES 2025 release'},
            {'value': f'{c("3663000", "MHLTH")}%', 'label': f'of Rochester adults are estimated to have frequent mental distress (14 or more poor mental health days a month), against {cty("MHLTH")}% countywide', 'source': 'CDC PLACES 2025 release'},
            {'value': f'{cty("LONELINESS")}%', 'label': f'of all Monroe County adults are estimated to feel lonely, roughly one in three', 'source': 'CDC PLACES 2025 release, county estimate'},
        ]},
        {'type': 'notice', 'text': 'If you are in crisis or thinking about harming yourself, call or text 988 (Suicide & Crisis Lifeline, free, 24/7). If you or anyone else is in immediate danger, call 911. Local lines are on our [resources page](/resources).'},
        {'type': 'map', 'heading': 'Loneliness by census tract', 'description': f'Each shape is a census tract, a neighborhood of a few thousand people. Darker tracts have a higher estimated share of adults who feel lonely. The thick line is the City of Rochester.',
         'src': f'/research/{SLUG}.svg', 'width': W, 'height': H,
         'alt': (f'Map of Monroe County, New York, shaded by census tract. {city_dark} of the City of Rochester\'s {len(city_tracts)} tracts are in the two darkest shades (36% or more of adults lonely), '
                 f'including {len(high_city)} at 40% or more. Most suburban tracts are under 33%; the lightest (under 30%) are mostly in {", ".join(TL(k) for k in light_towns[:3])} and {TL(light_towns[3])}. '
                 f'Outside the city, tracts in Henrietta and Sweden also reach 40% or more.'),
         'note': f'Source: CDC PLACES 2025 release (estimates from BRFSS 2023); Census 2020 boundaries. {len(no_est_city)} city tracts with few or no residents have no estimate. The tract-by-tract figures are in the CSV below.'},
        {'type': 'chart', 'heading': 'Estimated share of adults who feel lonely, by town',
         'description': f'Average of the census tract estimates in each town, weighted by number of adults. The City of Rochester is highest at {d1(tw[CITY]["LONELINESS"])}%.',
         'unit': 'percent of adults', 'bars': town_bars,
         'note': 'Source: Ruzicka Psychology calculation from CDC PLACES 2025 tract estimates. For Rochester, Brighton, Irondequoit and East Rochester, whose boundaries match a CDC place, the result is within 0.1 percentage point of CDC\'s own estimate.'},
        {'type': 'table', 'heading': 'Every Monroe County place in the CDC data',
         'caption': 'CDC PLACES 2025 estimates for adults, with the likely range (95% confidence interval) for loneliness. Places are as the Census defines them, so some cover only part of a town.',
         'columns': ['Place', 'Residents', 'Lonely (likely range)', 'Lack support', 'Frequent mental distress', 'Ever told they have depression'],
         'rows': place_rows},
        {'type': 'prose', 'eyebrow': 'Findings', 'heading': 'What the data shows', 'paragraphs': [
            f'Loneliness is common across Monroe County: CDC estimates that {cty("LONELINESS")}% of adults feel lonely at least some of the time, roughly one in three. It is most common in the City of Rochester, at an estimated {rl}%.',
            f'Most suburban towns sit well below the city, between {d1(sub_range[0])}% and {d1(sub_range[1])}%. The lowest are {TL(sub_sorted[-1])} ({d1(sub[sub_sorted[-1]]["LONELINESS"])}%), {TL(sub_sorted[-2])} ({d1(sub[sub_sorted[-2]]["LONELINESS"])}%) and {TL(sub_sorted[-3])} ({d1(sub[sub_sorted[-3]]["LONELINESS"])}%). Two towns are closer to the city: {TL(sub_sorted[0])} ({d1(sub[sub_sorted[0]]["LONELINESS"])}%) and {TL(sub_sorted[1])} ({d1(sub[sub_sorted[1]]["LONELINESS"])}%).',
            f'Neighborhood by neighborhood, estimates range from {tr[lo_min]["LONELINESS"][0]}% in a tract in {TL(town_of[lo_min])} to {tr[lo_max]["LONELINESS"][0]}% in a tract in {TL(town_of[lo_max])}. Inside the city they range from {city_min}% to {city_max}%. {len(high_city)} of the {len(high)} tracts at 40% or more are in the city; the other {len(high_other)} are in {" and ".join(sorted(TL(town_of[g]) for g in high_other))}.',
            f'The highest estimates of all are for the three college campuses the Census counts as their own places (Census names): {campus_text}.',
            f'Among the county\'s towns, the city also has the highest estimated share of adults who lack the social and emotional support they need ({c("3663000", "EMOTIONSPT")}%, against {c("3608257", "EMOTIONSPT")}% in Brighton and {c("3637737", "EMOTIONSPT")}% in Irondequoit). It ties with Sweden for the highest share with frequent mental distress ({c("3663000", "MHLTH")}%, against {c("3608257", "MHLTH")}% in Brighton and {c("3637737", "MHLTH")}% in Irondequoit).',
            f'The gaps hold after CDC adjusts for differences in age: Rochester\'s age-adjusted loneliness estimate is {c("3663000", "LONELINESS", "AgeAdjPrv")}%, against {c("3608257", "LONELINESS", "AgeAdjPrv")}% in Brighton and {c("3637737", "LONELINESS", "AgeAdjPrv")}% in Irondequoit.',
            f'Diagnosed depression follows a different pattern. The share of adults ever told they have depression differs much less: {c("3663000", "DEPRESSION")}% in the city, {c("3608257", "DEPRESSION")}% in Brighton, {c("3637737", "DEPRESSION")}% in Irondequoit and {cty("DEPRESSION")}% countywide.',
        ]},
        {'type': 'points', 'eyebrow': 'For Rochester-area adults', 'heading': 'What this means', 'items': [
            f'Feeling lonely is common here. About one in three Monroe County adults reports feeling lonely at least some of the time, so it is not unusual and not a personal failing.',
            f'Loneliness is not only a city experience. Even the least lonely neighborhood in the county has an estimated {tr[lo_min]["LONELINESS"][0]}% of adults who feel lonely at least some of the time.',
            'Loneliness and depression are different measures, and in this data they follow different patterns across the county.',
            'Ruzicka Psychology offers [individual therapy](/specialties/individual-therapy) and [group therapy](/specialties/group-therapy) in Rochester. Local support lines are listed on our [resources page](/resources).',
        ]},
        {'type': 'prose', 'eyebrow': 'Method', 'heading': 'How we built the map', 'paragraphs': [
            'Estimates: CDC PLACES, 2025 release, which estimates the share of adults with each measure in every county, place and census tract from the 2023 Behavioral Risk Factor Surveillance System (BRFSS). Loneliness counts adults who say they feel lonely always, usually or sometimes. Lack of social and emotional support counts adults who say they get the support they need sometimes, rarely or never. Frequent mental distress counts adults who say their mental health was not good on 14 or more of the past 30 days. Figures are crude prevalence (the actual share of adults) unless marked age-adjusted.',
            'Towns: each census tract is assigned to the town (or the City of Rochester) that contains its Census internal point, using Census 2020 boundaries. A town\'s figure is the average of its tracts\' estimates, weighted by the number of adults in each tract.',
            'Places: CDC also publishes estimates for Census places. Some places, such as Rochester, Brighton and Irondequoit, cover a whole town or city. Others, such as the villages and the Greece and Gates Census-designated places, cover only part of a town, so their figures can differ from the town averages.',
        ]},
        {'type': 'prose', 'eyebrow': 'Limits', 'heading': 'What these estimates cannot tell you', 'paragraphs': [
            'These are model-based estimates, not counts from a survey of each neighborhood. CDC predicts survey answers for each area from statewide BRFSS responses and the characteristics of the people who live there, such as age, sex, and race and ethnicity. Two areas with similar populations will get similar estimates even if their residents feel differently.',
            f'Each estimate has a likely range (95% confidence interval), and most of them overlap. Rochester\'s range for loneliness ({rlo}% to {rhi}%) overlaps with the ranges for {len(overlap)} of the {len(noncampus)} other places in the county that are not college campuses; only the {" and ".join(place_label(p).split(" (")[0] for p in no_overlap)}\'s range sits entirely below it. The city-suburb pattern is consistent on the map and across loneliness, support and distress, but the gap between the city and any single suburb is less certain than the single numbers suggest.',
            'Loneliness was asked in an optional BRFSS module, so the estimates rest on fewer survey answers than common measures.',
            'The data shows where loneliness is more common. It does not show why, and it does not say anything about what helps.',
        ]},
    ],
    'sources': [
        {'name': 'CDC PLACES: Local Data for Better Health, Place Data 2025 release', 'period': 'BRFSS 2023 model-based estimates', 'url': 'https://data.cdc.gov/d/eav7-hnsx'},
        {'name': 'CDC PLACES: Local Data for Better Health, Census Tract Data 2025 release', 'period': 'BRFSS 2023 model-based estimates', 'url': 'https://data.cdc.gov/d/cwsq-ngmh'},
        {'name': 'CDC PLACES: Local Data for Better Health, County Data 2025 release', 'period': 'BRFSS 2023 model-based estimates', 'url': 'https://data.cdc.gov/d/swc5-untb'},
        {'name': 'CDC PLACES measure definitions: health-related social needs', 'period': '2025 release', 'url': 'https://www.cdc.gov/places/measure-definitions/health-related-social-needs.html'},
        {'name': 'U.S. Census Bureau, TIGERweb: Census 2020 tracts and county subdivisions', 'period': 'Census 2020 boundaries', 'url': 'https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_main.html'},
    ],
    'citation': 'Ruzicka Psychology. "Loneliness in Rochester and Its Suburbs, Mapped." November 13, 2026. https://www.ruzickapsychology.com/research/rochester-loneliness-map. Data: CDC PLACES 2025 release; U.S. Census Bureau.',
    'csv': {'href': csv_href, 'rows': csv_rows, 'label': f'Every Monroe County census tract with its town and the CDC estimates for loneliness, lack of support, frequent mental distress and depression, with likely ranges (CSV, {csv_rows} rows)'},
    'dataset': {
        'name': 'Loneliness, social and emotional support and mental distress by census tract, Monroe County, New York',
        'description': 'CDC PLACES 2025 model-based estimates (BRFSS 2023) for every Monroe County census tract, with each tract assigned to its town, and adult-weighted town averages.',
        'temporalCoverage': '2023',
        'spatialCoverage': 'Monroe County, New York, United States',
        'variableMeasured': ['Feelings of loneliness among adults', 'Lack of social and emotional support among adults', 'Frequent mental distress among adults', 'Depression among adults'],
    },
    'related': [
        {'label': 'Individual therapy', 'href': '/specialties/individual-therapy'},
        {'label': 'Group therapy', 'href': '/specialties/group-therapy'},
        {'label': 'How many therapists does Monroe County have?', 'href': '/research/monroe-county-therapists'},
    ],
}
assert_text_has(page, f'{rl}%', f'{len(high_city)} of {len(high)}', f'{cty("LONELINESS")}%')
write_page(page)
print(json.dumps({'roc': [rl, rlo, rhi], 'sub_range': sub_range, 'n_low': len(sub_low), 'top2': [(k, round(sub[k]['LONELINESS'], 1)) for k in sub_sorted[:2]],
                  'bottom3': [(k, round(sub[k]['LONELINESS'], 1)) for k in sub_sorted[-3:]], 'high': [len(high), len(high_city), {g: town_of[g] for g in high_other}],
                  'tract_min': results['tract_min'], 'tract_max': results['tract_max'], 'city_range': [city_min, city_max], 'bins': bin_counts, 'svg_kb': svg_kb, 'H': H,
                  'county': {m: cty(m) for m in MEAS}, 'adults_lonely': round(county_adults_lonely)}))
