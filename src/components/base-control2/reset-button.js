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
import classnames from 'classnames'
import { getPropsWithDefaults } from '../../util/props'

const icon = <Dashicon icon="image-rotate" />

export const ResetButton = memo( incomingProps => {
	const props = getPropsWithDefaults( incomingProps, RESET_BUTTON_DEFAULT_PROPS )
	const showReset = props.showReset !== null
		? props.showReset
		: ( typeof props.value !== 'undefined' && props.value !== props.default && props.value !== props.placeholder )

	const onChange = () => {
		props.onChange( typeof props.default === 'undefined' ? '' : props.default )
	}

	const className = classnames( [
		'stk-control__reset-button',
		{ 'stk-control__reset-button--no-modified': ! props.hasPanelModifiedIndicator },
	] )

	return ( props.allowReset && showReset &&
		<Button
			className={ className }
			isSmall
			isTertiary
			label={ __( 'Reset', i18n ) }
			onClick={ onChange }
			icon={ icon }
		/>
	)
} )

const RESET_BUTTON_DEFAULT_PROPS = {
	allowReset: true,
	showReset: null,
	value: '',
	default: '',
	onChange: null,
	hasPanelModifiedIndicator: true, // If false, then even if this has a value, it won't show the modified indicator in the parent panel.
}
