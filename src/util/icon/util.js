import { range } from 'lodash'

/**
 * Returns an estimate to the number of shapes we can color.
 * The number is based on the number of nth-children shapes.
 * e.g. <g><path /><path /></g> is 2,
 * but <g><path /></g><g><path /></g> is 1
 *
 * @param {string} svgString An SVG in string form.
 */
export const numShapesInSvg = svgString => {
	if ( typeof svgString !== 'string' ) {
		return 0
	}

	return range( 10 ).reduce( ( numPaths, i ) => {
		const num = i + 1
		if ( ( new RegExp( `(<(circle|ellipse|line|polygon|polyline|rect|shape|path)[^>]*(\/>|>[\s\S]*?<\/\\w+>)[ \t\r\n\v\f]*){${ num }}`, 'gm' ) ).test( svgString ) ) {
			return num
		}
		return numPaths
	}, 0 )
}

/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
export const createElementFromHTMLString = htmlString => {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
}
