/**
 * External dependencies
 */
import { locale } from 'stackable'

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

export const isWebFont = fontName => fontName && ! fontName?.match( /^(sans[-+]serif|serif|monospace|serif-alt)$/i )

/**
 * Returns the current block editor head
 * element.
 *
 * @return {HTMLDocument} the head document
 */
const getDocumentHead = () => {
	const hasEditingContent = !! document.querySelector( 'iframe[name="editor-canvas"]' )

	if ( hasEditingContent ) {
		return document.querySelector( 'iframe[name="editor-canvas"]' ).contentWindow.document.querySelector( 'head' )
	}

	return document.querySelector( 'head' )
}

/**
 * Load the stylesheet of a Google Font.
 *
 * @param {string} fontName The name of the font
 */
export const loadGoogleFont = fontName => {
	const _loadGoogleFont = head => {
		if ( head && isWebFont( fontName ) ) {
			if ( isGoogleFontEnqueued( fontName, head ) ) {
				return
			}

			const link = createLinkTagWithGoogleFont( fontName )
			head.appendChild( link )
		}
	}

	let index = 0

	// There are cases when the content area has delayed loading (the content 
	// area is in an iframe in FSE), so keep trying to load the font a few times.
	const interval = setInterval( () => {
		index++
		if ( index === 8 ) {
			clearInterval( interval )
		}
		const headElement = getDocumentHead()
		_loadGoogleFont( headElement )
		if ( headElement !== document.querySelector( 'head' ) ) {
			_loadGoogleFont( document.querySelector( 'head' ) )
		}
	}, 250 )
}

export const createLinkTagWithGoogleFont = ( fontName = '' ) => {
	const link = document.createElement( 'link' )
	link.classList.add( 'ugb-google-fonts' )
	link.setAttribute( 'data-font-name', fontName )
	link.setAttribute( 'href', getGoogleFontURL( fontName ) )
	link.setAttribute( 'rel', 'stylesheet' )
	link.setAttribute( 'type', 'text/css' )
	return link
}

export const isGoogleFontEnqueued = ( fontName, head = document.querySelector( 'head' ) ) => {
	return head.querySelector( `[data-font-name="${ fontName }"]` )
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

/** TODO: deprecate this.
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
