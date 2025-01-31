/**
 * Internal dependencies
 */
import { useInternalValue } from '~stackable/hooks'
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

	// Track the value internally, because if not the value will be updated on
	// every render and will make the cursor jump to the end.
	const [ internalValue, setInternalValue ] = useInternalValue( typeof props.value === 'undefined' ? value : props.value )
	const _onChange = typeof props.onChange === 'undefined' ? onChange : props.onChange
	const internalOnChange = value => {
		setInternalValue( value )
		_onChange( value )
	}

	const TextInput = isMultiline ? TextareaControl : TextControl

	return (
		<AdvancedControl
			className={ props.className }
			{ ...controlProps }
		>
			<DynamicContentControl
				enable={ isDynamic }
				hasPanelModifiedIndicator={ props.hasPanelModifiedIndicator }
				{ ...dynamicContentProps }
			>
				<TextInput
					{ ...inputProps }
					value={ internalValue }
					onChange={ internalOnChange }
					className={ classnames( propsToPass.className, 'ugb-advanced-text-control' ) }
				/>
			</DynamicContentControl>
			<ResetButton
				allowReset={ allowReset && ! props.isDynamic }
				value={ internalValue }
				default={ props.default }
				onChange={ internalOnChange }
				hasPanelModifiedIndicator={ props.hasPanelModifiedIndicator }
			/>
		</AdvancedControl>
	)
}, isEqual )

AdvancedTextControl.defaultProps = {
	className: '',
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

	hasPanelModifiedIndicator: true,
}

export default AdvancedTextControl
