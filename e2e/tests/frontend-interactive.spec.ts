import { test, expect } from 'e2e/test-utils'
import { publishAndVisitFrontend, getEditorPostId } from 'e2e/test-utils'

test.describe( 'Interactive frontend', () => {
	let pid = null

	test.beforeEach( async ( { editor, admin } ) => {
		await admin.createNewPost( { title: 'Interactive Frontend' } )
		await editor.saveDraft()
		pid = getEditorPostId( editor.page )
	} )

	test.afterEach( async ( { requestUtils } ) => {
		if ( ! pid ) {
			return
		}
		try {
			await requestUtils.deletePost( pid )
		} catch {
			// Best-effort cleanup.
		}
	} )

	test( 'Accordion opens on click', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/accordion' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const accordion = page.locator( 'details.stk-block-accordion' ).first()
		await expect( accordion ).toBeVisible()
		await accordion.locator( 'summary' ).first().click()
		await expect( accordion ).toHaveAttribute( 'open', '' )
	} )

	test( 'Tabs switch panels', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/tabs' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const tabs = page.locator( '.stk-block-tabs' ).first()
		await expect( tabs ).toBeVisible()
		const tabButtons = tabs.locator( '[role="tab"]' )
		await expect( tabButtons ).toHaveCount( 3 )
		await tabButtons.nth( 1 ).click()
		await expect( tabButtons.nth( 1 ) ).toHaveAttribute( 'aria-selected', 'true' )
	} )

	test( 'Carousel next control changes the slide', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/carousel' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const carousel = page.locator( '.stk-block-carousel' ).first()
		await expect( carousel ).toBeVisible()
		const next = carousel.locator( '.stk-block-carousel__button__next' ).first()
		await expect( next ).toBeVisible()
		const firstSlide = carousel.locator( '.stk-block-carousel__slider > .stk-block-column' ).first()
		await expect( firstSlide ).toHaveAttribute( 'aria-hidden', 'false' )
		await next.click()
		await expect( firstSlide ).toHaveAttribute( 'aria-hidden', 'true' )
	} )

	test( 'Expand reveals more content', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/expand' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const expand = page.locator( '.stk-block-expand' ).first()
		await expect( expand ).toBeVisible()
		await expand.locator( '.stk-block-expand__show-button .stk-button' ).click()
		await expect( expand.locator( '.stk-block-expand__more-text' ) ).toHaveAttribute( 'aria-hidden', 'false' )
	} )

	test( 'Video Popup opens a dialog', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/video-popup',
			attributes: {
				videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			},
		} )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const popup = page.locator( '.stk-block-video-popup' ).first()
		await expect( popup ).toBeVisible()
		await popup.locator( 'div[role="button"], button' ).first().click()
		await expect( page.locator( '.bp-container, .glightbox-container, .stk-video-popup, iframe' ).first() ).toBeVisible( { timeout: 10_000 } )
	} )

	test( 'Notification can be dismissed', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/notification' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const notification = page.locator( '.stk-block-notification' ).first()
		await expect( notification ).toBeVisible()
		await notification.locator( '.stk-block-notification__close-button' ).click()
		await expect( notification ).toBeHidden()
	} )

	test( 'Horizontal scroller is in the DOM', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/horizontal-scroller' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block-horizontal-scroller' ).first() ).toBeVisible()
	} )

	test( 'Countdown, Count Up, and Progress widgets render', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/countdown' } )
		await editor.insertBlock( { name: 'stackable/count-up' } )
		await editor.insertBlock( { name: 'stackable/progress-bar' } )
		await editor.insertBlock( { name: 'stackable/progress-circle' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		await expect( page.locator( '.stk-block-countdown' ).first() ).toBeVisible()
		await expect( page.locator( '.stk-block-count-up' ).first() ).toBeVisible()
		await expect( page.locator( '.stk-block-progress-bar' ).first() ).toBeVisible()
		await expect( page.locator( '.stk-block-progress-circle' ).first() ).toBeVisible()
	} )

	test( 'Map container renders without a PHP fatal', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/map' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block-map' ).first() ).toBeVisible()
	} )

	test( 'Posts block renders a list or empty state', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/posts' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block-posts' ).first() ).toBeVisible()
	} )

	test( 'Table of Contents lists a heading', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/heading',
			attributes: { text: 'E2E TOC Heading' },
		} )
		await editor.insertBlock( { name: 'stackable/table-of-contents' } )
		await expect(
			editor.canvas.locator( '.stk-block-table-of-contents' ).getByText( 'E2E TOC Heading' )
		).toBeVisible( { timeout: 15_000 } )

		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const toc = page.locator( '.stk-block-table-of-contents' ).first()
		await expect( toc ).toBeVisible()
		await expect( toc.getByRole( 'link', { name: 'E2E TOC Heading' } ) ).toBeVisible()
	} )
} )
