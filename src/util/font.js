/**
 * External dependencies
 */
import { locale } from 'stackable'

// Fonts already done loading.
const loadedFonts = []

// @from https://github.com/elementor/elementor/blob/45eaa6704fe1ad18f6190c8e95952b38b8a38dc7/assets/dev/js/editor/utils/helpers.js#L23
const subsets = { /* eslint-disable quote-props */
	'ru_RU': 'cyrillic',
	'bg_BG': 'cyrillic',
	'he_IL': 'hebrew',
	'el': 'greek',
	'vi': 'vietnamese',
	'uk': 'cyrillic',
	'cs_CZ': 'latin-ext',
	'ro_RO': 'latin-ext',
	'pl_PL': 'latin-ext',
}

export const getGoogleFontURL = fontName => {
	const family = fontName.replace( / /g, '+' )
	const subset = subsets[ locale ] ? `&subset=${ subsets }` : ''
	return `https://fonts.googleapis.com/css?family=${ family }:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic${ subset }`
}

export const isWebFont = fontName => ! fontName.match( /^(sans[-+]serif|serif|monospace|serif-alt)$/i )

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
	} else if ( fontName.match( /^serif-alt$/i ) ) {
		return 'Constantia, Lucida Bright, Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif'
	} else if ( fontName.match( /^monospace$/i ) ) {
		return 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
	}
	return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
}

/**
 * Finds all the "font family" attributes and loads the font if needed.
 *
 * @param {Object} attributes Block attributes
 */
export const loadGoogleFontInAttributes = attributes => {
	Object.keys( attributes )
		.filter( attrName => attrName.match( /fontfamily/i ) )
		.forEach( attrName => {
			const fontName = attributes[ attrName ]
			if ( fontName ) {
				loadGoogleFont( fontName )
			}
		} )
}
