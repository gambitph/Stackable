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
			description: 'disallow importing of the whole library in plugin admin',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/2333#user-content-no-import-stk-full-library',
		},
	},
	create: context => {
		const fullPath = context.getPhysicalFilename()
		return ( {
			ImportDeclaration: node => { // AST Node Type
				if ( node.source && node.source.type === 'Literal' ) {
					if ( fullPath.includes( '/src/welcome/' ) || fullPath.includes( '/src/admin/' ) ) {
						if ( node.source.value && node.source.value.startsWith( '~stackable/' ) ) {
							if ( node.source.value.match( /^~stackable\/[\w-]+\/?$/ ) ) {
								context.report( {
									node,
									message: 'Do not import the entire Stackable library via \'{{ identifier }}\', instead import only the component that you want to use via \'{{ identifier }}/the-component\'. See link for more details.',
									data: {
										identifier: node.source.value,
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
