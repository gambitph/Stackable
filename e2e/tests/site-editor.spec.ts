import { test, expect } from 'e2e/test-utils'

const TEMPLATE_SLUG = 'stk-e2e-fse-constructable-styles'
const TEMPLATE_TITLE = 'STK E2E FSE Styles'
const EDITOR_CRASH = 'The editor has encountered an unexpected error.'
const STYLESHEET_ERROR = /adoptedStyleSheets|Sharing constructed stylesheets in multiple documents/i

const TEMPLATE_TEXT_BLOCK = `<!-- wp:stackable/text {"uniqueId":"e2efsecss","hasBackground":true,"blockBackgroundColor":"#1a73e8","textColor1":"#ffffff","text":"FSE template styles","generatedCss":".stk-e2efsecss {background-color:#1a73e8 !important;}.stk-e2efsecss .stk-block-text__text{color:#ffffff !important;}"} -->
<div class="wp-block-stackable-text stk-block-text stk-block stk-e2efsecss stk-block-background" data-block-id="e2efsecss"><style>.stk-e2efsecss {background-color:#1a73e8 !important;}.stk-e2efsecss .stk-block-text__text{color:#ffffff !important;}</style><p class="stk-block-text__text has-text-color">FSE template styles</p></div>
<!-- /wp:stackable/text -->`

const activateBlockTheme = async requestUtils => {
	const themes = await requestUtils.rest( { path: '/wp/v2/themes' } )
	const active = themes.find( theme => theme.status === 'active' )
	if ( active?.is_block_theme ) {
		return
	}

	for ( const slug of [ 'twentytwentyfive', 'twentytwentyfour' ] ) {
		try {
			await requestUtils.activateTheme( slug )
			return
		} catch {
			// Try the next bundled block theme.
		}
	}

	throw new Error( 'Site Editor e2e needs a block theme (Twenty Twenty-Five or Twenty Twenty-Four).' )
}

const templateTitle = template =>
	typeof template.title === 'string' ? template.title : template.title?.rendered || template.title?.raw || ''

const deleteE2eTemplate = async requestUtils => {
	try {
		const templates = await requestUtils.rest( { path: '/wp/v2/templates' } )
		for ( const template of templates ) {
			if ( ! template.wp_id ) {
				continue
			}
			if ( template.slug !== TEMPLATE_SLUG && templateTitle( template ) !== TEMPLATE_TITLE ) {
				continue
			}
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/templates/${ template.id }`,
				params: { force: true },
			} )
		}
	} catch {
		// Playground may already be gone during teardown.
	}
}

const templatesSidebar = page =>
	page.locator( '.edit-site-layout__sidebar, .edit-site-sidebar-dataviews, .edit-site-sidebar-navigation-screen' )

const sidebarItem = ( page, name ) =>
	templatesSidebar( page ).getByRole( 'button', { name, exact: true } )
		.or( templatesSidebar( page ).getByRole( 'link', { name, exact: true } ) )
		.or( templatesSidebar( page ).getByText( name, { exact: true } ) )
		.or( page.getByRole( 'button', { name, exact: true } ) )
		.or( page.getByRole( 'link', { name, exact: true } ) )

test.describe( 'Site Editor', () => {
	test.afterEach( async ( { requestUtils } ) => {
		await deleteE2eTemplate( requestUtils )
	} )

	test( 'switching to user templates after editing one does not crash the Site Editor', async ( {
		page,
		admin,
		editor,
		requestUtils,
		stackable,
	} ) => {
		test.setTimeout( 120_000 )

		let stylesheetError = ''
		page.on( 'pageerror', error => {
			if ( STYLESHEET_ERROR.test( error.message ) ) {
				stylesheetError = error.message
			}
		} )
		page.on( 'console', message => {
			if ( message.type() === 'error' && STYLESHEET_ERROR.test( message.text() ) ) {
				stylesheetError = message.text()
			}
		} )

		await activateBlockTheme( requestUtils )
		await deleteE2eTemplate( requestUtils )

		const author = process.env.WP_USERNAME || 'admin'
		const template = await requestUtils.createTemplate( 'wp_template', {
			slug: TEMPLATE_SLUG,
			title: TEMPLATE_TITLE,
			content: TEMPLATE_TEXT_BLOCK,
		} )
		expect( template.wp_id ).toBeTruthy()

		await admin.visitAdminPage( 'site-editor.php', '' )
		await stackable.dismissToursAndNotices()
		await editor.setPreferences( 'core/edit-site', {
			welcomeGuide: false,
			welcomeGuideStyles: false,
			welcomeGuidePage: false,
			welcomeGuideTemplate: false,
		} )

		const templatesNav = page.getByRole( 'button', { name: 'Templates', exact: true } )
			.or( page.getByRole( 'link', { name: 'Templates', exact: true } ) )
		await expect( templatesNav.first() ).toBeVisible( { timeout: 60_000 } )
		await templatesNav.first().click()
		await expect( page.getByRole( 'button', { name: 'Add Template' } ) ).toBeVisible( { timeout: 30_000 } )
		await expect( page.getByText( TEMPLATE_TITLE, { exact: true } ).first() ).toBeVisible( { timeout: 30_000 } )

		await sidebarItem( page, author ).first().click()
		await expect( page.getByText( `Author is: ${ author }` ) ).toBeVisible( { timeout: 30_000 } )

		await page.getByText( TEMPLATE_TITLE, { exact: true } ).first().click()
		await expect( editor.canvas.getByText( 'FSE template styles' ) ).toBeVisible( { timeout: 30_000 } )

		const welcome = page.getByRole( 'button', { name: 'Get started' } )
		if ( await welcome.isVisible().catch( () => false ) ) {
			await welcome.click()
		}
		await page.locator( '.components-modal__screen-overlay' ).waitFor( { state: 'hidden', timeout: 5_000 } ).catch( () => {} )

		const editorBack = page.locator( '.editor-header__back-button button, .editor-header__back-button a, .editor-header__back-button [role="button"]' )
			.or( page.getByRole( 'button', { name: 'Back', exact: true } ) )
		await expect( editorBack.first() ).toBeVisible()
		await editorBack.first().click()

		await expect( page.getByRole( 'button', { name: 'Add Template' } ) ).toBeVisible( { timeout: 30_000 } )

		await sidebarItem( page, 'All templates' ).first().click()
		await sidebarItem( page, author ).first().click()

		const crash = page.getByText( EDITOR_CRASH )
		const deadline = Date.now() + 8_000
		while ( Date.now() < deadline && ! stylesheetError ) {
			if ( await crash.isVisible().catch( () => false ) ) {
				stylesheetError = EDITOR_CRASH
				break
			}
			await page.waitForTimeout( 200 )
		}

		expect(
			stylesheetError,
			stylesheetError || 'Site Editor crashed after switching to user templates'
		).toBe( '' )
	} )
} )
