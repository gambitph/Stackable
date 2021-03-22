import { convertResponsiveAttributes } from '~stackable/util'

export const attributes = convertResponsiveAttributes( {
	isFirstBlock: {
		type: 'boolean',
		default: false,
	},
	isLastBlock: {
		type: 'boolean',
		default: false,
	},
	columnWidth_: {
		type: 'number',
		default: '',
	},
} )
