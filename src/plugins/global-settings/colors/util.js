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
 *
 * @return {string} generated modified stringified attributes object.
 */
export const replaceGlobalColorAttributes = ( attributes = {}, colorsBeforeReset = [], colorsAfterReset = [] ) => {
	const colorVars = colorsBeforeReset.map( color => color.colorVar )
	let updatedStringifiedAttributes = JSON.stringify( attributes )
	colorVars.forEach( colorVar => {
		const colorVarRegExp = new RegExp( `var\\(${ colorVar },(.*)\\)`, 'g' )
		updatedStringifiedAttributes = updatedStringifiedAttributes.replace( colorVarRegExp, () => {
			const defaultColor = find( colorsAfterReset, updatedColor => updatedColor.colorVar === colorVar )
			if ( ! defaultColor ) {
				// Retain the color.
				return find( colorsBeforeReset, color => color.colorVar === colorVar ).fallback
			}
			// Revert the color to the default color.
			return defaultColor.color
		} )
	} )

	return JSON.parse( updatedStringifiedAttributes )
}

