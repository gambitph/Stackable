/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'

/**
 * WordPress dependencies
 */
import { FormTokenField } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'

const AdvancedTokenField = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ propsToPass, controlProps ] = extractControlProps( props )
	const {
		...selectProps
	} = propsToPass

	const inputValue = typeof props.value === 'undefined' ? value : props.value
	const inputOnChange = typeof props.onChange === 'undefined' ? onChange : props.onChange

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'stk-advanced-token-field', props.className ) }
		>
			<FormTokenField
				{ ...selectProps }
				value={ inputValue }
				onChange={ inputOnChange }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ inputValue }
				default={ props.default }
				onChange={ inputOnChange }
			/>
		</AdvancedControl>
	)
}

AdvancedTokenField.defaultProps = {
	className: '',
	allowReset: true,
	default: '',

	attribute: '',

	value: undefined,
	onChange: undefined,
}

export default AdvancedTokenField
