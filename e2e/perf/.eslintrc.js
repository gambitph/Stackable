/**
 * The perf suite is Playwright + Node scripts, not Jest:
 * - Playwright's expect() takes a message as its second argument, and
 *   test.skip( condition, reason ) is how specs opt out of a mode.
 * - The visual/ and ci helpers are command-line tools that report with console.
 * - WordPress option and Freemius field names are snake_case.
 */
module.exports = {
	env: { node: true },
	rules: {
		'jest/valid-expect': 'off',
		'jest/no-disabled-tests': 'off',
		'no-console': 'off',
		camelcase: [ 'error', { properties: 'never', ignoreDestructuring: true } ],
	},
}
