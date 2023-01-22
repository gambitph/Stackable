/**
 * Using `const { foo } = useDispatch( 'core/bar' )` in a component can cause rerenders. Instead, just call the `dispatch` directly `dispatch( 'core/bar' ).foo()` where you are going to call the function.
 *
 * ```js
 * // const { __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' )
 * // __unstableMarkNextChangeAsNotPersistent()
 * // New usage
 * dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
 * ```
 *
 * @see https://github.com/gambitph/Stackable/pull/2333#user-content-no-use-dispatch
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow useDispatch hook',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/2446#user-content-no-use-block-attributes',
		},
	},
	create: context => ( {
		CallExpression: node => { // AST Node Type
			if ( node.callee.name === 'useBlockAttributes' ) {
				context.report( node, 'Do not use `const { foo } = useDispatch( \'core/bar\' )`, call the dispatched function directly `dispatch( \'core/bar\' ).foo()` instead. See link for more details.' )
			}
		},
	} ),
}
