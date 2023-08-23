/**
 * WordPress dependencies
 */
// eslint-disable-next-line stackable/no-import-create-root
import { createRoot as _createRoot } from '@wordpress/element'

/**
 * A backward compatible createRoot function (for WP 6.1 and below), this mimics
 * the createRoot function. Use this instead of wp.element.createRoot
 *
 * @see https://react.dev/reference/react-dom/client/createRoot
 *
 * @param {DOMElement} el
 * @return {Object} Object with a render and unmount function
 */
export const createRoot = el => {
	// If WP 6.2 and above, use the createRoot function.
	if ( _createRoot ) {
		return _createRoot( el )
	}

	// If WP 6.1 and below, mimic how it works.
	return {
		render: reactNode => {
			return wp.element.render( reactNode, el )
		},
		unmount: () => {
			return wp.element.unmountComponentAtNode( el )
		},
	}
}
