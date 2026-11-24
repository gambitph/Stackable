import { execFile } from 'child_process'
import {
	mkdtemp, readFile, rm, stat, writeFile,
} from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { promisify } from 'util'
import extract from 'extract-zip'

import { test, expect } from 'e2e/test-utils'

const execFileAsync = promisify( execFile )

test( 'development Site Kit export downloads and imports a portable archive', async ( {
	page,
	admin,
	requestUtils,
	stackable,
} ) => {
	const themes = await requestUtils.rest( { path: '/wp/v2/themes' } )
	const originalTheme = themes.find( theme => theme.status === 'active' )?.stylesheet
	let importedPageIds = []
	let importedMediaIds = []
	let sourcePageExists = true
	let sourceMediaExists = true
	const originalSettings = await requestUtils.rest( { path: '/wp/v2/settings?context=edit' } )
	const originalBlockStyles = originalSettings.stackable_global_block_styles || {}
	const media = await requestUtils.uploadMedia( path.resolve( 'e2e/config/fixtures/e2e-featured-image.png' ) )
	const exportedPage = await requestUtils.rest( {
		path: '/wp/v2/pages',
		method: 'POST',
		data: {
			title: 'Site Kit Export Page',
			slug: 'site-kit-export-page',
			status: 'publish',
			content: `<!-- wp:image {"id":${ media.id }} --><figure class="wp-block-image"><img src="${ media.source_url }" /></figure><!-- /wp:image -->`,
		},
	} )
	await requestUtils.rest( {
		path: '/wp/v2/settings',
		method: 'POST',
		data: {
			stackable_global_block_styles: { // eslint-disable-line camelcase
				'stackable/spacer': [ {
					name: 'Site Kit Spacer',
					slug: 'stk-block-spacer--style-site-kit-spacer',
					attributes: {
						height: 123,
					},
					nonCssAttributes: {},
				} ],
			},
		},
	} )
	const temporaryDirectory = await mkdtemp( path.join( tmpdir(), 'stackable-site-kit-' ) )

	try {
		const settings = stackable.waitForSettings()
		await admin.visitAdminPage( 'admin.php?page=stackable-settings' )
		await settings
		await page.getByRole( 'tab', { name: 'Import/Export' } ).click()

		await expect( page.getByRole( 'heading', { name: 'Site Kit Export' } ) ).toBeVisible()
		await page.getByLabel( 'Slug' ).fill( 'development-export' )
		await page.getByLabel( 'Title' ).fill( 'Development Export' )
		await page.getByLabel( 'Description' ).fill( 'Playwright Site Kit export.' )

		const validationResponse = page.waitForResponse( response =>
			response.url().includes( '/wp-json/stackable/v3/site-kits/export' ) &&
			response.request().method() === 'POST'
		)
		await page.getByRole( 'button', { name: 'Validate Site Kit' } ).click()
		expect( ( await validationResponse ).status() ).toBe( 200 )
		await expect( page.getByText( 'The Site Kit passed validation and is ready to download.', { exact: true } ) ).toBeVisible()

		const downloadPromise = page.waitForEvent( 'download' )
		await page.getByRole( 'link', { name: 'Download Site Kit' } ).click()
		const download = await downloadPromise
		expect( download.suggestedFilename() ).toBe( 'development-export.zip' )

		const archivePath = path.join( temporaryDirectory, download.suggestedFilename() )
		const packageDirectory = path.join( temporaryDirectory, 'development-export' )
		await download.saveAs( archivePath )
		await extract( archivePath, { dir: packageDirectory } )
		await execFileAsync( 'node', [ 'tools/site-kits/validate-package.js', packageDirectory ] )

		const packageData = JSON.parse( await readFile( path.join( packageDirectory, 'meta.json' ), 'utf8' ) )
		const pageData = packageData.pages.find( item => item.slug === 'site-kit-export-page' )
		expect( pageData ).toBeTruthy()
		expect( pageData.content ).toContain( 'assets/' )
		expect( pageData.content ).not.toContain( `"id":${ media.id }` )
		expect( pageData.content ).toContain( 'stkSiteKitMediaIds' )
		expect( JSON.stringify( packageData ) ).not.toContain( media.source_url )
		expect( collectObjectKeys( packageData ) ).not.toEqual( expect.arrayContaining( [
			'api_key',
			'access_token',
			'password',
			'private_key',
		] ) )
		const mediaData = packageData.media.find( item => pageData.content.includes( item.path ) )
		expect( mediaData ).toBeTruthy()
		expect( ( await stat( path.join( packageDirectory, mediaData.path ) ) ).isFile() ).toBe( true )

		await page.locator( 'input[type="file"][accept*=".zip"]' ).setInputFiles( archivePath )
		await expect( page.locator( '#import-export p' ).getByText( 'Activate the Start Stackable theme before importing a Site Kit.' ) ).toBeVisible()

		await requestUtils.activateTheme( 'start-stackable' )
		await requestUtils.deletePost( exportedPage.id, 'pages' )
		sourcePageExists = false
		await requestUtils.deleteMedia( media.id )
		sourceMediaExists = false
		await admin.visitAdminPage( 'admin.php?page=stackable-settings' )
		await page.getByRole( 'tab', { name: 'Import/Export' } ).click()
		const pageIdsBeforeImport = ( await requestUtils.rest( { path: '/wp/v2/pages?per_page=100' } ) ).map( item => item.id )
		const mediaIdsBeforeImport = ( await requestUtils.rest( { path: '/wp/v2/media?per_page=100' } ) ).map( item => item.id )

		const importResponse = page.waitForResponse( response =>
			new URL( response.url() ).pathname.endsWith( '/wp-json/stackable/v3/site-kits/import' ) &&
			response.request().method() === 'POST'
		)
		await page.locator( 'input[type="file"][accept*=".zip"]' ).setInputFiles( archivePath )
		expect( ( await importResponse ).status() ).toBe( 200 )
		await expect( page.locator( '#import-export p' ).getByText( /Site Kit imported: \d+ pages? and \d+ media items?\./ ) ).toBeVisible()
		importedPageIds = ( await requestUtils.rest( { path: '/wp/v2/pages?per_page=100' } ) )
			.map( item => item.id )
			.filter( id => ! pageIdsBeforeImport.includes( id ) )
		importedMediaIds = ( await requestUtils.rest( { path: '/wp/v2/media?per_page=100' } ) )
			.map( item => item.id )
			.filter( id => ! mediaIdsBeforeImport.includes( id ) )

		const pagesAfterImport = await requestUtils.rest( { path: '/wp/v2/pages?search=Site%20Kit%20Export%20Page&per_page=100' } )
		expect( pagesAfterImport ).toHaveLength( 1 )
		const [ importedPage ] = pagesAfterImport
		expect( importedPage.slug ).toBe( 'site-kit-export-page' )
		expect( importedMediaIds ).not.toHaveLength( 0 )
		const importedPageForEdit = await requestUtils.rest( { path: `/wp/v2/pages/${ importedPage.id }?context=edit` } )
		expect( importedPageForEdit.content.raw ).not.toContain( `"id":${ media.id }` )
		expect( importedMediaIds.some( id => importedPageForEdit.content.raw.includes( `"id":${ id }` ) ) ).toBe( true )
		const importedSettings = await requestUtils.rest( { path: '/wp/v2/settings?context=edit' } )
		const importedBlockStyle = importedSettings.stackable_global_block_styles[ 'stackable/spacer' ][ 0 ]
		expect( importedBlockStyle.saveCss ).toContain( '123px' )
		expect( importedBlockStyle.editCss ).toBe( '' )

		const invalidArchivePath = path.join( temporaryDirectory, 'invalid.zip' )
		await writeFile( invalidArchivePath, 'not a zip archive' )
		const pageCountBeforeInvalidImport = ( await requestUtils.rest( { path: '/wp/v2/pages?per_page=100' } ) ).length
		const invalidResponse = page.waitForResponse( response =>
			new URL( response.url() ).pathname.endsWith( '/wp-json/stackable/v3/site-kits/import/prepare' ) &&
			response.request().method() === 'POST'
		)
		await page.locator( 'input[type="file"][accept*=".zip"]' ).setInputFiles( invalidArchivePath )
		expect( ( await invalidResponse ).status() ).toBe( 422 )
		await expect( page.locator( '#import-export p' ).getByText( 'The uploaded file is not a valid ZIP archive.' ) ).toBeVisible()
		expect( ( await requestUtils.rest( { path: '/wp/v2/pages?per_page=100' } ) ).length ).toBe( pageCountBeforeInvalidImport )
	} finally {
		for ( const pageId of importedPageIds ) {
			await requestUtils.deletePost( pageId, 'pages' )
		}
		for ( const mediaId of importedMediaIds ) {
			await requestUtils.deleteMedia( mediaId )
		}
		if ( sourcePageExists ) {
			await requestUtils.deletePost( exportedPage.id, 'pages' )
		}
		if ( sourceMediaExists ) {
			await requestUtils.deleteMedia( media.id )
		}
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { stackable_global_block_styles: originalBlockStyles }, // eslint-disable-line camelcase
		} )
		if ( originalTheme ) {
			await requestUtils.activateTheme( originalTheme )
		}
		await rm( temporaryDirectory, { recursive: true, force: true } )
	}
} )

