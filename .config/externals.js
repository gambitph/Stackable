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
const externals = [
	'api-fetch',
	'block-editor',
	'blocks',
	'components',
	'compose',
	'data',
	'date',
	'htmlEntities',
	'hooks',
	'edit-post',
	'element',
	'editor',
	'i18n',
	'plugins',
	'viewport',
	'ajax',
	'codeEditor',
].reduce( ( externals, name ) => ( {
	...externals,
	[ `@wordpress/${ name }` ]: `wp.${ camelCaseDash( name ) }`,
} ), {
	wp: 'wp',
	lodash: 'lodash', // WP loads lodash already.
	stackable: 'stackable', // Our localized JS variable.
} );

module.exports = externals;
