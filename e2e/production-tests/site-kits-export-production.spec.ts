import { test, expect } from 'e2e/test-utils'

test( 'Site Kit export and import are unavailable outside development', async ( {
	page,
	admin,
	stackable,
} ) => {
	const settings = stackable.waitForSettings()
	await admin.visitAdminPage( 'admin.php?page=stackable-settings' )
	await settings
	await page.getByRole( 'tab', { name: 'Import/Export' } ).click()

	await expect( page.getByRole( 'heading', { name: 'Site Kit Export' } ) ).toHaveCount( 0 )
	await expect( page.getByRole( 'heading', { name: 'Site Kit Import' } ) ).toHaveCount( 0 )

	const response = await page.request.post( '/wp-json/stackable/v3/site-kits/export', {
		data: {
			slug: 'production-check',
			title: 'Production Check',
			description: '',
			plan: 'free',
		},
	} )
	expect( response.status() ).toBe( 404 )

	const importResponse = await page.request.post( '/wp-json/stackable/v3/site-kits/import', {
		multipart: {
			siteKit: {
				name: 'production-check.zip',
				mimeType: 'application/zip',
				buffer: Buffer.from( 'not a zip archive' ),
			},
		},
	} )
	expect( importResponse.status() ).toBe( 404 )
} )
