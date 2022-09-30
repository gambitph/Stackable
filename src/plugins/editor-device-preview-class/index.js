/**
 * Adds the stk-preview-device-desktop/tablet/mobile classes to the
 * .editor-styles-wrapper or iframe wrapper. This class is used to simulate
 * breakpoints.
 */

/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'

const EditorPreviewClass = () => {
	const deviceType = useDeviceType()
	const editorEl = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	}, [] )

	// Update the editor class when the preview size changes.
	useEffect( () => {
		if ( editorEl && ! editorEl.classList.contains( `stk-preview-device-${ deviceType.toLowerCase() }` ) ) {
			editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
			editorEl.classList.add( `stk-preview-device-${ deviceType.toLowerCase() }` )
		}
	}, [ editorEl, deviceType ] )

	return null
}

registerPlugin( 'stackable-editor-device-preview-class', {
	render: EditorPreviewClass,
} )
