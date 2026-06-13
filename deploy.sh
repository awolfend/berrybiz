#!/bin/bash
# First run: creates the project on CF and deploys. Subsequent runs: just deploys.
set -e
WRANGLER=/Users/awolfend/Intertek-Website/node_modules/.bin/wrangler
cd "$(dirname "$0")"

node_modules/.bin/npm run build

if ! "$WRANGLER" pages project list 2>/dev/null | grep -q "berrybiz"; then
  "$WRANGLER" pages project create berrybiz --production-branch main
fi

"$WRANGLER" pages deploy dist --project-name berrybiz
