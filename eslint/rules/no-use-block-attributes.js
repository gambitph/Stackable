/**
 * We used to use `useBlockAttributes` to grab the attributes of the block from deep inside the block - which is slow.
 *
 * Instead, use the context:
 *
 * ```js
 * // This exposes the block's `props.attributes`
 * const attributes = useBlockAttributesContext()
 * ```
 *
 * The context requires that the block should be using the `withBlockAttributeContext` HOC. *
 *
 * @see https://github.com/gambitph/Stackable/pull/2333#user-content-no-use-block-attributes
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow useBlockAttributes hook',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/2333#user-content-no-use-block-attributes',
		},
	},
	create: context => ( {
		CallExpression: node => { // AST Node Type
			if ( node.callee.name === 'useBlockAttributes' ) {
				context.report( node, 'Do not use `useBlockAttributes( clientId )` to get the block attributes, use `useBlockAttributesContext()` hook instead. See link for more details.' )
			}
		},
	} ),
}
