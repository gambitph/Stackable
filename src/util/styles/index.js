/**
 * External dependencies
 */
import { default as _isDarkColor } from 'is-dark-color'
import { lowerFirst, clamp } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const isDarkColor = color => {
	try {
		let colorTest = color
		if ( ! color.match( /^#/ ) ) {
			if ( color.indexOf( 'var(' ) > -1 ) {
				//
				/**
				 * Detect CSS variables in form of var(--color) and get their current
				 * values from the :root selector.
				 */
				const colorVar = color.match( /--(.*?(?=,))/g )
				if ( ! colorVar ) {
					colorTest = window.getComputedStyle( document.documentElement )
						.getPropertyValue( color.replace( 'var(', '' ).replace( ')', '' ) ) || '#fff'
				} else {
					// Do also for CSS variables with fallback values.
					colorTest = window.getComputedStyle( document.documentElement )
						.getPropertyValue( colorVar[ 0 ] ) || '#fff'
				}
			} else {
				return _isDarkColor( color )
			}
		}

		colorTest = colorTest.replace( /#/g, '' )
		if ( colorTest.length === 3 ) {
			colorTest = colorTest.replace( /(.)(.)(.)/, '$1$1$2$2$3$3' )
		}

		return _isDarkColor( `#${ colorTest }` )
	} catch ( err ) {
		return false
	}
}

export const marginLeftAlign = align => {
	return align === 'left' || align === 'flex-start' ? 0 : 'auto'
}

export const marginRightAlign = align => {
	return align === 'right' || align === 'flex-end' ? 0 : 'auto'
}

export const leftRightToFlex = align => {
	return align === 'left' ? 'flex-start' :
		align === 'right' ? 'flex-end' :
			align
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
 * Creates a getValue function that's used for getting attributes for style generation.
 *
 * @param {Object} attributes Block attribbutes
 * @param {Function} attrNameCallback Optional function where the attrName will be run through for formatting
 * @param {Object} defaultValue_ Value to return if the attribute value is blank. Defaults to undefined.
 *
 * @return {Function} getValue function
 */
export const __getValue = ( attributes, attrNameCallback = null, defaultValue_ = undefined ) => ( attrName, format = '', defaultValue = defaultValue_ ) => {
	const attrNameFunc = attrNameCallback !== null ? attrNameCallback : ( s => lowerFirst( s ) )
	const value = typeof attributes[ attrNameFunc( attrName ) ] === 'undefined' ? '' : attributes[ attrNameFunc( attrName ) ]
	return value !== '' ? ( format ? sprintf( format.replace( /%$/, '%%' ), value ) : value ) : defaultValue
}

/**
 * Clamps the desktop value based on given min and max
 *
 * @param {*} value
 * @param {Object} options
 */
export const clampInheritedStyle = ( value, options = {} ) => {
	const {
		min = Number.NEGATIVE_INFINITY,
		max = Number.POSITIVE_INFINITY,
	} = options

	if ( value !== '' ) {
		const clampedValue = clamp( value, parseFloat( min ), parseFloat( max ) )
		if ( ! isNaN( clampedValue ) ) {
			return parseFloat( clampedValue ) !== parseFloat( value ) ? clampedValue : undefined
		}
	}
}

/**
 * Creates a set of responsive styles.
 *
 * @param {string} selector
 * @param {string} attrNameTemplate
 * @param {string} styleRule
 * @param {string} format
 * @param {Object} attributes
 * @param {Object} options
 *
 * @return {Array} Reponsive object styles.
 */
export const createResponsiveStyles = ( selector, attrNameTemplate = '%s', styleRule = 'marginBottom', format = '%spx', attributes = {}, options = {} ) => {
	// Backward support, we previously had an "important" boolean argument instead of an options object.
	const _options = typeof options === 'boolean' ? { important: options } : options

	const {
		important = false,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritTabletMax, // If provided & inherit is true, clamp the inherited value in tablet to this.
		inheritTabletMin,
		inheritMobileMax, // If provided & inherit is true, clamp the inherited value in mobile to this.
		inheritMobileMin,
	} = _options
	const getValue = __getValue( attributes )

	if ( inherit ) {
		const desktopValue = getValue( sprintf( attrNameTemplate, '' ), format )
		const tabletValue = getValue( sprintf( attrNameTemplate, 'Tablet' ), format )
		const mobileValue = getValue( sprintf( attrNameTemplate, 'Mobile' ), format )

		const clampTabletValue = clampInheritedStyle( getValue( sprintf( attrNameTemplate, '' ) ), { min: inheritTabletMin, max: inheritTabletMax } )
		const clampMobileValue = clampInheritedStyle( getValue( sprintf( attrNameTemplate, '' ) ), { min: inheritMobileMin, max: inheritMobileMax } )

		return [ {
			[ selector ]: {
				[ styleRule ]: appendImportant( desktopValue, important ),
			},
			tabletOnly: {
				[ selector ]: {
					[ styleRule ]: tabletValue ? appendImportant( tabletValue, important ) : appendImportant( clampTabletValue && sprintf( format, clampTabletValue ), important ),
				},
			},
			mobile: {
				[ selector ]: {
					[ styleRule ]: mobileValue ? appendImportant( mobileValue, important ) : appendImportant( clampMobileValue && sprintf( format, clampMobileValue ), important ),
				},
			},
		} ]
	}

	return [ {
		desktopOnly: {
			[ selector ]: {
				[ styleRule ]: appendImportant( getValue( sprintf( attrNameTemplate, '' ), format ), important ),
			},
		},
		tabletOnly: {
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
 * Creates a set of margin left and margin right for alignment.
 *
 * @param {string} selector
 * @param {string} attrNameTemplate
 * @param {Object} attributes
 *
 * @return {Array} Reponsive object styles.
 */
export const createResponsiveMarginAlign = ( selector, attrNameTemplate = '%s', attributes = {} ) => {
	const getValue = __getValue( attributes )

	// Overall content alignment option of the block.
	// This is followed first by the block.
	const contentAlign = getValue( 'contentAlign' )
	const tabletContentAlign = getValue( 'TabletContentAlign' )
	const mobileContentAlign = getValue( 'MobileContentAlign' )

	// Alignment option of the block element.
	// This is followed if provided.
	const align = getValue( sprintf( attrNameTemplate, '' ) )
	const tabletAlign = getValue( sprintf( attrNameTemplate, 'Tablet' ) )
	const mobileAlign = getValue( sprintf( attrNameTemplate, 'Mobile' ) )

	return [ {
		[ selector ]: appendImportantAll( {
			marginLeft: align || contentAlign ? marginLeftAlign( align || contentAlign ) : undefined,
			marginRight: align || contentAlign ? marginRightAlign( align || contentAlign ) : undefined,
		} ),
		tablet: {
			[ selector ]: appendImportantAll( {
				marginLeft: tabletAlign || tabletContentAlign ? marginLeftAlign( tabletAlign || tabletContentAlign ) : undefined,
				marginRight: tabletAlign || tabletContentAlign ? marginRightAlign( tabletAlign || tabletContentAlign ) : undefined,
			} ),
		},
		mobile: {
			[ selector ]: appendImportantAll( {
				marginLeft: mobileAlign || mobileContentAlign ? marginLeftAlign( mobileAlign || mobileContentAlign ) : undefined,
				marginRight: mobileAlign || mobileContentAlign ? marginRightAlign( mobileAlign || mobileContentAlign ) : undefined,
			} ),
		},
	} ]
}

/**
 * Creates a set of responsive styles for the editor.
 *
 * @param {string} selector
 * @param {string} attrNameTemplate
 * @param {string} styleRule
 * @param {string} format
 * @param {Object} attributes
 * @param options
 * @param {boolean} important
 * @return {Array} Reponsive object styles.
 */
export const createResponsiveEditorStyles = ( selector, attrNameTemplate = '%s', styleRule = 'marginBottom', format = '%spx', attributes = {}, options = {} ) => {
	return [ {
		editor: createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes, options )[ 0 ],
	} ]
}
