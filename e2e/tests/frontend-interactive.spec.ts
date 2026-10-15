import { test, expect } from 'e2e/test-utils'
import { publishAndVisitFrontend, getEditorPostId } from 'e2e/test-utils'

const pickDefaultLayoutIfPresent = async editor => {
	const picker = editor.canvas.locator( '.stk-variation-picker' )
	const firstVariation = picker.locator( '.block-editor-block-variation-picker__variation' ).first()

	try {
		await firstVariation.waitFor( { state: 'visible', timeout: 10_000 } )
	} catch {
		return
	}

	await firstVariation.click()
	await expect( picker ).toBeHidden()
}

const insertViewportSpacer = async editor => {
	await editor.insertBlock( {
		name: 'core/spacer',
		attributes: { height: '1100px' },
	} )
}

const waitForTocHeadings = async ( editor, expectedTexts ) => {
	const tocBlock = editor.canvas.locator( '[data-type="stackable/table-of-contents"]' ).first()
	await expect( tocBlock ).toBeVisible()

	for ( const text of expectedTexts ) {
		await expect( tocBlock.getByText( text ) ).toBeVisible()
	}

	const generateAnchors = tocBlock.getByRole( 'button', {
		name: 'Auto-generate missing anchor ids',
	} )
	if ( await generateAnchors.isVisible().catch( () => false ) ) {
		await generateAnchors.click()
	}

	// Deselect the TOC so heading detection can flush into block attributes.
	await editor.canvas.locator( '[data-type="core/heading"], [data-type="stackable/heading"]' ).last().click()

	await expect( async () => {
		const clientId = await tocBlock.getAttribute( 'data-block' )
		const attributes = await editor.getBlockAttributes( clientId )
		const contents = ( attributes.headings || [] ).map( heading => heading.content )
		for ( const text of expectedTexts ) {
			expect( contents ).toContain( text )
		}
		for ( const heading of attributes.headings ) {
			if ( expectedTexts.includes( heading.content ) ) {
				expect( heading.anchor ).toBeTruthy()
			}
		}
	} ).toPass( { timeout: 30_000 } )
}

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
		await pickDefaultLayoutIfPresent( editor )

		const accordionBlock = editor.canvas.locator( '[data-type="stackable/accordion"]' ).first()
		const heading = accordionBlock.locator( '[data-type="stackable/heading"] [role="textbox"]' ).first()
		const panelText = accordionBlock.locator( '[data-type="stackable/text"] [role="textbox"]' ).first()
		await expect( heading ).toBeVisible()
		await heading.fill( 'E2E Accordion Title' )

		// The panel is collapsed in the editor until the heading is clicked.
		await accordionBlock.locator( '.stk-block-accordion__heading' ).click()
		await panelText.fill( 'E2E accordion panel content', { force: true } )

		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const accordion = page.locator( 'details.stk-block-accordion' ).first()
		await expect( accordion ).toBeVisible()
		await expect( accordion.getByText( 'E2E Accordion Title' ) ).toBeVisible()
		await expect( accordion.getByText( 'E2E accordion panel content' ) ).toBeHidden()

		await accordion.locator( 'summary' ).first().click()
		await expect( accordion ).toHaveAttribute( 'open', '' )
		await expect( accordion.getByText( 'E2E accordion panel content' ) ).toBeVisible()
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
		await editor.insertBlock( {
			name: 'stackable/carousel',
			innerBlocks: [ 1, 2, 3 ].map( n => ( {
				name: 'stackable/column',
				innerBlocks: [
					{
						name: 'stackable/heading',
						attributes: { text: `E2E Carousel Slide ${ n }` },
					},
					{
						name: 'stackable/text',
						attributes: {
							text: 'Carousel slide body copy so the slider has height and the next control stays clickable.',
						},
					},
				],
			} ) ),
		} )

		await expect(
			editor.canvas.getByText( 'E2E Carousel Slide 1' )
		).toBeVisible()
		await expect( editor.canvas.getByText( 'E2E Carousel Slide 2' ) ).toBeVisible()
		await expect( editor.canvas.getByText( 'E2E Carousel Slide 3' ) ).toBeVisible()

		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const carousel = page.locator( '.stk-block-carousel' ).first()
		await expect( carousel ).toBeVisible()
		await expect( carousel.getByText( 'E2E Carousel Slide 1' ) ).toBeVisible()

		const next = carousel.locator( '.stk-block-carousel__button__next' ).first()
		await expect( next ).toBeVisible()
		const firstSlide = carousel.locator( '.stk-block-carousel__slider > .stk-block-column' ).first()
		await expect( firstSlide ).toHaveAttribute( 'aria-hidden', 'false' )
		await next.click()
		await expect( firstSlide ).toHaveAttribute( 'aria-hidden', 'true' )
		await expect( carousel.getByText( 'E2E Carousel Slide 2' ) ).toBeVisible()
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
		await pickDefaultLayoutIfPresent( editor )
		await expect(
			editor.canvas.locator( '[data-type="stackable/notification"]' ).first()
		).toBeVisible()
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

	test( 'Countdown renders on the frontend', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/countdown' } )
		await expect(
			editor.canvas.locator( '[data-type="stackable/countdown"]' ).first()
		).toBeVisible()
		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block-countdown' ).first() ).toBeVisible()
	} )

	test( 'Count Up animates when it enters the viewport', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await insertViewportSpacer( editor )
		await editor.insertBlock( { name: 'stackable/count-up' } )

		const countUpTextbox = editor.canvas.locator(
			'[data-type="stackable/count-up"] [role="textbox"]'
		).first()
		await expect( countUpTextbox ).toBeVisible()
		await countUpTextbox.fill( '100 days' )

		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const countUp = page.locator( '.stk-block-count-up' ).first()
		const countUpText = countUp.locator( '.stk-block-count-up__text' ).first()
		await expect( countUp ).toBeAttached()
		await expect( countUpText ).not.toHaveClass( /stk--count-up-active/ )

		await countUp.scrollIntoViewIfNeeded()
		await expect( countUpText ).toHaveClass( /stk--count-up-active/, { timeout: 10_000 } )
		await expect( countUpText ).toHaveText( '100 days', { timeout: 5_000 } )
	} )

	test( 'Progress Bar shows the configured value', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/progress-bar',
			attributes: {
				progressValue: '75',
				text: 'E2E Progress',
			},
		} )
		await expect(
			editor.canvas.locator( '[data-type="stackable/progress-bar"]' ).first()
		).toBeVisible()
		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const progress = page.locator( '.stk-block-progress-bar' ).first()
		await expect( progress ).toBeVisible()
		await expect( progress.getByRole( 'progressbar' ) ).toHaveAttribute( 'aria-valuenow', '75' )
		await expect( progress.locator( '.stk-progress-bar__progress-value-text' ) ).toHaveText( '75' )
		await expect( progress.locator( '.stk-progress-bar__text' ) ).toHaveText( 'E2E Progress' )
	} )

	test( 'Posts block renders a list or empty state', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		await editor.insertBlock( { name: 'stackable/posts' } )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block-posts' ).first() ).toBeVisible()
	} )

	test( 'Table of Contents lists headings and jumps to them', async ( {
		page, editor, requestUtils, admin,
	} ) => {
		const headings = [
			{ text: 'E2E TOC Alpha', anchor: 'e2e-toc-alpha' },
			{ text: 'E2E TOC Beta', anchor: 'e2e-toc-beta' },
			{ text: 'E2E TOC Gamma', anchor: 'e2e-toc-gamma' },
		]

		for ( const [ index, heading ] of headings.entries() ) {
			if ( index > 0 ) {
				await insertViewportSpacer( editor )
			}
			await editor.insertBlock( {
				name: 'core/heading',
				attributes: {
					content: heading.text,
					level: 2,
					anchor: heading.anchor,
				},
			} )
		}

		for ( const heading of headings ) {
			await expect( editor.canvas.getByText( heading.text, { exact: true } ) ).toBeVisible()
		}

		// Persist heading anchors. Stackable headings (and some WP versions)
		// write `anchor` as a non-undo change, which can drop the id on save.
		await editor.page.evaluate( anchors => {
			const { getBlocks } = window.wp.data.select( 'core/block-editor' )
			const { updateBlockAttributes } = window.wp.data.dispatch( 'core/block-editor' )
			const walk = blocks => {
				blocks.forEach( block => {
					const text = block.attributes.text || block.attributes.content || ''
					const match = anchors.find( heading => heading.text === text )
					if ( match && ( block.name === 'core/heading' || block.name === 'stackable/heading' ) ) {
						updateBlockAttributes( block.clientId, { anchor: match.anchor } )
					}
					if ( block.innerBlocks?.length ) {
						walk( block.innerBlocks )
					}
				} )
			}
			walk( getBlocks() )
		}, headings )

		await expect( async () => {
			const saved = await editor.page.evaluate( () => {
				const flatten = blocks => blocks.flatMap( block => [
					block,
					...flatten( block.innerBlocks || [] ),
				] )
				return flatten( window.wp.data.select( 'core/block-editor' ).getBlocks() )
					.filter( block => block.name === 'core/heading' || block.name === 'stackable/heading' )
					.map( block => ( {
						text: block.attributes.text || block.attributes.content,
						anchor: block.attributes.anchor,
					} ) )
			} )
			for ( const heading of headings ) {
				const found = saved.find( block => String( block.text ) === heading.text )
				expect( found?.anchor ).toBe( heading.anchor )
			}
		} ).toPass( { timeout: 10_000 } )

		// Insert at the top so the frontend TOC can jump down the page.
		await editor.page.evaluate( () => {
			const block = window.wp.blocks.createBlock( 'stackable/table-of-contents' )
			window.wp.data.dispatch( 'core/block-editor' ).insertBlock( block, 0 )
		} )
		await waitForTocHeadings( editor, headings.map( heading => heading.text ) )

		await publishAndVisitFrontend( page, editor, requestUtils, admin )

		const toc = page.locator( '.stk-block-table-of-contents' ).first()
		await expect( toc ).toBeVisible()
		for ( const heading of headings ) {
			await expect( toc.getByRole( 'link', { name: heading.text } ) ).toBeVisible()
			await expect( page.locator( `#${ heading.anchor }` ) ).toBeAttached()
		}

		await toc.getByRole( 'link', { name: 'E2E TOC Gamma' } ).click()
		await expect( page ).toHaveURL( /#e2e-toc-gamma/ )
		await expect( page.getByRole( 'heading', { name: 'E2E TOC Gamma' } ) ).toBeInViewport()
	} )
} )
