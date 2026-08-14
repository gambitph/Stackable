module.exports = {
	preset: '@wordpress/jest-preset-default',
	rootDir: __dirname,

	setupFilesAfterEnv: [ '<rootDir>/src/test/setup-test-framework.js' ],

	// Overlay replaces the preset mapper, so keep the CSS stub plus Stackable aliases.
	moduleNameMapper: {
		'\\.(scss|css)$': require.resolve(
			'@wordpress/jest-preset-default/scripts/style-mock.js'
		),
		'^~stackable(.*)$': '<rootDir>/src$1',
		'.*\\.svg$': '<rootDir>/src/test/svgr-mock.js',
		'\\.(mp4|webm|png|jpg|jpeg|gif)$': '<rootDir>/src/test/file-stub.js',
		'^stackable$': '<rootDir>/src/test/stackable-mock.js',
		'@wordpress/api$': '<rootDir>/src/test/wp-api-stub.js',
		'@wordpress/ajax$': '<rootDir>/src/test/wp-admin-stub.js',
		'@wordpress/codeEditor$': '<rootDir>/src/test/wp-admin-stub.js',
		'@wordpress/plugins$': '<rootDir>/src/test/wp-admin-stub.js',
		'@wordpress/dom-ready$': '<rootDir>/src/test/dom-ready-stub.js',
	},

	testPathIgnorePatterns: [
		'/node_modules/',
		'<rootDir>/build/',
		'<rootDir>/dist/',
		'<rootDir>/e2e/',
		'<rootDir>/freemius/',
		'<rootDir>/pro__premium_only/',
		'<rootDir>/src/block/',
		'<rootDir>/src/deprecated/',
		'<rootDir>/src/test/',
		'<rootDir>/tools/',
	],
}