test( 'development Site Kit export rejects missing nonces and insufficient permissions', async ( {
	page,
	requestUtils,
} ) => {
	const nonceResponse = await page.request.post( '/wp-json/stackable/v3/site-kits/export', {
		data: {
			slug: 'nonce-check',
			title: 'Nonce Check',
			description: '',
			plan: 'free',
		},
	} )
	expect( [ 401, 403 ] ).toContain( nonceResponse.status() )
	const importNonceResponse = await page.request.post( '/wp-json/stackable/v3/site-kits/import', {
		multipart: {
			siteKit: {
				name: 'nonce-check.zip',
				mimeType: 'application/zip',
				buffer: Buffer.from( 'not a zip archive' ),
			},
		},
	} )
	expect( [ 401, 403 ] ).toContain( importNonceResponse.status() )

	const subscriberUser = await requestUtils.createUser( {
		username: 'site-kit-subscriber',
		email: 'site-kit-subscriber@example.test',
		password: 'password',
		roles: [ 'subscriber' ],
	} )
	try {
		const permissionResponse = await page.request.post( '/wp-json/stackable/v3/site-kits/export', {
			headers: { 'X-Stackable-E2E-User-ID': String( subscriberUser.id ) },
			data: {
				slug: 'permission-check',
				title: 'Permission Check',
				description: '',
				plan: 'free',
			},
		} )
		expect( permissionResponse.status() ).toBe( 403 )
		const importPermissionResponse = await page.request.post( '/wp-json/stackable/v3/site-kits/import', {
			headers: { 'X-Stackable-E2E-User-ID': String( subscriberUser.id ) },
			multipart: {
				siteKit: {
					name: 'permission-check.zip',
					mimeType: 'application/zip',
					buffer: Buffer.from( 'not a zip archive' ),
				},
			},
		} )
		expect( importPermissionResponse.status() ).toBe( 403 )
	} finally {
		await requestUtils.deleteAllUsers()
	}
} )

const collectObjectKeys = value => {
	if ( Array.isArray( value ) ) {
		return value.flatMap( collectObjectKeys )
	}
	if ( ! value || typeof value !== 'object' ) {
		return []
	}
	return Object.entries( value ).flatMap( ( [ key, item ] ) => [ key, ...collectObjectKeys( item ) ] )
}
