/**
 * We used to use `updateBlockAttributes( clientId, ... )` to update block attributes from different areas of the code. We did this because we didn't want to get tied up with passing `props.setAttributes` all over. However, this function is slow and causes unnecessary rerenders.
 *
 * The correct way to set an attribute is to either:
 * 1. use `props.setAttributes` if setting from `edit.js` of a block, or
 * 2. from when deep inside a block setting/inspector, use `useBlockSetAttributesContext()`
 *
 * ```
 * // This exposes the block's `props.setAttributes`
 * const setAttributes = useBlockSetAttributesContext()
 * setAttributes( { ... } )
 * ```
 *
 * The context requires that the block should be using the `withBlockAttributeContext` HOC
 *
 * @see https://github.com/gambitph/Stackable/pull/2333#user-content-no-update-block-attributes
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow updateBlockAttributes from dispatch',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/2333#user-content-no-update-block-attributes',
		},
	},
	create: context => ( {
		CallExpression: node => { // AST Node Type
			if ( node.callee.name === 'updateBlockAttributes' ) {
				context.report( node, 'Do not use `updateBlockAttributes( clientId, {} )`, use the Edit\'s `props.setAttributes` function directly, or the context `const setAttributes = useBlockSetAttributesContext()` instead. See link for more details.' )
			}
		},
	} ),
}
