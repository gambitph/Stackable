#!/bin/bash
# Runs the frontend CSS checks (e2e/perf) against a throwaway WordPress site
# made by setup-site.sh (WordPress + SQLite served by `php -S`, so the tests
# can reset the database between files and use WP-CLI).
#
#   e2e/perf/ci/run.sh <plugin dir> <off|on>
#
#   off: the new CSS loading.
#   on:  the legacy flag on.
#
# Then the CSS/JS/query/DOM budget check (ci/budget-check.js).
#
# Needs php (with pdo_sqlite), WP-CLI (installed if missing), node and the
# Playwright Chromium browser.
set -euo pipefail
PLUGIN=$( cd "$1" && pwd )
MODE=$2
ROOT=$( cd "$( dirname "$0" )/../../.." && pwd )
WORK=${STK_PERF_CI_DIR:-${RUNNER_TEMP:-/tmp}/stk-perf-ci}
export STK_PERF_WP_PATH=$WORK/site
export STK_PERF_SNAPSHOT=$WORK/base.sqlite
export STK_PERF_URL=${STK_PERF_URL:-http://127.0.0.1:8896}
mkdir -p "$WORK"
cd "$ROOT"

t0=$( date +%s )
if [ ! -f "$STK_PERF_SNAPSHOT" ]; then
	bash e2e/perf/ci/setup-site.sh "$STK_PERF_WP_PATH" "$STK_PERF_SNAPSHOT" "${STK_PERF_WP_VERSION:-6.8.3}" "$STK_PERF_URL"
fi
echo "::notice::site setup $(( $( date +%s ) - t0 ))s"

t2=$( date +%s )
export STK_PERF_PLUGIN="$PLUGIN"
export STK_PERF_LEGACY="$MODE"
npm run test:perf
echo "::notice::perf suite (legacy $MODE) $(( $( date +%s ) - t2 ))s"

t3=$( date +%s )
node e2e/perf/ci/budget-check.js
echo "::notice::budget check $(( $( date +%s ) - t3 ))s"
