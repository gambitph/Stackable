/**
 * External dependencies
 */
import { createResponsiveAttributes } from '~stackable/util'
import {
	createBackgroundAttributes,
} from '../../util'

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
