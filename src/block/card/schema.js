import { imageAttributes, columnAttributes } from '~stackable/helpers'
import { convertResponsiveAttributes } from '~stackable/util'

export default convertResponsiveAttributes( {
	uniqueId: {
		type: 'string',
		source: 'attribute',
		selector: '[data-id]',
		attribute: 'data-id',
		default: '',
	},
	isFirstBlock: {
		type: 'boolean',
		default: false,
	},
	isLastBlock: {
		type: 'boolean',
		default: false,
	},
	design: {
		type: 'string',
		default: '',
	},

	...columnAttributes,

	hasContainer: {
		type: 'boolean',
		default: true,
	},
	hasBackground: {
		type: 'boolean',
		default: false,
	},

	...imageAttributes,

	blockBackgroundColor: {
		type: 'string',
		default: '',
	},
} )
