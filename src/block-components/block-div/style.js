/**
 * Internal dependencies
 */
import { addBackgroundStyles } from '../helpers'

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

	addBackgroundStyles( styles, attributes, {
		attrNameTemplate: 'block%s',
	} )
}
