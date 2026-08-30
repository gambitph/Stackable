/**
 * Playwright config for Stackable's free e2e suite.
 *
 * WordPress is provided by `@wp-playground/cli` (WASM PHP + SQLite) via
 * `webServer` — no Docker, MySQL, or local WP install required.
 *
 * `WP_BASE_URL` must be set before `@wordpress/e2e-test-utils-playwright` is
 * first imported (it reads `process.env.WP_BASE_URL` at module load time).
 *
 * See e2e/readme.md.
 */
const path = require( 'path' )
const { defineConfig, devices } = require( '@playwright/test' )

// Distinct from Cimo (9410) / Ahentic (9400) so suites can run together locally.
const PORT = process.env.WP_PORT || '9420'
const baseURL = process.env.WP_BASE_URL || `http://127.0.0.1:${ PORT }`
process.env.WP_BASE_URL = baseURL
process.env.WP_USERNAME = process.env.WP_USERNAME || 'admin'
process.env.WP_PASSWORD = process.env.WP_PASSWORD || 'password'
process.env.STACKABLE_SLUG = process.env.STACKABLE_SLUG || 'stackable/plugin'

const STORAGE_STATE_PATH = path.join( __dirname, 'e2e/.auth/admin.json' )
process.env.STORAGE_STATE_PATH = STORAGE_STATE_PATH

const PLAYGROUND_BLUEPRINT = path.join( __dirname, 'e2e/playground-blueprint.json' )
const PHP_VERSION = process.env.WP_PHP_VERSION || '8.2'
const WP_VERSION = process.env.WP_VERSION || 'latest'

const E2E_META_MU = path.join(
	__dirname,
	'e2e/config/stackable-e2e-mu-plugin.php'
)

module.exports = defineConfig( {
	testDir: './e2e/tests',
	globalSetup: require.resolve( './e2e/config/global-setup.js' ),
	fullyParallel: false,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	// Playground PHP 7.4 WASM often needs more than Playwright's 5s expect
	// default. Per-test budget must stay above a couple of slow asserts.
	timeout: 180_000,
	expect: { timeout: 30_000 },
	reporter: process.env.CI
		? [ [ './e2e/config/reporter.ts', { outputFolder: './playwright-stk' } ], [ 'github' ], [ 'html', { open: 'never' } ] ]
		: [ [ 'list' ], [ 'html', { outputFolder: 'playwright-report', open: 'never' } ] ],
	reportSlowTests: null,
	webServer: {
		command: [
			'npx @wp-playground/cli server',
			'--mount=.:/wordpress/wp-content/plugins/stackable',
			`--mount=${ E2E_META_MU }:/wordpress/wp-content/mu-plugins/stackable-e2e.php`,
			`--blueprint=${ PLAYGROUND_BLUEPRINT }`,
			`--php=${ PHP_VERSION }`,
			`--wp=${ WP_VERSION }`,
			`--port=${ PORT }`,
			'--workers=1',
		].join( ' ' ),
		// Use `port`, not `url`: Playground auto-login 302-loops cookie-less probes.
		port: Number( PORT ),
		reuseExistingServer: ! process.env.CI,
		timeout: 180 * 1000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
	use: {
		baseURL,
		storageState: STORAGE_STATE_PATH,
		navigationTimeout: 60_000,
		ignoreHTTPSErrors: true,
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
		...devices[ 'Desktop Chrome' ],
	},
} )
