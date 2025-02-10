// We only require what's essential from the WordPress E2E test utils package.
import {
	test as base,
	expect,
} from '@wordpress/e2e-test-utils-playwright'

import { ExtendedRequestUtils } from './requestUtils'
import { StackableFixture } from './stackable'
import { ExtendedEditor } from './editor'

// We could also import utils from other packages.
// import { StoreApiUtils } from '@woocommerce/e2e-utils';

// We are extending the functionalities of Playwright by adding and bootstrapping the custom utils.
// https://playwright.dev/docs/test-fixtures#creating-a-fixture
//
// We have a minimal setup compared to more involved ones.
// https://github.com/WordPress/gutenberg/blob/trunk/packages/e2e-test-utils-playwright/src/test.ts
// https://github.com/woocommerce/woocommerce-blocks/blob/trunk/tests/e2e/playwright-utils/test.ts
const test = base.extend<{
    requestUtils: ExtendedRequestUtils;
	stackable: StackableFixture;
	editor: ExtendedEditor;
}>( {
	requestUtils: async ( {}, use ) => {
		let requestUtils = null

		// We want to make all REST API calls as authenticated users.
		requestUtils = await ExtendedRequestUtils.setup( {
			baseURL: process.env.WP_BASE_URL,
			user: {
				username: process.env.WP_USERNAME,
				password: process.env.WP_PASSWORD,
			},
		} )

		await use( requestUtils )
	},

	stackable: async ( { page }, use ) => {
		await use( new StackableFixture( page ) )
	},

	editor: async ( { page }, use ) => {
		await use( new ExtendedEditor( { page } ) )
	},
} )

export { test, expect }
