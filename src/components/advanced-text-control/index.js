/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'

/**
 * WordPress dependencies
 */
import { TextControl, TextareaControl } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'

const AdvancedTextControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )
	const dynamicContentProps = useDynamicContentControlProps( {
		...props,
		value: typeof props.value === 'undefined' ? value : props.value,
		onChange: typeof props.onChange === 'undefined' ? onChange : props.onChange,
		isFormatType: true,
	} )

	const TextInput = props.isMultiline ? TextareaControl : TextControl

	return (
		<AdvancedControl { ...controlProps }>
			<DynamicContentControl
				dynamic={ props.dynamic }
				{ ...dynamicContentProps }
			>
				<TextInput
					{ ...propsToPass }
					value={ typeof props.value === 'undefined' ? value : props.value }
					onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
					allowReset={ false }
					className={ classnames( propsToPass.className, 'ugb-advanced-text-control' ) }
				/>
			</DynamicContentControl>
			<ResetButton
				allowReset={ props.allowReset && ! props.dynamic }
				value={ typeof props.value === 'undefined' ? value : props.value }
				default={ props.default }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedTextControl.defaultProps = {
	isMultiline: false,
	allowReset: true,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,
	dynamic: false,

	value: undefined,
	onChange: undefined,
}

export default AdvancedTextControl
