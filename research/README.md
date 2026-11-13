# Research data

Source data, build scripts and independent checks for the `/research` pages.

Each study folder holds:

- `fetch.sh`: downloads the public source files into `raw/`.
- `sources.json`: source name, URL, period, retrieval date and SHA-256 of each raw file.
- `build.py`: computes every figure and writes `src/data/research/<slug>.json` (the page) and `public/research/<slug>.csv` (the download, CC BY 4.0). Do not edit those outputs by hand.
- `check.py`: re-fetches the headline figures by a different route (live pages, another table or endpoint) and checks them against the page. Writes `check.json`.
- `results.json` / `check.json`: the last build and check outputs.

Run from the repo root:

```sh
sh research/<slug>/fetch.sh   # only when raw/ is missing or the source has been updated
python3 research/<slug>/build.py
python3 research/<slug>/check.py
```

The pages are bylined to Ruzicka Psychology. They carry population and supply data only: no treatment or outcome claims, no client data, and no individual clinicians' names.
