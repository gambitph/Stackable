/**
 * Playwright config for Stackable's upgrade e2e suite.
 *
 * Boots Playground with WordPress.org Stackable (pinned in upgrade-from.js)
 * active and the current repo mounted inactive as `stackable/`. Specs insert
 * blocks, swap plugins, and assert Gutenberg does not show Attempt Block Recovery.
 *
 * Isolated port so plugin swaps cannot poison the free suite.
 *
 * See e2e/readme.md.
 */
const path = require( 'path' )
const { defineConfig, devices } = require( '@playwright/test' )
const { UPGRADE_FROM_VERSION } = require( './e2e/config/upgrade-from.js' )
const { writeUpgradeBlueprint } = require( './e2e/config/upgrade-blueprint.js' )

const PORT = process.env.WP_PORT || '9422'
const baseURL = process.env.WP_BASE_URL || `http://127.0.0.1:${ PORT }`
process.env.WP_BASE_URL = baseURL
process.env.WP_USERNAME = process.env.WP_USERNAME || 'admin'
process.env.WP_PASSWORD = process.env.WP_PASSWORD || 'password'
process.env.STACKABLE_SLUG = process.env.STACKABLE_SLUG || 'stackable/plugin'
process.env.STACKABLE_UPGRADE_FROM = process.env.STACKABLE_UPGRADE_FROM || UPGRADE_FROM_VERSION

const STORAGE_STATE_PATH = path.join( __dirname, 'e2e/.auth/admin.upgrade.json' )
process.env.STORAGE_STATE_PATH = STORAGE_STATE_PATH

const PLAYGROUND_BLUEPRINT = writeUpgradeBlueprint(
	path.join( __dirname, 'e2e/.auth/upgrade-blueprint.json' )
)
const PHP_VERSION = process.env.WP_PHP_VERSION || '8.2'
const WP_VERSION = process.env.WP_VERSION || 'latest'

const E2E_META_MU = path.join(
	__dirname,
	'e2e/config/stackable-e2e-mu-plugin.php'
)

module.exports = defineConfig( {
	testDir: './e2e/tests-upgrade',
	globalSetup: require.resolve( './e2e/config/global-setup-upgrade.js' ),
	fullyParallel: false,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	timeout: 180_000,
	reporter: process.env.CI
		? [ [ './e2e/config/reporter.ts', { outputFolder: './playwright-stk-upgrade' } ], [ 'github' ], [ 'html', { outputFolder: 'playwright-report-upgrade', open: 'never' } ] ]
		: [ [ 'list' ], [ 'html', { outputFolder: 'playwright-report-upgrade', open: 'never' } ] ],
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
		port: Number( PORT ),
		reuseExistingServer: ! process.env.CI,
		timeout: 240 * 1000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
	use: {
		baseURL,
		storageState: STORAGE_STATE_PATH,
		ignoreHTTPSErrors: true,
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
		...devices[ 'Desktop Chrome' ],
	},
} )
