/**
 * In `src/welcome` and `src/admin`, importing the base module/library via `~stackable/components` will unnecessarily import the entire library and will dramatically increase the compiled script. Instead, import the component that's needed directly:
 *
 * ```js
 * // Invalid:
 * // import { AdminToggleSetting } from '~stackable/components'
 *
 * // Valid:
 * import AdminToggleSetting from '~stackable/components/admin-toggle-setting'
 * ```
 *
 * @see https://github.com/gambitph/Stackable/pull/2333#user-content-no-import-stk-full-library
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow using of wp.element.createRoot',
			recommended: true,
			// url: 'https://github.com/gambitph/Stackable/pull/2333#user-content-no-import-stk-full-library',
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
