/**
 * This loads the global styles in the editor.
 */

/**
 * Internal dependencies
 */
import { GlobalColorSchemeStyles } from './color-schemes'
import { GlobalColorStyles } from './colors'
import { GlobalTypographyStyles } from './typography'
import { GlobalSpacingAndBordersStyles } from './spacing-and-borders'
import { GlobalButtonsAndIconsStyles } from './buttons-and-icons'
import { GlobalPresetControlsStyles } from './preset-controls'
import './block-defaults'

/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'
import { createRoot } from '~stackable/util'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

const GlobalSettingsLoader = () => {
	const deviceType = useDeviceType()
	const editorDom = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	} )

	/**
	 * Render the global colors and typography in Gutenberg
	 *
	 * WordPress 5.8 introduces block templates.
	 * When editing blocks inside a template window, the editor is mounted inside
	 * an `iframe` DOMElement. For the styles to work, we need to mount the styles inside
	 * the iframe document.
	 *
	 * @since 2.17.2
	 */
	useEffect( () => {
		const editorBody = editorDom?.closest( 'body' )
		if ( editorBody ) {
			// No need to check for firstChild, since there will always be at least one
			// e.g. the post title wrapper and the actual root container.
			const firstChild = editorBody.firstChild
			editorBody.insertBefore( globalTypographyWrapper, firstChild )
			editorBody.insertBefore( globalColorWrapper, firstChild )
			editorBody.insertBefore( globalSpacingAndBorderWrapper, firstChild )
			editorBody.insertBefore( globalButtonsAndIconsWrapper, firstChild )
			editorBody.insertBefore( globalColorSchemesWrapper, firstChild )
			editorBody.insertBefore( globalPresetControlsWrapper, firstChild )
		}
	}, [ deviceType, editorDom ] )

	return null
}

registerPlugin( 'stackable-global-settings-loader', {
	render: GlobalSettingsLoader,
} )

const globalTypographyWrapper = document?.createElement( 'style' )
const globalColorWrapper = document?.createElement( 'style' )
const globalSpacingAndBorderWrapper = document?.createElement( 'style' )
const globalButtonsAndIconsWrapper = document?.createElement( 'style' )
const globalColorSchemesWrapper = document?.createElement( 'style' )
const globalPresetControlsWrapper = document?.createElement( 'style' )
globalTypographyWrapper?.setAttribute( 'id', 'stk-global-typography-styles' )
globalColorWrapper?.setAttribute( 'id', 'stk-global-color-styles' )
globalSpacingAndBorderWrapper?.setAttribute( 'id', 'stk-global-spacing-and-borders-styles' )
globalButtonsAndIconsWrapper?.setAttribute( 'id', 'stk-global-buttons-and-icons-styles' )
globalColorSchemesWrapper?.setAttribute( 'id', 'stk-global-color-schemes-styles' )
globalPresetControlsWrapper?.setAttribute( 'id', 'stk-global-preset-controls-styles' )
domReady( () => {
	document?.body?.appendChild( globalTypographyWrapper )
	document?.body?.appendChild( globalColorWrapper )
	document?.body?.appendChild( globalSpacingAndBorderWrapper )
	document?.body?.appendChild( globalButtonsAndIconsWrapper )
	document?.body?.appendChild( globalColorSchemesWrapper )
	document?.body?.appendChild( globalPresetControlsWrapper )
	createRoot( globalTypographyWrapper ).render( <GlobalTypographyStyles /> )
	createRoot( globalColorWrapper ).render( <GlobalColorStyles /> )
	createRoot( globalSpacingAndBorderWrapper ).render( <GlobalSpacingAndBordersStyles /> )
	createRoot( globalButtonsAndIconsWrapper ).render( <GlobalButtonsAndIconsStyles /> )
	createRoot( globalColorSchemesWrapper ).render( <GlobalColorSchemeStyles /> )
	createRoot( globalPresetControlsWrapper ).render( <GlobalPresetControlsStyles /> )
} )
