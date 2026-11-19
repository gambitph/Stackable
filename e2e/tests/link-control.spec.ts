import {
	test,
	expect,
	assertNoBlockRecovery,
	waitForBlockEditor,
} from 'e2e/test-utils'

test.describe( 'Link control URL input', () => {
	const createdPostIds: Array<string | number> = []

	test.afterEach( async ( { requestUtils } ) => {
		for ( const id of createdPostIds.splice( 0 ) ) {
			await requestUtils.deletePost( id ).catch( () => undefined )
		}
	} )

	test( 'accepts safe link values and rejects executable protocols', async ( {
		page,
		admin,
		editor,
		requestUtils,
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
		await editor.saveDraft()
		const safeContent = await editor.getEditedPostContent()
		expect( safeContent ).toContain( 'href="https://example.com"' )

		await setLinkValue( 'http://192.168.0.10' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( 'http://192.168.0.10' )

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

		await setLinkValue( 'javascript:void(0)' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( 'javascript:void(0)' )
		await expect( linkControl ).not.toContainText( 'Please enter a valid URL.' )

		await setLinkValue( 'javascript:;' )
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( 'javascript:;' )
		await expect( linkControl ).not.toContainText( 'Please enter a valid URL.' )

		await input.click()
		await input.fill( 'javascript:alert(document.domain)' )
		await expect( linkControl ).toContainText( 'Please enter a valid URL.' )
		await input.blur()
		await expect.poll( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			return attributes.linkUrl
		} ).toBe( '' )

		const legacyContent = safeContent.replace(
			'href="https://example.com"',
			'href="javascript:void(0)"'
		)
		const legacyPost = await requestUtils.createPost( {
			title: 'Legacy Button Link',
			status: 'publish',
			content: legacyContent,
		} )
		createdPostIds.push( legacyPost.id )

		await admin.editPost( String( legacyPost.id ) )
		await stackable.dismissToursAndNotices()
		await waitForBlockEditor( editor )
		await assertNoBlockRecovery( editor )
	} )
} )
