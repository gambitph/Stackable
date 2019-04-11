module.exports = {
	root: true,
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:jest/recommended',
	],
	rules: {
		// No semi-colons because they're a hassle.
		semi: ["error", "never"],

		// Only use parenthesis on arrow functions that need them since it's a hassle.
		'arrow-parens': ["error", "as-needed"],

		// Allow our deprecated properties since they're readable.
		camelcase: ["error", {
			allow: ["d?D?eprecated\\w+[_\\d]+", "opacityToClass\\w+[_\\d]+"]
		}],

		// Force destructuring assignments to be multiline if they have lots of variables.
		'object-curly-newline': ["error", {
			multiline: true,
			minProperties: 6,
			consistent: true
		}],

		// Allow assigning same named variables (mainly for function arguments) in inside code-blocks.
		'no-shadow': 'off',

		// For me it's easier to read nested ternary if you add some formatting.
		'no-nested-ternary': 'off',

		// Allow tabs and spaces mixed for aesthetics.
		'no-mixed-spaces-and-tabs': ["error", "smart-tabs"],

		// Sort to find stuff easier.
		'sort-imports': ["error", { "ignoreCase": true }],
		'sort-vars': ["error", { "ignoreCase": true }],
		// 'sort-keys': ["error", "asc", {caseSensitive: false, natural: true}],

		// Allow arrays to be consistently vertical or horizontal.
		'array-element-newline': ["error", "consistent"],
	},
	globals: {
		localStorage: true,
		Waypoint: true,
		shallow: true,
		btoa: true,
		alert: true,
		Element: true,
	}
};
