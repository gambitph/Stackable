import { convertResponsiveAttributes } from '~stackable/util'

export const imageAttributes = convertResponsiveAttributes( {
	imageUrl: {
		type: 'string',
		default: '',
	},
	imageId: {
		type: 'number',
		default: '',
	},
	imageAlt: {
		type: 'string',
		default: '',
	},
	imageSize: {
		type: 'string',
		default: 'large',
	},
	imageTitle: {
		type: 'string',
		default: '',
	},
	imageHeight_: {
		type: 'number',
		default: '',
	},
	imageWidth_: {
		type: 'number',
		default: '',
	},
	imageHeightUnit_: {
		type: 'string',
		default: 'px',
	},
	imageWidthUnit_: {
		type: 'string',
		default: '%',
	},
	imageZoom: {
		type: 'number',
		default: '',
	},
	imagePosition: {
		type: 'number',
		default: '',
	},
} )
