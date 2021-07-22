/**
 * Internal dependencies
 */
import { BaseControlMultiLabel, CodeTextarea } from '..'

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components'

const CodeTextareaControl = props => {
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'stk-code-textarea-control', props.className ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				screens={ props.screens }
			/>
			<CodeTextarea
				value={ props.value }
				onChange={ props.onChange }
			/>

		</BaseControl>
	)
}

CodeTextareaControl.defaultProps = {
	help: '',
	className: '',
	value: '',
	label: '',
	screens: [],
	onChange: () => {},
}

export default CodeTextareaControl
