/**
 * Internal dependencies
 */
import {
	addBackgroundStyles, addBorderStyles, addSizeStyles,
} from '../helpers'

/**
 * External dependencies
 */
// import {
// 	__getValue,
// } from '~stackable/util'

/**
 * Adds image styles.
 *
 * @param {Object} styles The StyleObject to append to
 * @param {Object} attributes Block attributes
 * @param {Object} options
 */
export const addStyles = ( styles, attributes, options = {} ) => {
	// const getValue = __getValue( attributes )
	const {
		backgroundSelector = '.stk-container',
		borderSelector = '.stk-container',
		sizeSelector = '.stk-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = null,
	} = options

	if ( attributes.hasContainer ) {
		addBackgroundStyles( styles, attributes, {
			attrNameTemplate: 'container%s',
			selector: backgroundSelector,
		} )
	}
	addBorderStyles( styles, attributes, {
		attrNameTemplate: 'container%s',
		selector: borderSelector,
	} )
	addSizeStyles( styles, attributes, {
		attrNameTemplate: 'container%s',
		selector: sizeSelector,
		verticalAlignRule: sizeVerticalAlignRule,
		horizontalAlignRule: sizeHorizontalAlignRule,
	} )
}
