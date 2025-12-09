/**
 * This loads the page icons in the editor.
 */

/**
 * Internal dependencies
 */
import { PageIcons } from './page-icons'

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

const pageIconsWrapper = document?.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )

pageIconsWrapper?.setAttribute( 'id', 'stk-page-icons' )

domReady( () => {
	if ( pageIconsWrapper ) {
		pageIconsWrapper.setAttribute( 'id', 'stk-page-icons' )
		pageIconsWrapper.setAttribute( 'style', 'display: none;' )
		createRoot( pageIconsWrapper ).render( <PageIcons /> )
	}
} )

const PageIconsLoader = () => {
	const deviceType = useDeviceType()
	const editorDom = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	} )

	/**
	 * Render the page icons in the editor
	 */
	useEffect( () => {
		const editorBody = editorDom?.closest( 'body' )

		if ( editorBody && ! editorBody.contains( pageIconsWrapper ) ) {
			editorBody.prepend( pageIconsWrapper )
		}
	}, [ deviceType, editorDom ] )

	return null
}

registerPlugin( 'stackable-page-icons', {
	render: PageIconsLoader,
} )
