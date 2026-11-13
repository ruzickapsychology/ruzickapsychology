#!/bin/sh
# Re-downloads the raw public files into raw/. build.py checks the committed ones against sources.json (SHA-256).
# The other figures on this page come from the four study folders next to this one (their results.json).
set -e
cd "$(dirname "$0")" && mkdir -p raw && cd raw
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
# CDC PLACES 2025 county data, every New York county (for Monroe's rank).
curl -sf -o places-county-ny-2025.json "https://data.cdc.gov/resource/swc5-untb.json?\$select=locationid,locationname,measureid,data_value,low_confidence_limit,high_confidence_limit,year&\$where=stateabbr='NY'%20AND%20datavaluetypeid='CrdPrv'%20AND%20measureid%20in('LONELINESS','EMOTIONSPT','MHLTH','DEPRESSION')&\$order=locationid,measureid&\$limit=1000"
# 988 Lifeline In-State KPI report, July 2026 (Vibrant Emotional Health).
curl -sfL -A "$UA" -o 988-in-state-kpi-2026-07.pdf "https://988lifeline.org/wp-content/uploads/2026/08/July-26-988-In-State-Monthly-Report.pdf"
# HRSA mental health HPSA detail file (25 MB, rewritten daily, not committed); keep the Monroe County, NY rows.
curl -sfL -A "$UA" -o BCD_HPSA_FCT_DET_MH.csv "https://data.hrsa.gov/DataDownload/DD_Files/BCD_HPSA_FCT_DET_MH.csv"
python3 - <<'PY'
import csv, json
keep = ['HPSA ID', 'HPSA Name', 'Designation Type', 'HPSA Discipline Class', 'HPSA Status', 'HPSA Score', 'HPSA Designation Population',
        'HPSA Population Type', 'HPSA Designation Date', 'HPSA Designation Last Update Date', 'Withdrawn Date', 'HPSA Component Name',
        'HPSA Component Type Description', 'HPSA Component Source Identification Number', 'Common County Name', 'Common State Abbreviation']
rows = [{k: r[k] for k in keep} for r in csv.DictReader(open('BCD_HPSA_FCT_DET_MH.csv', encoding='utf-8-sig'))
        if r['Common State Abbreviation'] == 'NY' and r['Common County Name'] == 'Monroe County, NY']
rows.sort(key=lambda r: (r['HPSA ID'], r['HPSA Component Source Identification Number'], r['HPSA Component Name']))
json.dump(rows, open('hrsa-mh-hpsa-monroe.json', 'w'), indent=1)
print(len(rows), 'HRSA rows for Monroe County, NY')
PY
