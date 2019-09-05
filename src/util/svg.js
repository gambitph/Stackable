/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'

/**
 * Renders an SVG WP Component into a string.
 * renderToString lowercases some attributes, this fixes those.
 *
 * @param {Component} svgComponent
 * @param {boolean} esc Escape `#` in the returned string.
 *
 * @return {string} The SVG as a string.
 *
 */
export const svgRenderToString = ( svgComponent, esc = true ) => {
	const s = renderToString( svgComponent )
		.replace( /viewbox/, 'viewBox' )
		.replace( /preserveaspectratio/, 'preserveAspectRatio' )

	if ( esc ) {
		return s.replace( /#/g, '%23' ) // Using unescaped '#' characters in a data URI body is deprecated and will be removed in M71, around December 2018. Please use '%23' instead. See https://www.chromestatus.com/features/5656049583390720 for more details.
	}
	return s
}
