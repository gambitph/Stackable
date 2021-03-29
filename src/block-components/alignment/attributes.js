import { convertResponsiveAttributes } from '~stackable/util'

export const attributes = convertResponsiveAttributes( {
	// Assume that the block uses the BlockDiv Block Component.
	// uniqueId: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: '[data-id]',
	// 	attribute: 'data-id',
	// 	default: '',
	// },
	contentAlign_: {
		type: 'string',
		default: '',
	},
	rowAlign_: {
		type: 'string',
		default: '',
	},
	columnAlign_: {
		type: 'string',
		default: '',
	},
	innerBlockOrientation: {
		type: 'string',
		default: '',
	},
	innerBlockVerticalAlign_: {
		type: 'string',
		default: '',
	},
} )

