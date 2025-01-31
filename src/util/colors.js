
import { applyFilters } from '@wordpress/hooks'

import rgba from 'color-rgba'

/**
 *
 * Combines hex & opacity to rgba.
 *
 * @param {string} hexColor Color
 * @param {number} opacity Opacity
 *
 * @return {string} Rgba color.
 */
export const hexToRgba = ( hexColor, opacity = null ) => {
	if ( ! hexColor ) {
		return ''
	}

	// Allow others to change the conversion.
	const overrideOutput = applyFilters( 'stackable.util.hex-to-rgba', null, hexColor, opacity )
	if ( overrideOutput ) {
		return overrideOutput
	}

	let hex = applyFilters( 'stackable.util.hex-to-rgba.hex', hexColor, opacity )

	/**
	 * Detect CSS variables in form of var(--color) and get their current
	 * values from the :root selector.
	 */
	if ( hex.indexOf( 'var(' ) > -1 ) {
		const colorVar = hex.match( /--(.*?(?=,))/g )
		if ( ! colorVar ) {
			hex = window.getComputedStyle( document.documentElement )
				.getPropertyValue( hex.replace( 'var(', '' ).replace( ')', '' ) ) || '#fff'
		} else {
			// Do also for CSS variables with fallback values.
			hex = window.getComputedStyle( document.documentElement )
				.getPropertyValue( colorVar[ 0 ] ) || '#fff'
		}
	}

	hex = hex.replace( /#/, '' )
	// If the fallback value is rgb or rgba, return the value instead.
	if ( hex.match( /rgb(a?)\(/g ) ) {
		return hex
	}

	if ( hex.length <= 4 ) {
		hex = hex.replace( /#?(.)(.)(.)/, '$1$1$2$2$3$3' )
	}
	const newColor = rgba( `#${ hex }ff` )
	newColor[ 3 ] = opacity !== null ? opacity : 1
	return `rgba(${ newColor.join( ', ' ) })`
}

/**
 * Extract the hexadecimal value of the color from a CSS color value, if the
 * value is a CSS custom property, extract the fallback color.
 *
 * @param {string} value CSS Color
 * @return {string} Hexadecimal value of the color
 */
export const extractColor = value => {
	if ( value?.startsWith( 'var(--' ) ) {
		if ( value.match( /(#[^\)]*)/g ) ) {
			return value.match( /(#[^\)]*)/g )[ 0 ]
		}
	}
	return value
}

/**
 * Combines a hex or var() color with an opacity value to a hex color with alpha
 * #RRGGBBAA format. This is mostly used for the deprecated opacity attributes.
 *
 * When deprecating the opacity, if the color is a normal hex value, deprecate
 * to:
 *
 * color: #abcdef opacity: 0.1 new color: #abcdef1a
 *
 * formula: Math.ceil((0.42 * 255)).toString(16).padStart(2, '0')
 *
 * color: var(--stk-global-color-10793, #00ffe1) opacity: 0.4 new color:
 * color-mix(in srgb, var(--stk-global-color-10793, #00ffe1) 40%, transparent)
 *
 * @param {string} color color in hex or var() format
 * @param {float} opacity opacity 0.0-1.0
 * @return {string} color in #RRGGBBAA format
 */
export const colorOpacityToHexAplha = ( color, opacity ) => {
	if ( ! color ) {
		return ''
	}
	if ( color.startsWith( '#' ) ) {
		// Get the first 6 hex digits.
		const hex = color.slice( 0, 7 )
		return hex + Math.ceil( ( opacity * 255 ) ).toString( 16 ).padStart( 2, '0' )
	} else if ( color.includes( 'var(' ) ) {
		return `color-mix(in srgb, ${ color } ${ opacity * 100 }%, transparent)`
	}
	return color
}

export const extractRgba = value => {
	let options = value
	let color = ''
	options = options.replace( /rgba\(.*\)$/g, val => {
		color = val
		return ''
	} ).trim()

	return {
		options,
		color,
	}
}

export const rgbaToHexAlpha = color => {
	const rgba = color.substring( 5, color.length - 1 ).split( ',' )

	const hexAlpha = rgba.map( ( val, i ) => {
		if ( i === 3 ) {
			const opacity = parseFloat( val )
			return Math.ceil( ( opacity * 255 ) ).toString( 16 ).padStart( 2, '0' )
		}
		const hex = parseInt( val ).toString( 16 )
		return hex.length === 1 ? '0' + hex : hex
	} )

	return '#' + hexAlpha.join( '' )
}
