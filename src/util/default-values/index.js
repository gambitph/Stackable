/**
 * External dependencies
 */
import { appendImportant } from '~stackable/util'

/**
 * Inherits the desktop attribute value if mobile
or tablet attribute is not yet defined.
 *
 * @param {number} attribute the desktop attribute
 * @param {string} unit the unit used by the attribute
 * @param {number} maxValue if defined, only set the value less than or equal to maxValue
 * @param {boolean} doImportant if this is false, !important won't be appended
 * @param {*} fallback if no maxValue is defined or value is less than or equal to maxValue, this will be returned
 *
 * @return {*} attribute to be passed
 */
export const inheritDesktopAttribute = ( attribute = '', unit = 'px', maxValue = null, doImportant = true, fallback ) => {
	if ( attribute !== '' ) {
		if ( maxValue !== null ) {
			if ( parseFloat( attribute ) <= parseFloat( maxValue ) ) {
				return fallback
			}
			return appendImportant( `${ maxValue }${ unit }`, doImportant )
		}
		return undefined
	}
}
