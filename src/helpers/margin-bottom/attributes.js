import { convertResponsiveAttributes } from '~stackable/util'

export const marginBottomAttributes = convertResponsiveAttributes( {
	blockMarginBottom_: {
		type: 'number',
		default: '',
	},
} )
