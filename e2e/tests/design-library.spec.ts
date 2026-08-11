import { Page } from '@playwright/test'
import { test, expect } from 'e2e/test-utils'

const dismissTourIfPresent = async ( page: Page ) => {
	const tourClose = page.locator( '.ugb-tour-modal .components-modal__header button' ).first()
	if ( await tourClose.isVisible().catch( () => false ) ) {
		await tourClose.click()
	}
}

const openDesignLibrary = async ( page: Page ) => {
	await dismissTourIfPresent( page )

	const designLibraryButton = page.locator( '.ugb-insert-library-button' )
	await expect( designLibraryButton ).toBeVisible()
	await designLibraryButton.click()

	const modal = page.locator( '.ugb-modal-design-library' )
	await expect( modal ).toBeVisible()

	// The design-library tour may open after the modal.
	await dismissTourIfPresent( page )
}

const waitForDesignsToLoad = async ( page: Page ) => {
	const designsPanel = page.locator( '.ugb-modal-design-library__designs' )
	await expect( designsPanel ).toBeVisible()

	// Only wait for the panel's loading spinner. Each design card keeps its own
	// preview spinner in the DOM after loading and hides it with CSS.
	await expect( designsPanel.locator( ':scope > .components-spinner' ) ).toHaveCount( 0, { timeout: 60_000 } )
	await expect( page.locator( '.ugb-design-library-item' ).first() ).toBeVisible( { timeout: 60_000 } )
}

