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
	columnWidths: {
		type: 'array',
		default: [],
	},
	hasBackground: {
		type: 'boolean',
		default: false,
	},
}
