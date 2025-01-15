import { test as base, expect } from '@playwright/test'

// We only require what's essential from the WordPress E2E test utils package.
import {
	Admin,
	Editor,
	PageUtils,
	RequestUtils,
} from '@wordpress/e2e-test-utils-playwright'

// We could also import utils from other packages.
// import { StoreApiUtils } from '@woocommerce/e2e-utils';

// We are extending the functionalities of Playwright by adding and bootstrapping the custom utils.
// https://playwright.dev/docs/test-fixtures#creating-a-fixture
//
// We have a minimal setup compared to more involved ones.
// https://github.com/WordPress/gutenberg/blob/trunk/packages/e2e-test-utils-playwright/src/test.ts
// https://github.com/woocommerce/woocommerce-blocks/blob/trunk/tests/e2e/playwright-utils/test.ts
const test = base.extend<{
    admin: Admin;
    editor: Editor;
    pageUtils: PageUtils;
    requestUtils: RequestUtils;
}>( {
	async admin( {
		page, pageUtils, editor,
	}, use ) {
		await use( new Admin( {
			page, pageUtils, editor,
		} ) )
	},
	async editor( { page }, use ) {
		await use( new Editor( { page } ) )
	},
	async pageUtils( { page }, use ) {
		await use( new PageUtils( { page } ) )
	},
	async requestUtils( {}, use ) {
		// We want to make all REST API calls as authenticated users.
		const requestUtils = await RequestUtils.setup( {
			baseURL: process.env.WP_BASE_URL,
			user: {
				username: process.env.WP_USERNAME,
				password: process.env.WP_PASSWORD,
			},
		} )

		await use( requestUtils )
	},
} )

export { test, expect }
