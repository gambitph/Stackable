export * from './attribute-object'
import { getPermutation } from './util'

/**
 * External dependencies
 */
import {
	camelCase,
	omit,
	pick,
	upperFirst,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const getAttrName = ( attrNameTemplate = '%s', param1 = '', param2 = '' ) => {
	if ( attrNameTemplate === '%s' ) {
		return param1
	}
	return camelCase( sprintf( attrNameTemplate, upperFirst( param1 ), upperFirst( param2 ) ) )
}

export const getAttrNameFunction = attrNameTemplate => ( param1 = '', param2 = '' ) => {
	if ( attrNameTemplate === '%s' ) {
		return param1
	}
	return getAttrName( attrNameTemplate, param1, param2 )
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

const REMOVE_ATTRS = [ 'stkResponsive', 'stkHover', 'stkUnits' ]

/**
 * Adds the necessary tablet, mobile, hover and unit attribute definitions.
 *
 * @param {Object} attributes Attribute object
 *
 * @return {Object} Adjusted attributes
 */
export const expandAttributes = attributes => {
	return Object.keys( attributes ).reduce( ( newAttributes, name ) => {
		const suffixes = [ [ name ] ]

		// Add the new attribute names (the order is important).
		let defaultUnit = 'px'
		if ( newAttributes[ name ].stkUnits ) {
			suffixes.push( [ '', 'Unit' ] )
			defaultUnit = newAttributes[ name ].stkUnits
		}
		if ( newAttributes[ name ].stkResponsive ) {
			suffixes.push( [ '', 'Tablet', 'Mobile' ] )
		}
		if ( newAttributes[ name ].stkHover ) {
			suffixes.push( [ '', 'Hover', 'ParentHover', 'Collapsed' ] )
		}

		const attributeNames = getPermutation( suffixes )
		attributeNames.forEach( attributeName => {
			// Form the new attributes
			const parameters = omit( { ...attributes[ name ] }, REMOVE_ATTRS )

			// Override the default
			if ( attributeName !== name ) {
				parameters.default = ''
			}

			// If this is a unit, then the default value is the unit itself.
			if ( attributeName.startsWith( `${ name }Unit` ) ) {
				parameters.type = 'string'
				parameters.default = defaultUnit
			}

			// Add the new attribute.
			newAttributes[ attributeName ] = parameters
		} )

		return newAttributes
	}, attributes )
}

export const getAttributeName = ( attrName, deviceType = 'desktop', hoverState = 'normal' ) => {
	const deviceAttrName = deviceType.toLowerCase() === 'desktop' ? '' : upperFirst( deviceType )
	const hoverAttrName =
		hoverState === 'normal' ? ''
			: hoverState === 'hover' ? 'Hover'
				: hoverState === 'collapsed' ? 'Collapsed'
					: 'ParentHover'

	// Follow format if supplied.
	if ( attrName?.includes( '%s' ) ) {
		return sprintf( attrName, `${ deviceAttrName }${ hoverAttrName }` )
	}

	return `${ attrName }${ deviceAttrName }${ hoverAttrName }`
}

/**
 * Checks whether an attribute is empty or is considered as an unset block
 * attribute. Handles top, left, right and bottom default attribute.
 *
 * @param {Object} value The value of a block attribute
 *
 * @return {boolean} True if the value is considered to be empty or unset
 */
export const isEmptyAttribute = value => {
	if ( typeof value === 'object' ) {
		return Object.values( value ).every( value => {
			return isEmptyAttribute( value )
		} )
	}
	return ( typeof value === 'undefined' ) || ( ! value && value === '' )
}

export const isEmptyAttributes = values => {
	return values.every( value => isEmptyAttribute( value ) )
}

// Common content attributes across all Stackable blocks that should be preserved.
export const CONTENT_ATTRIBUTES = [
	// Image attributes
	'imageUrl',
	'imageId',
	'imageAlt',
	// Text
	'text',
	// Icon
	// 'icon',
	// Link
	'linkHasLink',
	'linkUrl',
	'linkNewTab',
	'linkRel',
	'linkHasTitle',
	'linkTitle',
	// Block-level link
	'blockLinkHasLink',
	'blockLinkUrl',
	'blockLinkNewTab',
	'blockLinkRel',
	'blockLinkHasTitle',
	'blockLinkTitle',
]
