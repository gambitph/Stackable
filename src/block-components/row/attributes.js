import { convertResponsiveAttributes } from '~stackable/util'

export const attributes = convertResponsiveAttributes( {
	numInnerBlocks: {
		type: 'number',
		default: '',
	},
} )
