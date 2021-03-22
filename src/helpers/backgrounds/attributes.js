import { convertResponsiveAttributes } from '~stackable/util'

export const backgroundAttributes = convertResponsiveAttributes( {
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '',
	},
	backgroundColor2: {
		type: 'string',
		default: '',
	},
	backgroundMediaId_: {
		type: 'string',
		default: '',
	},
	backgroundMediaUrl_: {
		type: 'string',
		default: '',
	},
	backgroundGradientBlendMode: {
		type: 'string',
		default: '',
	},
	backgroundPosition_: {
		type: 'string',
		default: '',
	},
	backgroundRepeat_: {
		type: 'string',
		default: '',
	},
	backgroundSize_: {
		type: 'string',
		default: '',
	},
	backgroundImageBlendMode: {
		type: 'string',
		default: '',
	},
	backgroundColorOpacity: {
		type: 'number',
		default: '',
	},
	backgroundTintStrength: {
		type: 'number',
		default: '',
	},
	backgroundGradientDirection: {
		type: 'number',
		default: '',
	},
	backgroundCustomSize_: {
		type: 'number',
		default: '',
	},
	backgroundGradientLocation1: {
		type: 'number',
		default: '',
	},
	backgroundGradientLocation2: {
		type: 'number',
		default: '',
	},
	fixedBackground: {
		type: 'boolean',
		default: '',
	},
	backgroundCustomSizeUnit_: {
		type: 'string',
		default: '%',
	},
} )
