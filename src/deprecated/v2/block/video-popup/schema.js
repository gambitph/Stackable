import {
	createBackgroundAttributes,
	createResponsiveAttributes,
	createBorderAttributes,
} from '~stackable/util'

export default {
	videoLink: {
		type: 'string',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: '[data-video]',
		attribute: 'data-video',
	},

	...createResponsiveAttributes( '%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeight', {
		type: 'number',
		default: '',
	} ),
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	playButtonColor: {
		type: 'string',
	},
	playButtonSize: {
		type: 'number',
		default: '',
	},
	playButtonOpacity: {
		type: 'number',
		default: '',
	},

	// Border.
	...createBorderAttributes( 'column%s' ),

	...createBackgroundAttributes( 'preview%s' ),
	previewBackgroundColor: {
		type: 'string',
		default: '#000000',
	},

	hoverEffect: {
		type: 'string',
		default: '',
	},
}
