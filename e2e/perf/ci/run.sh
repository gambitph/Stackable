#!/bin/bash
# Runs the CI part of the frontend performance suite (e2e/perf) against a
# throwaway WordPress site made by setup-site.sh (WordPress + SQLite served
# by `php -S`, so the tests can reset the database between files and use
# WP-CLI). The size budget, memory and DynamicWP benchmark tests (@bench) are
# left out, their numbers vary on shared CI machines (npm run test:perf:bench).
#
#   e2e/perf/ci/run.sh <plugin dir> <off|on>
#
#   off: the new CSS loading. Static CSS order check, then the suite.
#   on:  the legacy flag on. Records the output of the last release (from
#        WordPress.org) for legacy-identical.spec.js, then the suite.
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
export STK_PERF_REF_DIR=$WORK/legacy-ref
mkdir -p "$WORK"
cd "$ROOT"

t0=$( date +%s )
if [ ! -f "$STK_PERF_SNAPSHOT" ]; then
	bash e2e/perf/ci/setup-site.sh "$STK_PERF_WP_PATH" "$STK_PERF_SNAPSHOT" "${STK_PERF_WP_VERSION:-6.8.3}" "$STK_PERF_URL"
fi
echo "::notice::site setup $(( $( date +%s ) - t0 ))s"

if [ "$MODE" = on ]; then
	t1=$( date +%s )
	REL=${STK_PERF_RELEASE:-3.20.3}
	if [ ! -d "$WORK/release-$REL" ]; then
		curl -sSfL -o "$WORK/release.zip" "https://downloads.wordpress.org/plugin/stackable-ultimate-gutenberg-blocks.$REL.zip"
		unzip -q -o "$WORK/release.zip" -d "$WORK/release-$REL"
	fi
	STK_PERF_PLUGIN="$WORK/release-$REL/stackable-ultimate-gutenberg-blocks" STK_PERF_LEGACY=release STK_PERF_REF_WRITE=1 STK_PERF_JSON="$WORK/legacy-ref.json" \
		npx playwright test -c playwright.perf.config.js legacy-identical
	echo "::notice::legacy reference ($REL) $(( $( date +%s ) - t1 ))s"
else
	node e2e/perf/visual/run-css-order.js "$PLUGIN"
fi

t2=$( date +%s )
STK_PERF_PLUGIN="$PLUGIN" STK_PERF_LEGACY="$MODE" STK_PERF_LEGACY_CSS_ORDER=ignore npm run test:perf:ci
echo "::notice::perf suite (legacy $MODE) $(( $( date +%s ) - t2 ))s"
