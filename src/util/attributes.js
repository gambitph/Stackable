/**
 * External dependencies
 */
import {
	camelCase,
	omit,
	pick,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const getAttrName = ( attrNameTemplate = '%s', param1 = '', param2 = '' ) => {
	return camelCase( sprintf( attrNameTemplate, param1, param2 ) )
}

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
 * @return {Object} The attributes
 */
export const createAllCombinationAttributes = ( attrNameTemplate = '', attrParams = {}, arr1 = [], arr2 = [] ) => {
	if ( ! arr2.length ) {
		return arr1.reduce( ( attributes, param1, index ) => {
			// Selector sprintf index
			const newParams = { ...attrParams }
			if ( typeof newParams.selector !== 'undefined' ) {
				newParams.selector = sprintf( newParams.selector, index + 1 )
			}

			attributes[ camelCase( sprintf( attrNameTemplate, param1 ) ) ] = newParams
			return attributes
		}, {} )
	}

	return arr1.reduce( ( attributes, param1 ) => {
		return {
			...attributes,
			...arr2.reduce( ( attributes, param2, index ) => {
				// Selector sprintf index
				const newParams = { ...attrParams }
				if ( typeof newParams.selector !== 'undefined' ) {
					newParams.selector = sprintf( newParams.selector, index + 1 )
				}

				attributes[ camelCase( sprintf( attrNameTemplate, param1, param2 ) ) ] = newParams
				return attributes
			}, {} ),
		}
	}, {} )
}

/**
 * Generates a combination set of attributes with responsive names.
 *
 * @param {string} attrNameTemplate The attribute name template, will be used with sprintf
 * @param {Object} attrParams The parameters the attribute will have
 *
 * @return {Object} The attributes
 */
export const createResponsiveAttributes = ( attrNameTemplate = '', attrParams = {} ) => {
	return createAllCombinationAttributes(
		attrNameTemplate,
		attrParams,
		[ '', 'Tablet', 'Mobile' ]
	)
}

/**
 * Removes attributes from an attribute object.
 *
 * @param {Object} attributes Attribute object
 * @param {Array} namesToOmit Names of attributes (not sprintf'ed) to omit
 * @param {string} attrNameTemplate The attribute name template, will be used with sprintf
 *
 * @return {Object} The attributes
 */
export const omitAttributes = ( attributes = {}, namesToOmit = [], attrNameTemplate = '' ) => {
	return omit( attributes, namesToOmit.map( name => camelCase( sprintf( attrNameTemplate, name ) ) ) )
}

/**
 * Picks specific attributes from an attribute object.
 *
 * @param {Object} attributes Attribute object
 * @param {Array} namesToPick Names of attributes (not sprintf'ed) to omit
 * @param {string} attrNameTemplate The attribute name template, will be used with sprintf
 *
 * @return {Object} The attributes
 */
export const pickAttributes = ( attributes = {}, namesToPick = [], attrNameTemplate = '' ) => {
	if ( ! namesToPick.length ) {
		return attributes
	}
	return pick( attributes, namesToPick.map( name => camelCase( sprintf( attrNameTemplate, name ) ) ) )
}

export const createResponsiveAttributeNames = attrNameTemplate => Object.keys( createResponsiveAttributes( attrNameTemplate ) )
