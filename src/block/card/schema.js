export default {
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
	columnWidth: {
		type: 'number',
		default: '',
	},
	hasContainer: {
		type: 'boolean',
		default: true,
	},
	hasBackground: {
		type: 'boolean',
		default: false,
	},
}
