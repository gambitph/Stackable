/**
 * External dependencies
 */
import { default as _isDarkColor } from 'is-dark-color'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

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

/**
 * Adds !important to the end of every rule in a style object.
 *
 * @param {Object} styleObject A style object.
 *
 * @return {Object} New style object.
 */
export const appendImportantAll = styleObject => {
	return Object.keys( styleObject ).reduce( ( newStyleObject, key ) => {
		return {
			...newStyleObject,
			[ key ]: appendImportant( styleObject[ key ] ),
		}
	}, {} )
}

/**
 * Adds !important to a rule if the rule is not empty.
 *
 * @param {string} rule A CSS rule
 * @param {boolean} doImportant If false, !important will not be appended.
 *
 * @return {string} The rule with !important appended
 */
export const appendImportant = ( rule, doImportant = true ) => {
	return rule !== '' && typeof rule !== 'undefined' && doImportant && ! String( rule ).match( /!important/i ) ? `${ rule } !important` : rule
}

/**
 * Creates a set of responsive styles.
 *
 * @param {string} selector
 * @param {string} attrNameTemplate
 * @param {string} styleRule
 * @param {string} format
 * @param {Object} attributes
 * @param {boolean} important
 *
 * @return {Array} Reponsive object styles.
 */
export const createResponsiveStyles = ( selector, attrNameTemplate = '%s', styleRule = 'marginBottom', format = '%spx', attributes = {}, important = false ) => {
	const getValue = __getValue( attributes )

	return [ {
		[ selector ]: {
			[ styleRule ]: appendImportant( getValue( sprintf( attrNameTemplate, '' ), format ), important ),
		},
		tablet: {
			[ selector ]: {
				[ styleRule ]: appendImportant( getValue( sprintf( attrNameTemplate, 'Tablet' ), format ), important ),
			},
		},
		mobile: {
			[ selector ]: {
				[ styleRule ]: appendImportant( getValue( sprintf( attrNameTemplate, 'Mobile' ), format ), important ),
			},
		},
	} ]
}

/**
 * Creates a getValue function that's used for getting attributes for style generation.
 *
 * @param {Object} attributes Block attribbutes
 * @param {Function} attrNameCallback Optional function where the attrName will be run through for formatting
 * @param {Object} defaultValue_ Value to return if the attribute value is blank. Defaults to undefined.
 *
 * @return {Function} getValue function
 */
export const __getValue = ( attributes, attrNameCallback = null, defaultValue_ = undefined ) => ( attrName, format = '', defaultValue = defaultValue_ ) => {
	const attrNameFunc = attrNameCallback !== null ? attrNameCallback : ( s => s )
	const value = typeof attributes[ attrNameFunc( attrName ) ] === 'undefined' ? '' : attributes[ attrNameFunc( attrName ) ]
	return value !== '' ? ( format ? sprintf( format.replace( /%$/, '%%' ), value ) : value ) : defaultValue
}
