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

export const ResetButton = props => {
	const showReset = props.showReset !== null
		? props.showReset
		: ( typeof props.value !== 'undefined' && props.value !== props.default && props.value !== props.placeholder )

	return ( props.allowReset && showReset &&
		<Button
			className="stk-control__reset-button"
			isSmall
			isTertiary
			aria-label={ __( 'Reset', i18n ) }
			onClick={ () => props.onChange( typeof props.default === 'undefined' ? '' : props.default ) }
			icon={ <Dashicon icon="image-rotate" /> }
		/>
	)
}

ResetButton.defaultProps = {
	allowReset: true,
	showReset: null,
	value: '',
	default: '',
	onChange: null,
}
