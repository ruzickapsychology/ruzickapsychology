#!/bin/sh
# Re-downloads the raw public files into raw/. build.py checks each against sources.json (SHA-256).
set -e
cd "$(dirname "$0")" && mkdir -p raw && cd raw
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
curl -sfL -A "$UA" -o nysdoh-2023-table07.htm "https://healthweb-back.health.ny.gov/statistics/vital_statistics/2023/table07.htm"
curl -sfL -A "$UA" -o nysdoh-maternal-depression.htm "https://healthweb-back.health.ny.gov/community/pregnancy/health_care/perinatal/maternal_depression/providers/what_is_maternial_depression.htm"
curl -sfL -A "$UA" -o births-by-age-monroe-region-2008-2023.json "https://health.data.ny.gov/resource/i7yg-w5rg.json?\$where=county%20in(%27Monroe%27,%27Genesee%27,%27Livingston%27,%27Ontario%27,%27Orleans%27,%27Wayne%27)%20AND%20mother_s_age_range=%27Total%27&\$order=county,year&\$limit=500"
