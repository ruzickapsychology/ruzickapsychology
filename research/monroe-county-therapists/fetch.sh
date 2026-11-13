#!/bin/sh
# Re-downloads the raw public files into raw/. build.py checks each against sources.json (SHA-256).
# NYSED pages change when NYSED updates its counts (dated "as of" on the page): if a hash differs,
# re-check the figures and update sources.json deliberately.
set -e
cd "$(dirname "$0")" && mkdir -p raw && cd raw
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
for p in psychology licensed-clinical-social-worker mental-health-counselors marriage-and-family-therapists; do
  curl -sfL -A "$UA" -o "nysed-$p.html" "https://www.op.nysed.gov/professions/$p/license-statistics"
done
curl -sfL -A "$UA" -o co-est2025-alldata.csv "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv"
