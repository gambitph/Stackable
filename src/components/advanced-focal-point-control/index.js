/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'
import { useDynamicContent } from '../dynamic-content-control'

/**
 * WordPress dependencies
 */
import { FocalPointPicker } from '@wordpress/components'
import { memo } from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'

// This is only used for display purposes in the focal picker because it doesn't
// accept blank/empty string/null/undefined.
const FOCAL_DEFAULT_VALUE = { x: 0.5, y: 0.5 }

const AdvancedFocalPointControl = props => {
	const [ _value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	propsToPass.url = useDynamicContent( propsToPass.url )

	if ( ! propsToPass.url?.includes( 'http' ) ) {
		propsToPass.url = undefined
	}

	const value = typeof props.value === 'undefined' ? _value : props.value

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'stk-advanced-focal-point-control', props.className ) }
		>
			<FocalPointPicker
				{ ...propsToPass }
				value={ value || FOCAL_DEFAULT_VALUE }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ value }
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
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
}

export default memo( AdvancedFocalPointControl )
