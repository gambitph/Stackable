/**
 * Internal dependencies
 */
import { RuleTester } from 'eslint'
import rule from '../no-function-default-props'

const ruleTester = new RuleTester( {
	parser: require.resolve( 'babel-eslint' ),
	parserOptions: {
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
} )

ruleTester.run( 'no-function-default-props', rule, {
	valid: [
		`class Button {}
Button.defaultProps = { label: '' }`,
		`class Button {
	static defaultProps = { label: '' }
}`,
		'const value = WrappedComponent.defaultProps || {}',
		`const Button = forwardRef( props => props.label )
Button.defaultProps = { label: '' }`,
	],
	invalid: [
		{
			code: `const LinkControl = props => null
LinkControl.defaultProps = { screens: [ 'desktop' ] }`,
			errors: [ { messageId: 'noFunctionDefaultProps' } ],
		},
		{
			code: `function LinkControl( props ) {
	return props.label
}
LinkControl.defaultProps = { label: '' }`,
			errors: [ { messageId: 'noFunctionDefaultProps' } ],
		},
		{
			code: `const LinkControl = function( props ) {
	return props.label
}
LinkControl.defaultProps = { label: '' }`,
			errors: [ { messageId: 'noFunctionDefaultProps' } ],
		},
	],
} )
