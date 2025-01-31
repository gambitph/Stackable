import { test, expect } from '@wordpress/e2e-test-utils-playwright'

test( 'Activating Stackable should redirect to the Getting Started Page', async ( {
	page,
	admin,
} ) => {
	await admin.visitAdminPage( 'plugins.php' )

	// Deactivate Stackable
	const deactivate = page.getByLabel( 'Deactivate Stackable -' )
	await expect( deactivate ).toBeVisible()
	await deactivate.click()

	// Activate Stackable
	const activate = page.getByLabel( 'Activate Stackable -' )
	await expect( activate ).toBeVisible()
	await activate.click()

	await expect( page ).toHaveURL( /stackable-getting-started/ )
} )

test( 'Stackable settings should be saved', async ( {
	page,
	admin,
	baseURL,
} ) => {
	// Start waiting for Stackable Settings JSON Response before visiting the page
	let settings = page.waitForResponse( response =>
		response.url() === `${ baseURL }wp-json/wp/v2/settings/` && response.request().method() === 'POST'
	)
	await admin.visitAdminPage( 'options-general.php?page=stackable' )
	// Make sure all Stackable settings are loaded
	let response = await settings
	await response.finished()

	// Retrieves the value of the first option, toggles it and check if the value changed
	const option = page.locator( '.ugb-admin-toggle-setting__button' ).first()
	const oldVal = await option.evaluate( node => node.getAttribute( 'aria-checked' ) )

	await option.click()
	const newVal = await option.evaluate( node => node.getAttribute( 'aria-checked' ) )

	expect( newVal ).not.toBe( oldVal )

	// Check if the value is correct after reloading
	settings = page.waitForResponse( response =>
		response.url() === `${ baseURL }wp-json/wp/v2/settings/` && response.request().method() === 'POST'
	)
	await page.reload()
	response = await settings
	await response.finished()

	const _option = page.locator( '.ugb-admin-toggle-setting__button' ).first()
	expect( await _option.evaluate( node => node.getAttribute( 'aria-checked' ) ) ).toBe( newVal )
} )
