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
	const {
		isDynamic,
		isMultiline,
		...inputProps
	} = propsToPass

	const changeDynamicContent = typeof props.changeDynamicContent !== 'undefined'
		? props.changeDynamicContent
		: typeof props.onChange === 'undefined' ? onChange : props.onChange

	const dynamicContentProps = useDynamicContentControlProps( {
		value: typeof props.value === 'undefined' ? value : props.value,
		onChange: changeDynamicContent,
		isFormatType: props.isFormatType,
	} )

	const TextInput = isMultiline ? TextareaControl : TextControl

	return (
		<AdvancedControl { ...controlProps }>
			<DynamicContentControl
				enable={ isDynamic }
				{ ...dynamicContentProps }
			>
				<TextInput
					{ ...inputProps }
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
	isDynamic: false,
	isFormatType: true,

	value: undefined,
	onChange: undefined,
	// Allow custom onChange when dynamic content is changed.
	changeDynamicContent: undefined,
}

export default AdvancedTextControl
