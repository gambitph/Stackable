/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalLinkControl as _LinkControl } from '@wordpress/block-editor'
import { BaseControl as _BaseControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'

const LinkControl = props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )
	const {
		isDynamic,
		...inputProps
	} = propsToPass

	const value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	const dynamicContentProps = useDynamicContentControlProps( { value, onChange } )

	const classNames = classnames( [
		'stk-link-control',
		props.className,
	], {
		'stk--has-value': value,
	} )

	return (
		<AdvancedControl { ...controlProps } className={ classNames }>
			<DynamicContentControl
				type={ [ 'link', 'image-url' ] }
				enable={ isDynamic }
				hasFormat={ true }
				rawValue={ value }
				{ ...dynamicContentProps }
			>
				<div className="stk-link-control__input">
					<_LinkControl
						{ ...inputProps }
						value={ { url: value } }
						onChange={ ( { url } ) => onChange( url ) }
						settings={ [] } // The Url only.
						forceIsEditingLink={ ! value }
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
