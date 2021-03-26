import { convertResponsiveAttributes } from '~stackable/util'

export const borderAttributes = convertResponsiveAttributes( {
	borderType: {
		type: 'string',
		default: '',
	},
	borderColor: {
		type: 'string',
		default: '',
	},
	borderWidthTop_: {
		type: 'number',
		default: '',
	},
	borderWidthRight_: {
		type: 'number',
		default: '',
	},
	borderWidthBottom_: {
		type: 'number',
		default: '',
	},
	borderWidthLeft_: {
		type: 'number',
		default: '',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'string',
		default: '',
	},
} )
