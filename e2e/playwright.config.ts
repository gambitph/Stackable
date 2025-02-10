import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'url'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv'
import path from 'path'
dotenv.config( { path: path.resolve( __dirname, '../.env' ) } )

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig( {
	// This is run before any tests. Check the file for more information.
	// globalSetup: 'e2e-global-setup.ts',
	globalSetup: fileURLToPath(
		new URL( './config/global-setup.ts', 'file:' + __filename ).href
	),
	/* Run tests in files in parallel */
	// fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	// forbidOnly: !! process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 1 : 0,
	// Locally, we could take advantage of parallelism due to multicore systems.
	// However, in the CI, we typically can use only one worker at a time.
	// It's more straightforward to align how we run tests in both systems.
	// https://playwright.dev/docs/test-parallel
	// workers: process.env.CI ? 1 : undefined,
	workers: 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [ [ './config/reporter.ts' ], [ 'html', { outputFolder: '../playwright-report', open: 'never' } ] ],
	reportSlowTests: null,
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		// trace: 'on-first-retry',

		// It's simpler to use relative paths when referencing our application's URLs.
		// https://playwright.dev/docs/test-webserver#adding-a-baseurl
		baseURL: process.env.WP_BASE_URL,

		// We save as much information as possible to make debugging easier.
		// https://playwright.dev/docs/api/class-testoptions#test-options-screenshot
		// https://playwright.dev/docs/api/class-testoptions#test-options-trace
		// https://playwright.dev/docs/api/class-testoptions#test-options-video
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		// {
		// 	name: 'auth',
		// 	// testDir,
		// 	testMatch: 'setup/auth.js',
		// },
		{
			name: 'Stackable Free',
			use: {
				storageState: process.env.WP_AUTH_STORAGE,
				...devices[ 'Desktop Chrome' ],
			},
			testDir: './tests',
		},
		// {
		// 	name: 'chromium',
		// 	use: { ...devices[ 'Desktop Chrome' ] },
		// },

		// {
		//   name: 'firefox',
		//   use: { ...devices['Desktop Firefox'] },
		// },

		// {
		//   name: 'webkit',
		//   use: { ...devices['Desktop Safari'] },
		// },

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
} )
