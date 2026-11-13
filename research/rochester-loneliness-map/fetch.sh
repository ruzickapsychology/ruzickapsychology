#!/bin/sh
# Re-downloads the raw public files into raw/. build.py checks each against sources.json (SHA-256).
set -e
cd "$(dirname "$0")" && mkdir -p raw && cd raw
SEL='year,stateabbr,locationname,locationid,measureid,datavaluetypeid,data_value,low_confidence_limit,high_confidence_limit,totalpopulation,totalpop18plus'
M="measureid%20in('LONELINESS','EMOTIONSPT','MHLTH','DEPRESSION')"
# CDC PLACES 2025 release: places in a box around Monroe County (build.py keeps those inside the county), Monroe tracts, Monroe county.
curl -sf -o places-place-2025.json "https://data.cdc.gov/resource/eav7-hnsx.json?\$select=$SEL,geolocation&\$where=stateabbr='NY'%20AND%20$M%20AND%20within_box(geolocation,43.40,-78.10,42.90,-77.30)&\$order=locationid,measureid,datavaluetypeid&\$limit=5000"
curl -sf -o places-tract-2025.json "https://data.cdc.gov/resource/cwsq-ngmh.json?\$select=$SEL,countyname&\$where=stateabbr='NY'%20AND%20countyfips='36055'%20AND%20$M&\$order=locationname,measureid&\$limit=5000"
curl -sf -o places-county-2025.json "https://data.cdc.gov/resource/swc5-untb.json?\$select=$SEL&\$where=stateabbr='NY'%20AND%20locationid='36055'%20AND%20$M&\$order=measureid,datavaluetypeid&\$limit=50"
# Census TIGERweb, Census 2020 vintage: Monroe tracts (layer 10) and county subdivisions = towns + City of Rochester (layer 22).
Q='https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb'
curl -sf -G "$Q/Tracts_Blocks/MapServer/10/query" --data-urlencode "where=STATE='36' AND COUNTY='055'" --data-urlencode 'outFields=GEOID,BASENAME,INTPTLAT,INTPTLON,AREALAND' --data-urlencode 'returnGeometry=true' --data-urlencode 'outSR=4326' --data-urlencode 'geometryPrecision=5' --data-urlencode 'orderByFields=GEOID' --data-urlencode 'f=geojson' -o tiger2020-tracts-monroe.geojson
curl -sf -G "$Q/Places_CouSub_ConCity_SubMCD/MapServer/22/query" --data-urlencode "where=STATE='36' AND COUNTY='055'" --data-urlencode 'outFields=GEOID,NAME,BASENAME,INTPTLAT,INTPTLON' --data-urlencode 'returnGeometry=true' --data-urlencode 'outSR=4326' --data-urlencode 'geometryPrecision=5' --data-urlencode 'orderByFields=GEOID' --data-urlencode 'f=geojson' -o tiger2020-cousub-monroe.geojson
