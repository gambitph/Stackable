/**
 * Polyfills used.
 */

// Nodelist forEach polyfill.
if ( window.NodeList && ! window.NodeList.prototype.forEach ) {
	window.NodeList.prototype.forEach = Array.prototype.forEach
}
