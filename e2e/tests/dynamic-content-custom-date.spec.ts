import {
	test,
	expect,
	openInspectorPanel,
	publishAndVisitFrontend,
	waitForBlockEditor,
} from 'e2e/test-utils'

// Issue #3748 / PR #3754: applying a custom date format writes `&` into
// `data-stk-dynamic`. Typography must keep that generated span, or the
// editor and frontend show escaped HTML instead of the formatted date.
//
// Premium suite only (see playwright.premium.config.js). Dynamic Fields
// apply lives in premium; the escape bug is in free typography.
test.describe( 'Dynamic Content custom date format', () => {
	const createdPostIds: Array<string | number> = []

	test.afterEach( async ( { requestUtils } ) => {
		for ( const id of createdPostIds.splice( 0 ) ) {
			await requestUtils.deletePost( id ).catch( () => undefined )
		}
	} )

	test( 'custom formatted post date renders as a date, not escaped HTML', async ( {
		page,
		admin,
		editor,
		requestUtils,
		stackable,
	} ) => {
		const post = await requestUtils.createPost( {
			title: 'DC Custom Date Format',
			status: 'draft',
			date: '2026-03-15T12:00:00',
			date_gmt: '2026-03-15T12:00:00',
		} )
		createdPostIds.push( post.id )

		await admin.editPost( String( post.id ) )
		await stackable.dismissToursAndNotices()
		await waitForBlockEditor( editor )

		await editor.insertBlock( { name: 'stackable/text' } )
		await stackable.pickDefaultLayout( editor )
		await stackable.selectBlockByName( editor, 'stackable/text' )

		await stackable.openInspectorTab( 'Style' )
		await openInspectorPanel( page, 'Typography' )

		const inspector = page.getByRole( 'region', { name: 'Editor settings' } )
		const contentControl = inspector.locator( '.stk-control' ).filter( {
			has: page.locator( '.stk-control-label', { hasText: /^Content$/ } ),
		} )
		await contentControl.locator( '.stk-dynamic-content-control__button' ).click()

		const popover = page.locator( '.stackable-dynamic-content__popover' )
		await expect( popover ).toBeVisible()
		await expect( popover.getByRole( 'button', { name: 'Apply' } ) ).toBeVisible()

		const fieldControl = popover.locator( '.ugb-advanced-autosuggest-control' )
			.filter( { hasText: /^Field$/ } )
		await fieldControl.locator( 'input' ).click()
		await page.locator( '.ugb-autosuggest-option[data-value="post-date"]' ).click()

		await expect( popover.getByLabel( 'Date Format' ) ).toBeVisible()
		await popover.getByLabel( 'Date Format' ).selectOption( 'custom' )
		await popover.getByLabel( 'Custom Format' ).fill( 'F' )
		await expect( popover.getByRole( 'button', { name: 'Apply' } ) ).toBeEnabled()
		await popover.getByRole( 'button', { name: 'Apply' } ).click()
		await expect( popover ).toBeHidden()

		const canvasBlock = editor.canvas.locator( '[data-type="stackable/text"]' ).first()
		await expect( canvasBlock ).toHaveText( 'March' )
		await expect( canvasBlock ).not.toContainText( 'data-stk-dynamic' )
		await expect( canvasBlock ).not.toContainText( '<span' )

		const clientId = await canvasBlock.getAttribute( 'data-block' )
		let uniqueId = ''
		await expect( async () => {
			const attributes = await editor.getBlockAttributes( clientId )
			uniqueId = attributes.uniqueId
			expect( attributes.text ).toContain( '<span data-stk-dynamic' )
			expect( attributes.text ).toContain( 'custom_format=F' )
			expect( attributes.text ).not.toContain( '&lt;span' )
		} ).toPass( { intervals: [ 1_000, 2_000, 5_000 ] } )
		expect( uniqueId ).toBeTruthy()

		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const block = page.locator( `[data-block-id="${ uniqueId }"]` )
		await expect( block ).toBeVisible()
		await expect( block ).toHaveText( 'March' )
		await expect( block ).not.toContainText( 'data-stk-dynamic' )
		await expect( block ).not.toContainText( '<span' )
		await expect( block.locator( '.stk-dynamic-content' ) ).toHaveCount( 0 )
	} )
} )
