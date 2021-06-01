/**
 * External dependencies
 */
import { createResponsiveAttributes, createBackgroundAttributes } from '~stackable/util'

export default {
	...createResponsiveAttributes( '%sHeight', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeightUnit', {
		type: 'string',
		default: 'px',
	} ),

	// Background.
	...createBackgroundAttributes( '%s' ),

}
