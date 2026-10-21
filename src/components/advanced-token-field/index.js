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
import { getPropsWithDefaults } from '../../util/props'

const AdvancedTokenField = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, ADVANCED_TOKEN_FIELD_DEFAULT_PROPS )
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
				value={ inputValue || [] }
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

const ADVANCED_TOKEN_FIELD_DEFAULT_PROPS = {
	className: '',
	allowReset: true,
	default: '',

	attribute: '',

	value: undefined,
	onChange: undefined,
}

export default AdvancedTokenField
