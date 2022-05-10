
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
