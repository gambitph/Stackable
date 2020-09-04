/**
 * External dependencies
 */
import { find } from 'lodash'

/**
 * Function used to update an attribute based on the matched
 * custom css global property in attributes object.
 *
 * @param {string} attributes the attributes object of the block.
 * @param {Array} colorsBeforeReset set of colors before clicking reset button.
 * @param {Array} colorsAfterReset set of colors after clicking the reset button.
 * @param {Object} options additional function options
 *
 * @return {string} generated modified stringified attributes object.
 */
export const replaceGlobalColorAttributes = ( attributes = {}, colorsBeforeReset = [], colorsAfterReset = [], options = {} ) => {
	if ( ! Array.isArray( colorsBeforeReset ) || ! Array.isArray( colorsAfterReset ) ) {
		return attributes
	}
	const {
		includeSlugNames = false,
		includeColorVar = true,
	} = options
	let updatedStringifiedAttributes = JSON.stringify( attributes )

	if ( includeColorVar ) {
		const colorVars = colorsBeforeReset.map( color => color.colorVar )
		colorVars.forEach( colorVar => {
			const colorVarRegExp = new RegExp( `var\\(${ colorVar },(.*)\\)`, 'g' )
			updatedStringifiedAttributes = updatedStringifiedAttributes.replace( colorVarRegExp, colorAttribute => {
				const defaultColor = find( colorsAfterReset, updatedColor => updatedColor.colorVar === colorVar )
				if ( ! defaultColor ) {
				// Retain the color.
					const appliedColor = find( colorsBeforeReset, color => color.colorVar === colorVar )
					return appliedColor ? appliedColor.fallback || '#000000' : '#000000'
				}
				// Revert the color to the default color.
				return defaultColor.color || colorAttribute
			} )
		} )
	}

	if ( includeSlugNames ) {
		const stackableSlugNames = updatedStringifiedAttributes.match( /stk-global-color-(\S*)/g )
		if ( stackableSlugNames && Array.isArray( stackableSlugNames ) ) {
			stackableSlugNames.forEach( stackableSlugName => {
				const foundColor = find( colorsBeforeReset, color => color.slug === stackableSlugName )
				if ( foundColor ) {
					updatedStringifiedAttributes = updatedStringifiedAttributes.replace( stackableSlugName, foundColor.fallback || '#000000' )
				}
			} )
		}
	}

	return JSON.parse( updatedStringifiedAttributes )
}

/**
 * Used to update the fallback values in attributes object
 *
 * @param {Object} attributes
 * @param {Array} colors
 *
 * @return {Object} modified attribute
 */
export const updateFallbackColorAttributes = ( attributes = {}, colors = [] ) => {
	if ( ! Array.isArray( colors ) ) {
		return attributes
	}

	let updatedStringifiedAttributes = JSON.stringify( attributes )

	const colorVars = colors.map( color => color.colorVar )
	colorVars.forEach( colorVar => {
		const colorVarRegExp = new RegExp( `var\\(${ colorVar },(.*)\\)`, 'g' )
		updatedStringifiedAttributes = updatedStringifiedAttributes.replace( colorVarRegExp, colorAttribute => {
			const newColor = find( colors, updatedColor => updatedColor.colorVar === colorVar )
			if ( newColor ) {
				return newColor.color || '#000000'
			}
			return colorAttribute
		} )
	} )

	return JSON.parse( updatedStringifiedAttributes )
}
