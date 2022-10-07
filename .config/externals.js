/**
 * Utility methods for use when generating build configuration objects.
 */
const { join } = require( 'path' );

/**
 * Given a string, returns a new string with dash separators converted to
 * camel-case equivalent. This is not as aggressive as `_.camelCase`, which
 * which would also upper-case letters following numbers.
 *
 * @param {string} string Input dash-delimited string.
 *
 * @return {string} Camel-cased string.
 */
const camelCaseDash = string => string.replace(
	/-([a-z])/g,
	( match, letter ) => letter.toUpperCase()
);

/**
 * Define externals to load components through the wp global.
 */
const wpExternals = [
	'api',
	'api-fetch',
	'block-editor',
	'blocks',
	'components',
	'compose',
	'data',
	'date',
	'html-entities',
	'hooks',
	'element',
	'i18n',
	'plugins',
	'viewport',
	'ajax',
	'codeEditor',
	'rich-text',
	'url',
	'keyboard-shortcuts',
	'token-list',
	'keycodes',
	'escape-html'
].reduce( ( externals, name ) => ( {
	...externals,
	[ `@wordpress/${ name }` ]: `wp.${ camelCaseDash( name ) }`,
} ), {} );

/**
 * These are all the Stackable modules that are exported by our main script as
 * our API. Some scripts (like premium or deprecated code) will reference our
 * API externally.
 */
const stackableExternals = [
	'components',
	'block-components',
	'design-library',
	'higher-order',
	'hooks',
	'util',
	'icons',
].reduce( ( externals, name ) => ( {
	...externals,
	[ `~stackable/${ name }` ]: `stk.${ camelCaseDash( name ) }`,
} ), {} );

const externals = {
	wp: 'wp',
	lodash: 'lodash', // WP loads lodash already.
	stackable: 'stackable', // Our localized JS variable.
	fetch: 'fetch', // Used in our debugger sidebar.
	// react: 'wp.element', // Use the bundled React in Gutenberg. (not working see https://github.com/WordPress/gutenberg/issues/33674)
	'react-dom': 'wp.element', // Use the bundled ReactDom in Gutenberg.
	...wpExternals,
}

module.exports = {
	externals,
	stackableExternals,
};
