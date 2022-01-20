/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'

/**
 * Gets the editor wrapper DOM element. This should be the way if you need to do
 * a querySelector and to get the raw DOM element of a block. This handles
 * iframe Tablet and Mobile previews introduced in WP 5.9.
 *
 * Take note that this can produce a `null` value if the editor is still
 * transitioning from Desktop to Tablet or Mobile previews.
 *
 * @return {DomElement} This can be null when the editor is transitioning from
 * one device size to another.
 */
export const useEditorDom = () => {
	return useSelect( 'stackable/editor-dom' ).getEditorDom()
}
