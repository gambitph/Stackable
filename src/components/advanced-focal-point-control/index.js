/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'

/**
 * WordPress dependencies
 */
import { FocalPointPicker } from '@wordpress/components'
import { memo } from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'

const AdvancedFocalPointControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'stk-advanced-focal-point-control', props.className ) }
		>
			<FocalPointPicker
				{ ...propsToPass }
				value={ typeof props.value === 'undefined' ? value : props.value }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ typeof props.value === 'undefined' ? value : props.value }
				default={ props.default }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedFocalPointControl.defaultProps = {
	className: '',
	url: '',

	allowReset: true,
	default: '',

	attribute: '',

	value: undefined,
	onChange: undefined,
}

export default memo( AdvancedFocalPointControl )
