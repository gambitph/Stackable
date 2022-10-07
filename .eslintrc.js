module.exports = {
	root: true,
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended-with-formatting',
		'plugin:jest/recommended',
		'plugin:compat/recommended',
		'plugin:stackable/recommended',
	],
	env: {
		browser: true,
	},
	rules: {
		// No semi-colons because they're a hassle.
		semi: [ 'error', 'never' ],

		// Only use parenthesis on arrow functions that need them since it's a hassle.
		'arrow-parens': [ 'error', 'as-needed' ],

		// Allow our deprecated properties since they're readable.
		camelcase: [ 'error', {
			allow: [ '\\w+(_\\d+)+' ],
		} ],

		// Force destructuring assignments to be multiline if they have lots of variables.
		'object-curly-newline': [ 'error', {
			ObjectExpression: {
				multiline: true,
				minProperties: 3,
				consistent: true,
			},
			ObjectPattern: {
				multiline: true,
				minProperties: 3,
				consistent: true,
			},
			// Force strict formatting on import/export
			ImportDeclaration: {
				multiline: true,
				minProperties: 3,
				consistent: false,
			},
			ExportDeclaration: {
				multiline: true,
				minProperties: 3,
				consistent: false,
			},
		} ],

		// Allow assigning same named variables (mainly for function arguments) in inside code-blocks.
		'no-shadow': 'off',

		// For me it's easier to read nested ternary if you add some formatting.
		'no-nested-ternary': 'off',

		// Allow tabs and spaces mixed for aesthetics.
		'no-mixed-spaces-and-tabs': [ 'error', 'smart-tabs' ],

		// Sort to find stuff easier.
		'sort-vars': [ 'error', { ignoreCase: true } ],
		// 'sort-keys': ["error", "asc", {caseSensitive: false, natural: true}],

		// Allow arrays to be consistently vertical or horizontal.
		'array-element-newline': [ 'error', 'consistent' ],

		// We know what we're doing.
		'@wordpress/valid-sprintf': 'off',

		// Off since returning false positives.
		'@wordpress/no-unused-vars-before-return': 'off',

		'jsdoc/no-undefined-types': 'off',

		'@wordpress/no-unguarded-get-range-at': 'off',

		// LF style line breaks.
		'linebreak-style': [ 'error', 'unix' ],

		// Turn this off since it's showing errors when optional chaining "?."
		'no-unused-expressions': 'off',

		// Fix some import errors.
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',

		// We will use dynamic text domain.
		'@wordpress/i18n-text-domain': 'off',

		// No translator comments.
		'@wordpress/i18n-translator-comments': 'off',

		// We use our own BaseControl.
		'@wordpress/no-base-control-with-label-without-id': 'off',

		// In array spread, ignore unused args if they start with _
		// e.g. const [ _unused, used ] = [ 'a', 'b', 'c' ]
		'no-unused-vars': [ 'error', { varsIgnorePattern: '^_' } ],

		// Require tabbed indentation in jsx.
		'react/jsx-indent': [ 2, 'tab', { indentLogicalExpressions: true } ],
	},
	globals: {
		localStorage: true,
		fetch: true,
		Waypoint: true,
		shallow: true,
		btoa: true,
		alert: true,
		Element: true,
		FileReader: true,
		MutationObserver: true,
		IntersectionObserver: true,
	},
}
