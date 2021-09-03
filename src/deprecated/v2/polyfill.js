/**
 * Polyfills used.
 */
import 'whatwg-fetch'

// Nodelist forEach polyfill.
if ( window.NodeList && ! window.NodeList.prototype.forEach ) {
	window.NodeList.prototype.forEach = Array.prototype.forEach
}

// Overwrites native 'firstElementChild' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
/* eslint-disable */
( function( constructor ) {
	try {
		if ( constructor &&
			constructor.prototype &&
			constructor.prototype.firstElementChild == null ) {
			Object.defineProperty( constructor.prototype, 'firstElementChild', {
				get() {
					let node,
						nodes = this.childNodes,
						i = 0
					while ( node = nodes[ i++ ] ) {
						if ( node.nodeType === 1 ) {
							return node
						}
					}
					return null
				},
			} )
		}
	} catch ( err ) {
		// Do nothing.
	}
}( window.Node || window.Element ) )
/* eslint-enable */
