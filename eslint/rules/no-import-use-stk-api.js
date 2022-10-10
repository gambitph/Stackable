/**
 * Stackable exposes its component library in `window.stk`, this is aliased as `~stackable/*`. For scripts other than the main script, use aliased imports to use this library.
 *
 * ```js
 * // Invalid
 * // import SortControl from '~stackable/components/sort-control'
 *
 * // Valid
 * import { SortControl } from '~stackable/components'
 * ```
 *
 * @see https://github.com/gambitph/Stackable/pull/2333#user-content-no-import-use-stk-api
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow embedding of individual components, use the exposed Stackable library instead',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/2333#user-content-no-import-use-stk-api',
		},
	},
	create: context => {
		const fullPath = context.getPhysicalFilename()
		return ( {
			ImportDeclaration: node => { // AST Node Type
				if ( node.source && node.source.type === 'Literal' ) {
					if ( fullPath.includes( '/pro__premium_only/src/' ) && ! fullPath.includes( '/pro__premium_only/src/deprecated/' ) && ! fullPath.includes( '/pro__premium_only/src/welcome/' ) && ! fullPath.includes( '/pro__premium_only/src/admin/' ) ) {
						if ( node.source.value && node.source.value.startsWith( '~stackable/' ) ) {
							if ( node.source.value.match( /^~stackable\/[\w-]+\// ) ) {
								context.report( {
									node,
									message: 'Do not import Stackable components directly, use the exposed Stackable library via \'{{ identifier }}\', instead import only the component that you want to use via \'{{ identifier }}\'. See link for more details.',
									data: {
										identifier: node.source.value.replace( /^(~stackable\/[\w-]+).*$/, '$1' ),
									},
								} )
							}
						}
					}
				}
			},
		} )
	},
}
