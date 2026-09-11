import { test, expect } from 'e2e/test-utils'

const TABLET_VIEWPORT = '1000px'
const MOBILE_VIEWPORT = '690px'

const getUserGlobalStylesId = async requestUtils => {
	const themes = await requestUtils.rest( { path: '/wp/v2/themes?status=active' } )
	const href = themes?.[ 0 ]?._links?.[ 'wp:user-global-styles' ]?.[ 0 ]?.href
	if ( ! href ) {
		return null
	}
	return String( href ).split( '/' ).pop()
}

const setUserViewportSettings = async ( requestUtils, viewport ) => {
	const id = await getUserGlobalStylesId( requestUtils )
	if ( ! id ) {
		return null
	}

	const current = await requestUtils.rest( { path: `/wp/v2/global-styles/${ id }` } )
	await requestUtils.rest( {
		method: 'POST',
		path: `/wp/v2/global-styles/${ id }`,
		data: {
			settings: {
				...( current.settings || {} ),
				viewport,
			},
		},
	} )
	return id
}

const setEditorDeviceType = async ( page, deviceType ) => {
	await page.evaluate( device => {
		const dispatch = window.wp.data.dispatch
		if ( dispatch( 'core/editor' )?.setDeviceType ) {
			dispatch( 'core/editor' ).setDeviceType( device )
			return
		}
		if ( dispatch( 'core/edit-post' )?.__experimentalSetPreviewDeviceType ) {
			dispatch( 'core/edit-post' ).__experimentalSetPreviewDeviceType( device )
		}
	}, deviceType )
}

test.describe( 'Editor theme viewports', () => {
	let pid = null
	let stylesId = null
	let previousSettings = null

	test.beforeEach( async ( { editor, admin, requestUtils } ) => {
		const wpVersion = process.env.WP_VERSION || 'latest'
		test.skip( wpVersion !== 'latest' && wpVersion < '7.1', 'settings.viewport requires WordPress 7.1.' )

		const id = await getUserGlobalStylesId( requestUtils )
		test.skip( ! id, 'User global styles REST is unavailable.' )

		stylesId = id
		previousSettings = ( await requestUtils.rest( {
			path: `/wp/v2/global-styles/${ id }`,
		} ) ).settings || {}

		const saved = await setUserViewportSettings( requestUtils, {
			tablet: TABLET_VIEWPORT,
			mobile: MOBILE_VIEWPORT,
		} )
		test.skip( ! saved, 'Could not write settings.viewport via Global Styles REST.' )

		const after = await requestUtils.rest( { path: `/wp/v2/global-styles/${ id }` } )
		test.skip(
			after?.settings?.viewport?.tablet !== TABLET_VIEWPORT ||
			after?.settings?.viewport?.mobile !== MOBILE_VIEWPORT,
			'Global Styles REST did not persist custom viewport settings.'
		)

		await admin.createNewPost( { title: 'Editor theme viewports' } )
		await editor.saveDraft()
		pid = new URLSearchParams( new URL( editor.page.url() ).search ).get( 'post' )
	} )

	test.afterEach( async ( { requestUtils } ) => {
		if ( stylesId ) {
			await requestUtils.rest( {
				method: 'POST',
				path: `/wp/v2/global-styles/${ stylesId }`,
				data: { settings: previousSettings || {} },
			} ).catch( () => undefined )
		}
		if ( pid ) {
			await requestUtils.deletePost( pid )
		}
	} )

	test( 'tablet preview uses theme viewport settings for Stackable styles', async ( {
		page,
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/text',
			attributes: {
				text: 'theme viewport preview',
				fontSize: '16',
				fontSizeTablet: '48',
			},
		} )

		const text = editor.canvas.locator( '[data-type="stackable/text"] p' ).first()
		await expect( text ).toBeVisible()

		await setEditorDeviceType( page, 'Tablet' )

		await expect.poll( async () => {
			return page.evaluate( () => {
				return window.wp.data.select( 'core/editor' )?.getDeviceType?.() ||
					window.wp.data.select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType?.() ||
					''
			} )
		} ).toBe( 'Tablet' )

		const preview = await page.evaluate( () => {
			const editorSettings = window.wp.data.select( 'core/editor' )?.getEditorSettings?.() || {}
			const blockSettings = window.wp.data.select( 'core/block-editor' )?.getSettings?.() || {}
			const canvas = document.querySelector( 'iframe[name="editor-canvas"], iframe.edit-post-visual-editor__content-area' )
			const canvasWidth = canvas ? Math.round( canvas.getBoundingClientRect().width ) : null
			const features = blockSettings.__experimentalFeatures || editorSettings.__experimentalFeatures || {}
			return {
				stackableViewports: window.stackable?.settings?.stackable_editor_viewport_breakpoints || null,
				featuresViewport: features.viewport || null,
				canvasWidth,
			}
		} )

		expect(
			preview.featuresViewport?.tablet === TABLET_VIEWPORT ||
			preview.stackableViewports?.tablet === TABLET_VIEWPORT,
			`Editor did not see custom viewports: ${ JSON.stringify( preview ) }`
		).toBeTruthy()

		// Custom tablet is 1000px. The editor chrome can clamp the canvas below
		// that, but it must stay wider than Stackable's old 781px query.
		expect(
			preview.canvasWidth,
			`Tablet canvas should be wider than 781px so the pre-fix query misses. Got ${ JSON.stringify( preview ) }`
		).toBeGreaterThan( 781 )

		await expect( text ).toHaveCSS( 'font-size', '48px' )
	} )
} )
