/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	__experimentalLinkControl as _LinkControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/block-editor'
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
	const classNames = classnames( [
		'stk-link-control',
		props.className,
	] )
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	const value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	const dynamicContentProps = useDynamicContentControlProps( {
		...props, value, onChange,
	} )

	return (
		<AdvancedControl className={ classNames } { ...controlProps }>
			<DynamicContentControl
				type={ [ 'link', 'image-url' ] }
				dynamic={ props.dynamic }
				{ ...dynamicContentProps }
			>
				<div className="stk-link-control__input">
					<_LinkControl
						{ ...propsToPass }
						value={ { url: value } }
						onChange={ ( { url } ) => onChange( url ) }
						settings={ [] } // The Url only.
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
	dynamic: true,
	allowReset: true,
}

export default LinkControl
