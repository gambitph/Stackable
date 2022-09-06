module.exports = {
	rules: {
		'no-update-block-attributes': require( './rules/no-update-block-attributes' ),
		'no-use-block-attributes': require( './rules/no-use-block-attributes' ),
		'no-import-stk-full-library': require( './rules/no-import-stk-full-library' ),
		'no-import-use-stk-api': require( './rules/no-import-use-stk-api' ),
		'no-deprecated-use-styles': require( './rules/no-deprecated-use-styles' ),
	},
	configs: {
		recommended: {
			plugins: [
				'stackable',
			],
			rules: {
				'stackable/no-update-block-attributes': 'error',
				'stackable/no-use-block-attributes': 'error',
				'stackable/no-import-stk-full-library': 'error',
				'stackable/no-import-use-stk-api': 'error',
				'stackable/no-deprecated-use-styles': 'error',
			},
		},
	},
}