test.describe( 'Design Library', () => {
	let pid = null

	test.beforeEach( async ( { editor, admin } ) => {
		await admin.createNewPost( { title: 'Design Library Test' } )
		await editor.saveDraft()
		const postQuery = new URL( editor.page.url() ).search
		pid = new URLSearchParams( postQuery ).get( 'post' )
	} )

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deletePost( pid )
	} )

	test( 'opens and loads pattern designs without showing a blank library', async ( {
		page,
	} ) => {
		const libraryResponse = page.waitForResponse( response => {
			const url = decodeURIComponent( response.url() )
			return url.includes( '/stackable/v2/design_library/patterns' ) && response.ok()
		} )

		await openDesignLibrary( page )
		await libraryResponse
		await waitForDesignsToLoad( page )

		const modal = page.locator( '.ugb-modal-design-library' )
		await expect( modal.getByRole( 'heading', { name: 'Stackable Design Library' } ) ).toBeVisible()
		await expect( modal.locator( '.stk-design-library-tabs' ) ).toContainText( 'Patterns' )
		await expect( modal.locator( '.stk-design-library-tabs' ) ).toContainText( 'Pages' )

		const designItems = page.locator( '.ugb-design-library-item' )
		await expect( designItems.first() ).toBeVisible()
		expect( await designItems.count() ).toBeGreaterThan( 0 )

		// No fetch/parse error should be shown in the designs panel.
		await expect( page.locator( '.ugb-modal-design-library__designs' ).getByText( 'An error has occurred:' ) ).toHaveCount( 0 )
	} )

	test( 'opens while the page template is shown', async ( { page } ) => {
		await page.evaluate( () => {
			window.wp.data.dispatch( 'core/editor' ).setRenderingMode( 'template-locked' )
		} )

		await expect.poll( async () => {
			return page.evaluate( () => window.wp.data.select( 'core/editor' ).getRenderingMode() )
		} ).toBe( 'template-locked' )

		await openDesignLibrary( page )

		await expect( page.locator( '.ugb-modal-design-library' ) ).toBeVisible()
	} )

	test( 'lazy-renders design previews for visible items', async ( {
		page,
	} ) => {
		await openDesignLibrary( page )
		await waitForDesignsToLoad( page )

		const visibleItems = page.locator( '.ugb-design-library-item:not(.ugb--is-hidden)' )
		await expect( visibleItems.first() ).toBeVisible()

		// First batch of designs should mount preview hosts (IntersectionObserver + memoized list).
		const previewHosts = page.locator( '.ugb-design-library-item:not(.ugb--is-hidden) .stk-block-design__host' )
		await expect( previewHosts.first() ).toBeVisible( { timeout: 60_000 } )
		expect( await previewHosts.count() ).toBeGreaterThan( 0 )

		const designsPanel = page.locator( '.ugb-modal-design-library__designs' )
		const beforeScrollCount = await previewHosts.count()

		// Scroll further down the virtualized list so more previews can mount.
		await designsPanel.evaluate( el => {
			el.scrollTop = el.scrollHeight
		} )

		await expect.poll( async () => {
			return page.locator( '.ugb-design-library-item:not(.ugb--is-hidden) .stk-block-design__host' ).count()
		}, { timeout: 30_000 } ).toBeGreaterThanOrEqual( beforeScrollCount )
	} )

	test( 'filters patterns by category and plan', async ( {
		page,
	} ) => {
		await openDesignLibrary( page )
		await waitForDesignsToLoad( page )

		const sidebar = page.locator( '.ugb-modal-design-library__filters' )
		await expect( sidebar.locator( '.stk-design-library__sidebar-item' ).first() ).toBeVisible()

		// Click the first non-"All" category.
		const categoryItems = sidebar.locator( '.stk-design-library__sidebar-item' )
		const categoryCount = await categoryItems.count()
		expect( categoryCount ).toBeGreaterThan( 1 )

		await categoryItems.nth( 1 ).click()
		await expect( categoryItems.nth( 1 ) ).toHaveClass( /is-active/ )
		await waitForDesignsToLoad( page )

		const filteredCount = await page.locator( '.ugb-design-library-item' ).count()
		expect( filteredCount ).toBeGreaterThan( 0 )

		// Filter to free designs only.
		const planDropdown = page.locator( '.stk-design-library__header-settings' ).getByRole( 'button' ).filter( { hasText: /All|Free|Premium/ } )
		if ( await planDropdown.isVisible().catch( () => false ) ) {
			await planDropdown.click()
			await page.locator( '.stk-design-library__plan-dropdown' ).getByRole( 'button', { name: 'Free', exact: true } ).click()
			await waitForDesignsToLoad( page )
			await expect( page.locator( '.ugb-design-library-item.ugb--is-premium' ) ).toHaveCount( 0 )
		}
	} )

	test( 'switches to Pages tab and loads page designs', async ( {
		page,
	} ) => {
		const pagesResponse = page.waitForResponse( response => {
			const url = decodeURIComponent( response.url() )
			return url.includes( '/stackable/v2/design_library/pages' ) && response.ok()
		} )

		await openDesignLibrary( page )
		await waitForDesignsToLoad( page )

		await page.locator( '.stk-design-library-tabs' ).getByRole( 'button', { name: 'Pages' } ).click()
		await pagesResponse
		await waitForDesignsToLoad( page )

		await expect( page.locator( '.stk-design-library__item-pages' ) ).toBeVisible()
		await expect( page.locator( '.ugb-design-library-item' ).first() ).toBeVisible()

		// Pages use an immediate Insert action instead of multi-select footer.
		await expect( page.locator( '.ugb-modal-design-library__footer' ) ).toHaveCount( 0 )
		await expect( page.locator( '.ugb-design-library-item' ).first().getByRole( 'button', { name: 'Insert' } ) ).toBeVisible()
	} )

	test( 'refresh reloads the library', async ( {
		page,
	} ) => {
		await openDesignLibrary( page )
		await waitForDesignsToLoad( page )

		const refreshResponse = page.waitForResponse( response => {
			const url = decodeURIComponent( response.url() )
			return url.includes( '/stackable/v2/design_library/patterns/reset' ) && response.ok()
		} )

		await page.locator( '.ugb-modal-design-library__refresh' ).click()
		await refreshResponse
		await waitForDesignsToLoad( page )

		await expect( page.locator( '.ugb-design-library-item' ).first() ).toBeVisible()
	} )

	test( 'selects a free pattern and inserts it into the editor', async ( {
		page,
		editor,
	} ) => {
		await openDesignLibrary( page )
		await waitForDesignsToLoad( page )

		// Prefer free designs when the plan filter is available.
		const planDropdown = page.locator( '.stk-design-library__header-settings' ).getByRole( 'button' ).filter( { hasText: /All|Free|Premium/ } )
		if ( await planDropdown.isVisible().catch( () => false ) ) {
			await planDropdown.click()
			await page.locator( '.stk-design-library__plan-dropdown' ).getByRole( 'button', { name: 'Free', exact: true } ).click()
			await waitForDesignsToLoad( page )
		}

		const firstDesign = page.locator( '.ugb-design-library-item:not(.ugb--is-premium)' ).first()
		await expect( firstDesign ).toBeVisible()
		await firstDesign.click()
		await expect( firstDesign ).toHaveClass( /ugb--is-toggled/ )

		const addDesigns = page.locator( '.ugb-modal-design-library__footer .ugb-modal-design-library__add-multi' )
		await expect( addDesigns ).toBeEnabled()
		await addDesigns.click()

		await expect( page.locator( '.ugb-modal-design-library' ) ).toHaveCount( 0, { timeout: 60_000 } )

		// Inserted designs replace/remove the Design Library placeholder and add real blocks.
		await expect( editor.canvas.locator( '[data-type^="stackable/"]' ).first() ).toBeVisible( { timeout: 60_000 } )
	} )

	test( 'exposes style options for pattern customization', async ( {
		page,
	} ) => {
		await openDesignLibrary( page )
		await waitForDesignsToLoad( page )

		const styleOptions = page.locator( '.ugb-modal-design-library__style-options' )
		await expect( styleOptions.getByRole( 'heading', { name: 'Style Options' } ) ).toBeVisible()
		await expect( page.locator( '.ugb-modal-design-library__enable-background' ) ).toBeVisible()

		const backgroundToggle = page.locator( '.ugb-modal-design-library__enable-background input' )
		const wasChecked = await backgroundToggle.isChecked()
		await page.locator( '.ugb-modal-design-library__enable-background' ).click()
		await expect( backgroundToggle ).toHaveJSProperty( 'checked', ! wasChecked )
	} )
} )
