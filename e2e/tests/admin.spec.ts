import { test, expect } from 'e2e/test-utils'

test( 'Activating Stackable should redirect to the Getting Started Page', async ( {
	page,
	admin,
} ) => {
	await admin.visitAdminPage( 'plugins.php' )

	const plugin = page.locator( `[data-plugin="${ process.env.STACKABLE_SLUG }.php"]` )
	// Deactivate Stackable
	const deactivate = plugin.getByLabel( 'Deactivate Stackable -' )
	await expect( deactivate ).toBeVisible()
	await deactivate.click()

	// Activate Stackable
	const activate = plugin.getByLabel( 'Activate Stackable -' )
	await expect( activate ).toBeVisible()
	await activate.click()

	try {
		await expect( page ).toHaveURL( /stackable/ )
		await expect( page.getByText( 'Welcome to Stackable' ) ).toBeVisible()
	} catch {
		await expect( page ).toHaveURL( /page=stackable/ )
		await expect( page.getByRole( 'link', { name: 'Activate Free Version' } ) ).toBeVisible()
		await page.getByRole( 'link', { name: 'Activate Free Version' } ).click()
		await page.getByRole( 'link', { name: 'Skip', exact: true } ).click()
		await expect( page ).toHaveURL( /stackable/ )
		await expect( page.getByText( 'Welcome to Stackable' ) ).toBeVisible()
	}
} )

test( 'Stackable settings should be saved', async ( {
	page,
	admin,
	stackable,
} ) => {
	// Start waiting for Stackable Settings JSON Response before visiting the page
	let settings = stackable.waitForSettings()

	await admin.visitAdminPage( 'admin.php?page=stackable-settings' )
	// Make sure all Stackable settings are loaded
	await settings

	// There should be no PHP errors
	const pageError = await admin.getPageError()
	expect( pageError ).toBeNull()

	// Retrieves the value of the first option, toggles it and check if the value changed
	const option = page.locator( '.ugb-admin-toggle-setting' ).first().getByRole( 'switch' )
	const val = await option.getAttribute( 'aria-checked' )

	await option.click()
	const newVal = await option.getAttribute( 'aria-checked' )

	expect( newVal ).not.toBe( val )
	let saveSettings = stackable.waitForSettingsSave()
	await page.getByRole( 'button', { name: 'Save Changes' } ).click()
	await saveSettings

	// Check if the value is correct after reloading
	settings = stackable.waitForSettings()
	await page.reload()
	await settings

	const _option = page.locator( '.ugb-admin-toggle-setting' ).first().getByRole( 'switch' )

	await expect( _option ).toHaveAttribute( 'aria-checked', newVal )

	// Revert back the settings to the original value
	await _option.click()
	saveSettings = stackable.waitForSettingsSave()
	await page.getByRole( 'button', { name: 'Save Changes' } ).click()
	await saveSettings
	await expect( _option ).toHaveAttribute( 'aria-checked', val )
} )

test( 'Settings inner tabs render', async ( {
	page,
	admin,
	stackable,
} ) => {
	const settings = stackable.waitForSettings()
	await admin.visitAdminPage( 'admin.php?page=stackable-settings' )
	await settings

	const pageError = await admin.getPageError()
	expect( pageError ).toBeNull()

	await page.getByRole( 'tab', { name: 'Editor Settings' } ).click()
	await expect( page.getByRole( 'heading', { name: 'Block Widths' } ) ).toBeVisible()

	await page.getByRole( 'tab', { name: 'Global Settings' } ).click()
	await expect( page.getByRole( 'heading', { name: 'Global Settings' } ) ).toBeVisible()
	await expect( page.getByText( 'Force Typography Styles' ) ).toBeVisible()

	await page.getByRole( 'tab', { name: /Miscellaneous/ } ).click()
	await expect( page.getByRole( 'heading', { name: 'Miscellaneous' } ) ).toBeVisible()

	await page.getByRole( 'tab', { name: 'Import/Export' } ).click()
	await expect( page.getByRole( 'heading', { name: 'Import' } ) ).toBeVisible()
} )
