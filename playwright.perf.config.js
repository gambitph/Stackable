/**
 * Playwright config for the frontend performance suite (e2e/perf).
 *
 * Unlike the other e2e configs this doesn't start WordPress Playground: it
 * drives a local throwaway WordPress site (php -S + SQLite) so it can switch
 * plugin builds, reset the database to a fresh install, and measure queries,
 * memory, page size and DOM nodes the way DynamicWP's benchmark does.
 *
 *   STK_PERF_PLUGIN=/path/to/built/stackable \
 *   STK_PERF_LEGACY=off|on|release \
 *   npx playwright test -c playwright.perf.config.js
 *
 * See e2e/perf/README.md.
 */
const fs = require( 'fs' )
const { defineConfig } = require( '@playwright/test' )

const chrome = process.env.STK_PERF_CHROME || ( fs.existsSync( '/usr/bin/google-chrome' ) ? '/usr/bin/google-chrome' : '' )

module.exports = defineConfig( {
	testDir: './e2e/perf',
	testMatch: /.*\.spec\.js$/,
	fullyParallel: false,
	workers: 1,
	retries: 0,
	timeout: 300_000,
	expect: { timeout: 30_000 },
	reporter: [
		[ 'list' ],
		[ 'json', { outputFile: process.env.STK_PERF_JSON || 'playwright-perf/results.json' } ],
	],
	use: {
		launchOptions: chrome ? { executablePath: chrome, args: [ '--no-sandbox' ] } : {},
	},
} )
