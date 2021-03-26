/**
 * Internal dependencies
 */
import { addBackgroundStyles, addBorderStyles } from '../helpers'

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
 */
export const addStyles = ( styles, attributes ) => {
	// const getValue = __getValue( attributes )

	if ( attributes.hasBackground ) {
		addBackgroundStyles( styles, attributes, {
			attrNameTemplate: 'block%s',
		} )
	}
	addBorderStyles( styles, attributes, {
		attrNameTemplate: 'block%s',
	} )
}
