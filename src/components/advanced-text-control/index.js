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
import { memo } from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { isEqual } from 'lodash'

const AdvancedTextControl = memo( props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )
	const {
		isDynamic,
		isMultiline,
		changeDynamicContent: _changeDynamicContent,
		allowReset,
		isFormatType,
		...inputProps
	} = propsToPass

	const changeDynamicContent = typeof _changeDynamicContent !== 'undefined'
		? _changeDynamicContent
		: typeof props.onChange === 'undefined' ? onChange : props.onChange

	const dynamicContentProps = useDynamicContentControlProps( {
		value: typeof props.value === 'undefined' ? value : props.value,
		onChange: changeDynamicContent,
		isFormatType,
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
					className={ classnames( propsToPass.className, 'ugb-advanced-text-control' ) }
				/>
			</DynamicContentControl>
			<ResetButton
				allowReset={ allowReset && ! props.dynamic }
				value={ typeof props.value === 'undefined' ? value : props.value }
				default={ props.default }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
		</AdvancedControl>
	)
}, isEqual )

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
