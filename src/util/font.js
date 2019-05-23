export const getGoogleFontURL = fontName => {
	const weights = [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ]
	const styles = [ '', 'italic' ]
	const args = weights.map( weight => styles.map( style => `${ weight }${ style }` ) ).join( ',' )
	return `https://fonts.googleapis.com/css?family=${ fontName }:${ args }`
}

export const isWebFont = fontName => ! fontName.match( /^(sans[-+]serif|serif|monospace)$/i )

// Already done loading.
const loadedFonts = []

/**
 * Load the stylesheet of a Google Font.
 *
 * @param {string} fontName The name of the font
 */
export const loadGoogleFont = fontName => {
	if ( loadedFonts.includes( fontName ) ) {
		return
	}

	if ( document && isWebFont( fontName ) ) {
		const link = document.createElement( 'link' )
		link.setAttribute( 'href', getGoogleFontURL( fontName ) )
		link.setAttribute( 'rel', 'stylesheet' )
		link.setAttribute( 'type', 'text/css' )
		document.querySelector( 'head' ).appendChild( link )
	}

	loadedFonts.push( fontName )
}

export const getFontFamily = fontName => {
	// Google Font.
	if ( isWebFont( fontName ) ) {
		return `"${ fontName }", Sans-serif`
	}

	// System fonts.
	if ( fontName.match( /^serif$/i ) ) {
		return '"Palatino Linotype", Palatino, Palladio, "URW Palladio L", "Book Antiqua", Baskerville, "Bookman Old Style", "Bitstream Charter", "Nimbus Roman No9 L", Garamond, "Apple Garamond", "ITC Garamond Narrow", "New Century Schoolbook", "Century Schoolbook", "Century Schoolbook L", Georgia, serif'
	} else if ( fontName.match( /^monospace$/i ) ) {
		return 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
	}
	return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
}
