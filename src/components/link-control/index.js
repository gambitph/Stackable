/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { URLInput } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'
import {
	isValidLinkValue,
	normalizeLinkValue,
} from './validate'

const LinkControl = props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )
	const {
		isDynamic,
		showSuggestions,
		...inputProps
	} = propsToPass

	const value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange
	const urlError = value && ! isValidLinkValue( value )
		? __( 'Please enter a valid URL.', i18n )
		: ''

	const dynamicContentProps = useDynamicContentControlProps( { value, onChange } )

	const classNames = classnames( [
		'stk-link-control',
		props.className,
	], {
		'stk--has-value': value,
		'stk-link-control--invalid': urlError,
	} )

	const handleBlur = () => {
		const normalized = normalizeLinkValue( value )
		if ( normalized !== value ) {
			onChange( normalized )
		}
	}

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classNames }
			help={ urlError || controlProps.help }
		>
			<DynamicContentControl
				type={ [ 'link', 'image-url' ] }
				enable={ isDynamic }
				{ ...dynamicContentProps }
			>
				<div
					className="stk-link-control__input"
					onBlur={ handleBlur }
				>
					<URLInput
						{ ...inputProps }
						value={ value }
						onChange={ onChange }
						disableSuggestions={ ! showSuggestions }
						autoFocus={ false } // eslint-disable-line
					/>
				</div>
			</DynamicContentControl>
			<ResetButton
				allowReset={ props.allowReset && ! props.dynamic }
				value={ value }
				onChange={ () => onChange( '' ) }
			/>
		</AdvancedControl>
	)
}

LinkControl.defaultProps = {
	className: '',
	label: '',
	screens: [ 'desktop' ],
	help: '',
	value: undefined,
	onChange: undefined,
	showSuggestions: true,
	isDynamic: true,
	allowReset: true,
}

export default LinkControl
