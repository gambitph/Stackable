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
 *
 * @return {*} attribute to be passed
 */
export const inheritDesktopAttribute = ( attribute = '', unit = 'px', maxValue = null, doImportant = true ) => {
	if ( attribute !== '' ) {
		if ( maxValue ) {
			if ( attribute <= maxValue ) {
				return appendImportant( `${ attribute }${ unit || 'px' }`, doImportant )
			}
			return appendImportant( `${ maxValue }${ unit || 'px' }`, doImportant )
		}
	}
}
