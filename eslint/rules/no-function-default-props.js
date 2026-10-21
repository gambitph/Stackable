/**
 * React 19 ignores `defaultProps` on function components. The component then
 * reads `undefined` and can crash, which is what `props.tabs.includes` did
 * in the inspector tabs.
 *
 * Class components may still set `defaultProps`. React 19 still applies those.
 *
 * @see https://github.com/gambitph/Stackable/pull/3767
 */
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow defaultProps on function components',
			recommended: true,
			url: 'https://github.com/gambitph/Stackable/pull/3767',
		},
		messages: {
			noFunctionDefaultProps: 'Do not set defaultProps on a function component. React 19 ignores them, so the defaults never apply. Pass the defaults as function arguments, or use getPropsWithDefaults().',
		},
		schema: [],
	},
	create: context => {
		const isDefaultPropsMember = node => {
			if ( ! node || node.type !== 'MemberExpression' || node.computed ) {
				return false
			}
			const property = node.property
			return ( property.type === 'Identifier' && property.name === 'defaultProps' ) ||
				( property.type === 'Literal' && property.value === 'defaultProps' )
		}

		const findVariable = name => {
			let scope = context.getScope()
			while ( scope ) {
				const variable = scope.set && scope.set.get( name )
				if ( variable ) {
					return variable
				}
				scope = scope.upper
			}
			return null
		}

		// True only when the name is a function or an arrow function.
		// Classes, imports, and higher-order wrappers are left alone.
		const isFunctionComponent = name => {
			const variable = findVariable( name )
			if ( ! variable ) {
				return false
			}
			return variable.defs.some( def => {
				if ( def.type === 'FunctionName' ) {
					return true
				}
				if ( def.type !== 'Variable' || ! def.node || ! def.node.init ) {
					return false
				}
				const initType = def.node.init.type
				return initType === 'ArrowFunctionExpression' || initType === 'FunctionExpression'
			} )
		}

		return {
			AssignmentExpression: node => {
				if ( ! isDefaultPropsMember( node.left ) || node.left.object.type !== 'Identifier' ) {
					return
				}
				if ( ! isFunctionComponent( node.left.object.name ) ) {
					return
				}
				context.report( {
					node,
					messageId: 'noFunctionDefaultProps',
				} )
			},
		}
	},
}
