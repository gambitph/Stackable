/**
 * This loads the global styles in the editor.
 */

/**
 * Internal dependencies
 */
import { GlobalColorStyles } from './colors'
import { GlobalTypographyStyles } from './typography'
import './block-defaults'

/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'
import { createRoot } from '~stackable/util'
import { settings } from 'stackable'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { setDefaultBlockName } from '@wordpress/blocks'

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
		}
	}, [ deviceType, editorDom ] )

	return null
}

registerPlugin( 'stackable-global-settings-loader', {
	render: GlobalSettingsLoader,
} )

const globalTypographyWrapper = document?.createElement( 'style' )
const globalColorWrapper = document?.createElement( 'style' )
globalTypographyWrapper?.setAttribute( 'id', 'stk-global-typography-styles' )
globalColorWrapper?.setAttribute( 'id', 'stk-global-color-styles' )

domReady( () => {
	document?.body?.appendChild( globalTypographyWrapper )
	document?.body?.appendChild( globalColorWrapper )
	createRoot( globalTypographyWrapper ).render( <GlobalTypographyStyles /> )
	createRoot( globalColorWrapper ).render( <GlobalColorStyles /> )

	// Set the default block to stackable/text
	if ( settings.stackable_text_default_block ) {
		setTimeout( () => {
			setDefaultBlockName( 'stackable/text' )
		} )
	}
} )
