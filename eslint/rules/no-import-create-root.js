/**
 * `wp.element.render` has been deprecated in WP 6.2 and was replaced by
 * `wp.element.createRoot`. In order to preserve backward compatibility of
 * Stackable with 6.0 and 6.1, we need to stub `createRoot` to fallback to using
 * `wp.element.render` internally.
 *
 * ```js
 * // Invalid:
 * // import { createRoot } from '@wordpress/element'
 *
 * // Valid:
 * import { createRoot } from '~stackable/util'
 * import { createRoot } from '~stackable/util/element'
 *
 * @see
 * https://github.com/gambitph/Stackable/pull/2856#user-content-no-import-create-root
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow using of wp.element.createRoot',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/2856#user-content-no-import-create-root',
		},
	},
	create: context => {
		return ( {
			ImportDeclaration: node => { // AST Node Type
				if ( node.source && node.source.type === 'Literal' && node.source.value === '@wordpress/element' ) {
					node.specifiers.some( specifier => {
						if ( specifier.imported.name === 'createRoot' ) {
							context.report( {
								node,
								message: 'Do not import \'{{ identifier }}\' from \'{{ source }}\', instead import \'{{ identifier }}\' from \'{{ stackableSource }}\'. See link for more details.',
								data: {
									identifier: specifier.imported.name,
									source: node.source.value,
									stackableSource: '~stackable/util',
								},
							} )
							return true
						}
						return false
					} )
				}
			},
		} )
	},
}
