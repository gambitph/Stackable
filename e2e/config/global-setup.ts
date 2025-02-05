// Gutenberg global setup: https://github.com/WordPress/gutenberg/blob/b4304f8bf6bd9b890b4108adcc326cd586a3ab4e/test/e2e/config/global-setup.ts

import { request } from '@playwright/test'

import { ExtendedRequestUtils } from 'e2e/test-utils'

// To interact with the WP Guest Bar plugin's settings page, we must be authenticated.
// Before any tests are run, we sign in, save the cookies set by WordPress, and then discard the session.
// Later, when we need to act as a logged-in user, we make those cookies available.
// https://playwright.dev/docs/test-global-setup-teardown#configure-globalsetup-and-globalteardown
async function globalSetup() {
	const requestContext = await request.newContext( {
		baseURL: process.env.WP_BASE_URL,
	} )
	const requestUtils = new ExtendedRequestUtils( requestContext, {
		storageStatePath: process.env.WP_AUTH_STORAGE,
		user: {
			username: process.env.WP_USERNAME,
			password: process.env.WP_PASSWORD,
		},
	} )

	// Alternatively, we could take a more traditional route,
	// filling in the input fields for the username and password and submitting the form.
	// https://playwright.dev/docs/test-global-setup-teardown#example
	await requestUtils.setupRest()

	// Deactivate all plugins except Stackable
	const plugins = await requestUtils.getActivePlugins()

	// Use for loop because forEach cannot handle async operations
	for ( const slug of Object.keys( plugins ) ) {
		await requestUtils.deactivatePlugin( slug )
	}

	await requestUtils.activatePlugin( process.env.STACKABLE_SLUG )

	await requestContext.dispose()
}

export default globalSetup
