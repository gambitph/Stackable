import './store'
import { useSelect } from '@wordpress/data'
import { safeHTML } from '@wordpress/dom'

/**
 * Parse SVG string to extract attributes and innerHTML without DOM manipulation
 *
 * @param {string} svgString The SVG string to parse
 * @return {Object|null} Object with attributes and innerHTML, or null if invalid
 */
const parseSVGString = svgString => {
	if ( ! svgString || typeof svgString !== 'string' ) {
		return null
	}

	// Check if it's an SVG tag
	const svgTagMatch = svgString.match( /<svg\s*[^>]*>/i )
	if ( ! svgTagMatch ) {
		return null
	}

	const svgTagStart = svgTagMatch.index
	const svgTagEnd = svgTagStart + svgTagMatch[ 0 ].length
	const svgTag = svgTagMatch[ 0 ]

	// Extract innerHTML (everything between opening and closing tags)
	const closingTagIndex = svgString.lastIndexOf( '</svg>' )
	if ( closingTagIndex === -1 ) {
		return null
	}

	//SVG sanitization
	let rawInnerSVG = svgString.substring( svgTagEnd, closingTagIndex )

	// Remove <foreignObject>, <script>, <style>, <iframe>, and <filter> blocks
	rawInnerSVG = rawInnerSVG.replace( /<(foreignObject|script|style|iframe|filter)[^>]*>[\s\S]*?<\/\1\s*>/gi, '' )

	// Remove standalone <foreignObject>, <script>, <style>, <iframe>, <filter/> self-closing tags
	rawInnerSVG = rawInnerSVG.replace( /<(foreignObject|script|style|iframe|filter)\b[^>]*\/?>/gi, '' )

	// Remove all attributes that are namespaced (e.g. xlink:href, xml:space)
	rawInnerSVG = rawInnerSVG.replace( /\s[\w-]+:[\w-]+="[^"]*"/g, '' )
	rawInnerSVG = rawInnerSVG.replace( /\s[\w-]+:[\w-]+='[^']*'/g, '' )
	rawInnerSVG = rawInnerSVG.replace( /\s[\w-]+:[\w-]+=[^\s"'=<>`]+/g, '' )

	// Remove href/data-href/src attributes containing data: uris
	rawInnerSVG = rawInnerSVG.replace(
		/\s(?:href|data-href|src)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
		match => {
			const protocols = /(data|javascript|vbscript|file)\s*:/i
			const urlEncoded = /(data|javascript|vbscript|file)%3a/i
			const hasEntity = /&#x?[0-9a-f]+;/i.test( match )

			if ( protocols.test( match ) || urlEncoded.test( match ) || hasEntity ) {
				return ''
			}
			return match
		}
	)

	const innerHTML = safeHTML( rawInnerSVG )

	// Extract attributes from the SVG tag
	const svgAttributes = {}
	const attributesPart = svgTag.replace( /^<svg\s*/i, '' ).replace( />$/, '' )
	if ( attributesPart ) {
		// Match attribute name followed by = and value (with quotes or without)
		const attrRegex = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
		let attrMatch
		while ( ( attrMatch = attrRegex.exec( attributesPart ) ) !== null ) {
			const key = attrMatch[ 1 ]
			const attrNameLower = key.toLowerCase()
			// Skip width and height as symbols don't need them
			if ( attrNameLower !== 'width' && attrNameLower !== 'height' ) {
				// Value can be in double quotes, single quotes, or unquoted
				const value = attrMatch[ 2 ] || attrMatch[ 3 ] || attrMatch[ 4 ] || ''
				svgAttributes[ key ] = value
			}
		}
	}

	return { attributes: svgAttributes, innerHTML }
}

export const PageIcons = () => {
	const pageIcons = useSelect( select => select( 'stackable/page-icons' ).getPageIcons(), [] ) || new Map()
	return (
		<defs>
			{ Array.from( pageIcons ).map( ( [ icon, iconData ] ) => {
				const iconId = iconData.id
				if ( ! iconId ) {
					return null
				}

				const parsed = parseSVGString( icon )
				if ( ! parsed ) {
					return null
				}

				const { attributes: svgAttributes, innerHTML } = parsed

				return (
					<symbol key={ iconId } id={ `stk-page-icons__${ iconId }` } { ...svgAttributes } dangerouslySetInnerHTML={ { __html: innerHTML } } />
				)
			} ) }
		</defs>
	)
}
