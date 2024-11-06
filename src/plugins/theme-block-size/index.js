/**
 * This plugin is in charge of adding the default/normal and wide sizes of
 * blocks as defined in the current theme.json and adding them as custom CSS
 * properties for our blocks to pick up in the editor.
 */
import { useDeviceType } from '~stackable/hooks'
import { createRoot } from '~stackable/util'
import { useSettings as _useSettings, useSetting as deprecatedUseSetting } from '@wordpress/block-editor'
import domReady from '@wordpress/dom-ready'
import { useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

// This is a custom hook for the deprecated useSetting since WP 6.3 & 6.4 doesn't have useSettings yet.
const useSettings = _useSettings || ( () => {
	const contentSize = deprecatedUseSetting( 'layout.contentSize' )
	const wideSize = deprecatedUseSetting( 'layout.wideSize' )
	return [ contentSize, wideSize ]
} )

export const ThemeBlockSize = () => {
	const [ contentSize, wideSize ] = useSettings( 'layout.contentSize', 'layout.wideSize' )

	const deviceType = useDeviceType()
	const editorDom = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	} )

	useEffect( () => {
		const editorBody = editorDom?.closest( 'body' )
		if ( editorBody ) {
			editorBody.appendChild( themeBlockSizeWrapper )
		}
	}, [ deviceType, editorDom ] )

	if ( ! contentSize && ! wideSize ) {
		return null
	}

	return (
		<>
			{ contentSize && `:root { --stk-block-width-default-detected: ${ contentSize }}` }
			{ wideSize && `:root { --stk-block-width-wide-detected: ${ wideSize }}` }
		</>
	)
}

const themeBlockSizeWrapper = document?.createElement( 'style' )
if ( themeBlockSizeWrapper ) {
	themeBlockSizeWrapper.setAttribute( 'id', 'stk-theme-block-size' )
}

domReady( () => {
	document?.body?.appendChild( themeBlockSizeWrapper )
	createRoot( themeBlockSizeWrapper ).render( <ThemeBlockSize /> )
} )
