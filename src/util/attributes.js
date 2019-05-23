import { camelCase } from 'lodash'
import { sprintf } from '@wordpress/i18n'

/**
 * Generates a combination set of attributes with different names.
 *
 * For example: given the name `%sMargin` and array `[ 'Top', 'Bottom' ]`, will output
 * an array of attributes with the names `topMargin` and `bottomMargin`.
 *
 * Example 2: `%sFontSize` and array `[ '', 'Tablet', 'Mobile' ]`, will output
 * `fontSize`, `tabletFontSize` and `mobileFontSize`.
 *
 * Useful for creating attributes for multiple screen sizes. e.g. `mobile`, `tablet`
 *
 * @param {string} attrNameTemplate The attribute name template, will be used with sprintf
 * @param {Object} attrParams The parameters the attribute will have
 * @param {Array} arr1 The names to combine
 * @param {Array} arr2 The names to combine (optional)
 *
 * @return {Array} The attributes
 */
export const createAllCombinationAttributes = ( attrNameTemplate = '', attrParams = {}, arr1 = [], arr2 = [] ) => {
	if ( ! arr2.length ) {
		return arr1.reduce( ( attributes, param1 ) => {
			attributes[ camelCase( sprintf( attrNameTemplate, param1 ) ) ] = { ...attrParams }
			return attributes
		}, {} )
	}

	return arr1.reduce( ( attributes, param1 ) => {
		return {
			...attributes,
			...arr2.reduce( ( attributes, param2 ) => {
				attributes[ camelCase( sprintf( attrNameTemplate, param1, param2 ) ) ] = { ...attrParams }
				return attributes
			}, {} ),
		}
	}, {} )
}
