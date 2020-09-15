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
 * @param {Object} options additional function options
 *
 * @return {string} generated modified stringified attributes object.
 */
export const replaceGlobalColorAttributes = ( attributes = {}, colorsBeforeReset = [], options = {} ) => {
	if ( ! Array.isArray( colorsBeforeReset ) ) {
		return attributes
	}
	const {
		includeSlugNames = false,
		includeColorVar = true,
	} = options
	let updatedStringifiedAttributes = JSON.stringify( attributes )

	if ( includeColorVar ) {
		colorsBeforeReset.forEach( colorBeforeReset => {
			if ( colorBeforeReset.colorVar ) {
				updatedStringifiedAttributes = updatedStringifiedAttributes.replace( new RegExp( `var\\(${ colorBeforeReset.colorVar }, ${ colorBeforeReset.color.replace( ')', '\\)' ).replace( '(', '\\(' ) }\\)`, 'g' ), colorAttribute => {
					// Retain the color.
					return colorBeforeReset ? colorBeforeReset.color || '#000000' : colorAttribute
				} )
			}
		} )
	}

	if ( includeSlugNames ) {
		const stackableSlugNames = colorsBeforeReset.filter( color => color.slug && color.slug.includes( 'stk-global-color' ) ).map( color => color.slug )
		stackableSlugNames.forEach( stackableSlugName => {
			const foundColorBeforeReset = find( colorsBeforeReset, color => color.slug === stackableSlugName )
			updatedStringifiedAttributes = updatedStringifiedAttributes.replace( new RegExp( stackableSlugName, 'g' ), foundColorBeforeReset ? foundColorBeforeReset.color || '#000000' : '#000000' )
		} )
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
		if ( colorVar ) {
			const colorVarRegExp = new RegExp( `var\\(${ colorVar },(.?)#(.*?(?=\\)))\\)`, 'g' )
			updatedStringifiedAttributes = updatedStringifiedAttributes.replace( colorVarRegExp, colorAttribute => {
				const newColor = find( colors, updatedColor => updatedColor.colorVar === colorVar )
				if ( newColor ) {
					return `var(${ colorVar }, ${ newColor.color })`
				}
				return colorAttribute
			} )
		}
	} )

	return JSON.parse( updatedStringifiedAttributes )
}
