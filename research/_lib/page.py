"""Shared helpers for the /research build scripts.

Each study's build.py computes its figures from raw files, then calls write_page() to write:
  * src/data/research/<slug>.json  (the page content the Next.js route renders; every number on the page comes from here)
  * public/research/<slug>.csv     (the downloadable table, CC BY 4.0)
The page JSON is generated: never edit it by hand. Re-run the study's build.py instead.
"""
import csv, hashlib, json, os, re

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE_URL = 'https://www.ruzickapsychology.com'
PUBLISHER = 'Ruzicka Psychology'
LICENSE = 'https://creativecommons.org/licenses/by/4.0/'


def sha256(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def verify_sources(here):
    """Stop if any raw file differs from the hash recorded in sources.json."""
    sources = json.load(open(os.path.join(here, 'sources.json')))
    for s in sources['files']:
        p = os.path.join(here, 'raw', s['file'])
        assert os.path.exists(p), f'missing raw/{s["file"]}: run fetch.sh'
        assert sha256(p) == s['sha256'], f'raw/{s["file"]} changed since sources.json was written'
    return sources


def n(x):
    """Whole number with thousands separators."""
    return f'{int(round(x)):,}'


def d1(x):
    """One decimal place, thousands separators."""
    return f'{x:,.1f}'


def pct(x, places=1):
    return f'{x:.{places}f}%'


def html_text(path):
    t = open(path, encoding='utf-8', errors='replace').read()
    t = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', t)
    import html as _h
    return re.sub(r'\s+', ' ', _h.unescape(re.sub(r'<[^>]+>', ' ', t)))


def write_csv(slug, header, rows):
    out = os.path.join(REPO, 'public', 'research', f'{slug}.csv')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(header)
        w.writerows(rows)
    return f'/research/{slug}.csv', len(rows)


def write_page(page):
    """Write the page JSON. Fails if any text still holds a template placeholder."""
    blob = json.dumps(page, ensure_ascii=False, indent=2) + '\n'
    for bad in (r'\{n\(', r'\{d1\(', r'\{pct\(', r'\bNone\b', r'\bnan\b', r'\binf\b'):
        assert not re.search(bad, blob), f'placeholder or empty value in page text: {bad}'
    out = os.path.join(REPO, 'src', 'data', 'research', f'{page["slug"]}.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(blob)
    return out


def assert_text_has(page, *values):
    """Every headline figure must appear verbatim somewhere in the page text."""
    blob = json.dumps(page, ensure_ascii=False)
    for v in values:
        assert v in blob, f'figure {v!r} missing from page text'
