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
import { addFilter } from '@wordpress/hooks'

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
			editorBody.appendChild( globalTypographyWrapper )
			editorBody.appendChild( globalColorWrapper )
			editorBody.appendChild( globalSpacingAndBorderWrapper )
			editorBody.appendChild( globalButtonsAndIconsWrapper )
			editorBody.appendChild( globalColorSchemesWrapper )
			editorBody.appendChild( globalPresetControlsWrapper )
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

addFilter( 'stackable.global-styles.ids', 'stackable/global-settings', styleIds => {
	styleIds.push(
		'stk-global-typography-styles',
		'stk-global-color-styles',
		'stk-global-spacing-and-borders-styles',
		'stk-global-buttons-and-icons-styles',
		'stk-global-color-schemes-styles',
		'stk-global-preset-controls-styles'
	)

	return styleIds
} )

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
