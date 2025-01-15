import { test as setup, expect } from '@wordpress/e2e-test-utils-playwright'
// import '../support/env.js'

const authFile = 'src/playwright/.auth/state.json'

setup( 'authenticate', async ( { page } ) => {
	// Setup the handler.
	// await page.addLocatorHandler( page.getByText( 'Administration email verification' ), async () => {
	// 	await page.getByRole( 'button', { name: 'The email is correct' } ).click()
	// } )

	await page.goto( '/wp-login.php' )
	await page.getByLabel( 'Username or Email Address' ).fill( process.env.WP_USERNAME )
	await page.getByLabel( 'Password', { exact: true } ).fill( process.env.WP_PASSWORD )
	await page.getByRole( 'button', { name: 'Log In' } ).click()

	// Handle if the page suddenly asks for email verification.
	if ( await page.locator( 'Administration email verification' ).count() ) {
		await page.getByRole( 'button', { name: 'The email is correct' } ).click()
	}

	await page.waitForURL( '**/wp-admin/' )
	await page.context().storageState( { path: authFile } )
} )
