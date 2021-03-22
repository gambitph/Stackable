/**
 * External dependencies
 */
import { addBackgroundStyles } from '~stackable/helpers'
// import {
// 	__getValue,
// } from '~stackable/util'

/**
 * Adds image styles.
 *
 * @param {Object} styles The StyleObject to append to
 * @param {Object} blockProps Block props
 */
export const addStyles = ( styles, blockProps ) => {
	// const getValue = __getValue( blockProps.attributes )

	addBackgroundStyles( styles, blockProps, {
		attrNameTemplate: 'block%s',
	} )
}
