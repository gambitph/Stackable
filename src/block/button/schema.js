
/**
 * External dependencies
 */
import { createButtonAttributes } from '~stackable/util'

export default {
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	collapseOn: {
		type: 'string',
		default: '',
	},
	showButton2: {
		type: 'boolean',
		default: false,
	},
	showButton3: {
		type: 'boolean',
		default: false,
	},
	...createButtonAttributes( 'button1%s', { selector: '.ugb-button1' } ),
	...createButtonAttributes( 'button2%s', { selector: '.ugb-button2' } ),
	...createButtonAttributes( 'button3%s', { selector: '.ugb-button3' } ),

	displayCondition: {
		type: 'object',
	},
}
