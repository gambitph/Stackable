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
		if ( editorEl && editorEl.classList.contains( `stk-preview-device-${ deviceType.toLowerCase() }` ) === false ) {
			editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
			editorEl.classList.add( `stk-preview-device-${ deviceType.toLowerCase() }` )

			// At first load of the editor, the `stk-preview-device-*` is removed, so we have to re-add it.
			const mo = onClassChange( editorEl, () => {
				if ( editorEl?.classList.contains( `stk-preview-device-${ deviceType.toLowerCase() }` ) === false ) {
					editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
					editorEl.classList.add( `stk-preview-device-${ deviceType.toLowerCase() }` )
				}
			} )

			return () => mo.disconnect()
		}
	}, [ editorEl, deviceType ] )

	return null
}

registerPlugin( 'stackable-editor-device-preview-class', {
	render: EditorPreviewClass,
} )

// Listener when a class is changed on an element.
const onClassChange = ( node, callback ) => {
	let lastClassString = node.classList.toString()

	const mutationObserver = new MutationObserver( mutationList => {
		for ( const item of mutationList ) {
			if ( item.attributeName === 'class' ) {
				const classString = node.classList.toString()
				if ( classString !== lastClassString ) {
					callback( mutationObserver )
					lastClassString = classString
					break
				}
			}
	  }
	} )

	mutationObserver.observe( node, { attributes: true } )

	return mutationObserver
}
