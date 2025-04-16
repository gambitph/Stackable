/**
 * External dependencies
 */
import { locale, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

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

export const SYSTEM_FONT_STACKS = {
	'Sans-Serif': {
		value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
		label: __( 'Sans-Serif', i18n ),
	},
	'Serif': {
		value: '"Palatino Linotype", Palatino, Palladio, "URW Palladio L", "Book Antiqua", Baskerville, "Bookman Old Style", "Bitstream Charter", "Nimbus Roman No9 L", Garamond, "Apple Garamond", "ITC Garamond Narrow", "New Century Schoolbook", "Century Schoolbook", "Century Schoolbook L", Georgia, serif',
		label: __( 'Serif', i18n ),
	},
	'Serif-Alt': {
		value: 'Constantia, Lucida Bright, Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif',
		label: __( 'Serif Alternative', i18n ),
	},
	'Monospace': {
		value: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		label: __( 'Monospace', i18n ),
	},
}

// See https://github.com/system-fonts/modern-font-stacks
export const MODERN_FONT_STACKS = {
	'modern-stack-system-ui': {
		value: 'system-ui, sans-serif',
		label: __( 'System UI', i18n ),
	},
	'modern-stack-transitional': {
		value: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
		label: __( 'Transitional', i18n ),
	},
	'modern-stack-old-style': {
		value: "'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif",
		label: __( 'Old Style', i18n ),
	},
	'modern-stack-humanist': {
		value: "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif",
		label: __( 'Humanist', i18n ),
	},
	'modern-stack-geometric-humanist': {
		value: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif",
		label: __( 'Geometric Humanist', i18n ),
	},
	'modern-stack-classical-humanist': {
		value: "Optima, Candara, 'Noto Sans', source-sans-pro, sans-serif",
		label: __( 'Classical Humanist', i18n ),
	},
	'modern-stack-neo-grotesque': {
		value: "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
		label: __( 'Neo Grotesque', i18n ),
	},
	'modern-stack-monospace-slab-serif': {
		value: "'Nimbus Mono PS', 'Courier New', monospace",
		label: __( 'Monospace Slab Serif', i18n ),
	},
	'modern-stack-monospace-code': {
		value: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
		label: __( 'Monospace Code', i18n ),
	},
	'modern-stack-industrial': {
		value: "Bahnschrift, 'DIN Alternate', 'Franklin Gothic Medium', 'Nimbus Sans Narrow', sans-serif-condensed, sans-serif",
		label: __( 'Industrial', i18n ),
	},
	'modern-stack-rounded-sans': {
		value: "ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, Manjari, 'Arial Rounded MT', 'Arial Rounded MT Bold', Calibri, source-sans-pro, sans-serif",
		label: __( 'Rounded Sans', i18n ),
	},
	'modern-stack-slab-serif': {
		value: "Rockwell, 'Rockwell Nova', 'Roboto Slab', 'DejaVu Serif', 'Sitka Small', serif",
		label: __( 'Slab Serif', i18n ),
	},
	'modern-stack-antique': {
		value: "Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif",
		label: __( 'Antique', i18n ),
	},
	'modern-stack-didone': {
		value: "Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif",
		label: __( 'Didone', i18n ),
	},
	'modern-stack-handwritten': {
		value: "'Segoe Print', 'Bradley Hand', Chilanka, TSCu_Comic, casual, cursive",
		label: __( 'Handwritten', i18n ),
	},
}

export const getGoogleFontURL = fontName => {
	const family = fontName.replace( / /g, '+' )
	const subset = subsets[ locale ] ? `&subset=${ subsets }` : ''
	return `https://fonts.googleapis.com/css?family=${ family }:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic${ subset }`
}

export const isWebFont = fontName => {
	if ( fontName ) {
		if ( Object.keys( SYSTEM_FONT_STACKS ).includes( fontName ) ) {
			return false
		}
		if ( Object.keys( MODERN_FONT_STACKS ).includes( fontName ) ) {
			return false
		}
		return true
	}
	return false
}

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

// Outputs the font family name for display purposes.
export const getFontFamilyLabel = ( fontName, defaultLabel = '' ) => {
	// Modern font stacks.
	if ( MODERN_FONT_STACKS[ fontName ] ) {
		return MODERN_FONT_STACKS[ fontName ].label
	}

	// System fonts.
	if ( SYSTEM_FONT_STACKS[ fontName ] ) {
		return SYSTEM_FONT_STACKS[ fontName ].label
	}

	return fontName || defaultLabel || __( 'Default', i18n )
}

export const getFontFamily = fontName => {
	const defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
	if ( ! fontName ) {
		return defaultFontFamily
	}

	// If the font is a CSS custom property, return it directly.
	if ( fontName.match( /^\s*var\(--/ ) ) {
		return fontName
	}

	// Modern font stacks.
	if ( MODERN_FONT_STACKS[ fontName ] ) {
		return MODERN_FONT_STACKS[ fontName ].value
	}

	// Google Font.
	if ( isWebFont( fontName ) ) {
		return `"${ fontName }", Sans-serif`
	}

	// System fonts.
	if ( SYSTEM_FONT_STACKS[ fontName ] ) {
		return SYSTEM_FONT_STACKS[ fontName ].value
	}

	return defaultFontFamily
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
