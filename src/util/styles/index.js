import { default as _isDarkColor } from 'is-dark-color'

export const isDarkColor = color => {
	try {
		if ( ! color.match( /^#/ ) ) {
			return _isDarkColor( color )
		}
		let colorTest = color.replace( /#/g, '' )
		if ( colorTest.length === 3 ) {
			colorTest = colorTest.replace( /(.)(.)(.)/, '$1$1$2$2$3$3' )
		}
		return _isDarkColor( `#${ colorTest }` )
	} catch ( err ) {
		return false
	}
}

export const marginLeftAlign = align => {
	return align === 'left' ? 0 : 'auto'
}

export const marginRightAlign = align => {
	return align === 'right' ? 0 : 'auto'
}

/**
 * Returns white if the background color is dark.
 *
 * @param {string} textColor
 * @param {string} backgroundColor
 *
 * @return {string} White if the background color is dark, textColor if not
 */
export const whiteIfDark = ( textColor, backgroundColor = '' ) => {
	const returnColor = textColor !== '' ? textColor : undefined
	if ( ! returnColor && backgroundColor ) {
		return isDarkColor( backgroundColor ) ? '#ffffff' : returnColor
	}
	return returnColor
}

/**
 * Returns white if the background color is dark, and black if light
 *
 * @param {string} textColor
 * @param {string} backgroundColor
 * @param {string} white
 * @param {string} black
 *
 * @return {string} White if the background color is dark, black if light, textColor if not
 */
export const whiteIfDarkBlackIfLight = ( textColor, backgroundColor = '', white = '#ffffff', black = '#222222' ) => {
	const returnColor = textColor !== '' ? textColor : undefined
	if ( ! returnColor && backgroundColor ) {
		return isDarkColor( backgroundColor ) ? white : black
	}
	return returnColor
}
