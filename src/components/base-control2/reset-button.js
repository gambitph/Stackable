/**
 * External dependencies
 */
import Button from '../button'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Dashicon } from '@wordpress/components'
import { memo } from '@wordpress/element'
import classNames from 'classnames'

const icon = <Dashicon icon="image-rotate" />

export const ResetButton = memo( props => {
	const showReset = props.showReset !== null
		? props.showReset
		: ( typeof props.value !== 'undefined' && props.value !== props.default && props.value !== props.placeholder )

	const onChange = () => {
		props.onChange( typeof props.default === 'undefined' ? '' : props.default )
	}

	const className = classNames( [
		'stk-control__reset-button',
		{ 'stk-control__reset-button--no-modified': ! props.hasPanelModifiedIndicator },
	] )

	return ( props.allowReset && showReset &&
		<Button
			className={ className }
			isSmall
			isTertiary
			aria-label={ __( 'Reset', i18n ) }
			onClick={ onChange }
			icon={ icon }
		/>
	)
} )

ResetButton.defaultProps = {
	allowReset: true,
	showReset: null,
	value: '',
	default: '',
	onChange: null,
	hasPanelModifiedIndicator: true, // If false, then even if this has a value, it won't show the modified indicator in the parent panel.
}
