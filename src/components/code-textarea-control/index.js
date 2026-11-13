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
import { getPropsWithDefaults } from '../../util/props'

const CodeTextareaControl = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, CODE_TEXTAREA_CONTROL_DEFAULT_PROPS )
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'stk-code-textarea-control', props.className ) }
			__nextHasNoMarginBottom
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

const CODE_TEXTAREA_CONTROL_DEFAULT_PROPS = {
	help: '',
	className: '',
	value: '',
	label: '',
	screens: [],
	onChange: () => {},
}

export default CodeTextareaControl
