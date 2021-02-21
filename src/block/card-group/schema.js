export default {
	uniqueId: {
		type: 'string',
		source: 'attribute',
		selector: '[data-id]',
		attribute: 'data-id',
		default: '',
	},
	design: {
		type: 'string',
		default: '',
	},
	blockMarginBottom: {
		type: 'number',
		default: '',
	},
	blockMarginBottomTablet: {
		type: 'number',
		default: '',
	},
	blockMarginBottomMobile: {
		type: 'number',
		default: '',
	},
	hasBackground: {
		type: 'boolean',
		default: false,
	},
}
