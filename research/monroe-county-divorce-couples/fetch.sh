#!/bin/sh
# Re-downloads the raw public files into raw/. build.py checks each against sources.json (SHA-256).
# Population (Census) and licensed MFT counts (NYSED) are read from ../monroe-county-therapists (run its fetch.sh too).
set -e
cd "$(dirname "$0")" && mkdir -p raw && cd raw
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
B=https://healthweb-back.health.ny.gov/statistics/vital_statistics
for y in 2015 2016 2017 2018 2019 2020 2021 2022 2023; do
  curl -sfL -A "$UA" -o "nysdoh-$y-table47.htm" "$B/$y/table47.htm"
  curl -sfL -A "$UA" -o "nysdoh-$y-table48.htm" "$B/$y/table48.htm"
done
curl -sfL -A "$UA" -o nysdoh-2023-table51.htm "$B/2023/table51.htm"
curl -sfL -A "$UA" -o nysdoh-2023-table52.htm "$B/2023/table52.htm"
