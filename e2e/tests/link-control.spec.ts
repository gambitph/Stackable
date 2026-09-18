import {
	test,
	expect,
	waitForBlockEditor,
} from 'e2e/test-utils'

test.describe( 'Link control URL input', () => {
	const createdPostIds: Array<string | number> = []

	test.afterEach( async ( { requestUtils } ) => {
		for ( const id of createdPostIds.splice( 0 ) ) {
			await requestUtils.deletePost( id ).catch( () => undefined )
		}
	} )

	test( 'accepts URLs, shortcodes, and other non-URL values', async ( {
		page,
		admin,
		editor,
		stackable,
	} ) => {
		await admin.createNewPost( { title: 'Link Control URL Input' } )
		await editor.saveDraft()
		const postQuery = new URL( editor.page.url() ).search
		const postId = new URLSearchParams( postQuery ).get( 'post' )
		if ( postId ) {
			createdPostIds.push( postId )
		}

		await stackable.dismissToursAndNotices()
		await waitForBlockEditor( editor )

		await editor.insertBlock( { name: 'stackable/button-group' } )
		await stackable.pickDefaultLayout( editor )
		await stackable.selectBlockByName( editor, 'stackable/button' )

		await stackable.openInspectorTab( 'Style' )

		const inspector = page.getByRole( 'region', { name: 'Editor settings' } )
		const linkPanel = inspector.locator( '.ugb-toggle-panel-body.ugb-panel--link' )
		await expect( linkPanel ).toBeVisible()
		if ( ! ( await linkPanel.getAttribute( 'class' ) || '' ).includes( 'is-opened' ) ) {
			await linkPanel.locator( '.components-panel__body-toggle' ).click()
		}
		await expect( linkPanel ).toHaveClass( /is-opened/ )

		const linkControl = linkPanel.locator( '.stk-link-control' ).filter( {
			has: page.locator( '.stk-control-label', { hasText: /Link \/ URL/ } ),
		} )
		const input = linkControl.getByRole( 'combobox', { name: 'URL' } )
		await expect( input ).toBeVisible()

		const buttonBlock = editor.canvas.locator( '[data-type="stackable/button"]' ).first()
		const clientId = await buttonBlock.getAttribute( 'data-block' )

		const setLinkValue = async ( value: string ) => {
			await input.click()
			await input.fill( value )
			await page.keyboard.press( 'Escape' )
			await input.blur()
		}

		await setLinkValue( 'https://example.com' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( 'https://example.com' )
		await expect( linkControl ).not.toContainText( 'Please enter a valid URL.' )

		await setLinkValue( 'example.com' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( 'https://example.com' )

		await setLinkValue( '[my_shortcode]' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( '[my_shortcode]' )
		await expect( linkControl ).not.toContainText( 'Please enter a valid URL.' )

		await setLinkValue( '!#stk_dynamic/current-page/url!#' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( '!#stk_dynamic/current-page/url!#' )
		await expect( linkControl ).not.toContainText( 'Please enter a valid URL.' )

		await setLinkValue( '{{permalink}}' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( '{{permalink}}' )
		await expect( linkControl ).not.toContainText( 'Please enter a valid URL.' )

		await setLinkValue( 'https://' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( 'https://' )
		await expect( linkControl ).toContainText( 'Please enter a valid URL.' )
	} )
} )
