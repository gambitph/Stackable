/**
 * Internal dependencies
 */
import SVGDesktop from './images/desktop.svg'
import SVGMobile from './images/mobile.svg'
import SVGTablet from './images/tablet.svg'
import ControlIconToggle from '../control-icon-toggle'

/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'
import { dispatch } from '@wordpress/data'

const DEVICE_TYPES = {
	desktop: 'Desktop',
	tablet: 'Tablet',
	mobile: 'Mobile',
}

const DEVICE_OPTIONS = [
	{
		label: __( 'Desktop', i18n ),
		value: 'desktop',
		icon: <SVGDesktop />,
	},
	{
		label: __( 'Tablet', i18n ),
		value: 'tablet',
		icon: <SVGTablet />,
	},
	{
		label: __( 'Mobile', i18n ),
		value: 'mobile',
		icon: <SVGMobile />,
	},
]

const ResponsiveToggle = props => {
	const deviceType = useDeviceType()

	const changeScreen = screen => {
		// In some editors, there is no edit-post / preview device type. If that
		// happens, we just set our own internal device type.
		if ( dispatch( 'core/edit-site' ) ) {
			dispatch( 'core/edit-site' ).__experimentalSetPreviewDeviceType( DEVICE_TYPES[ screen ] )
		} else if ( dispatch( 'core/edit-post' ) ) {
			dispatch( 'core/edit-post' ).__experimentalSetPreviewDeviceType( DEVICE_TYPES[ screen ] )
		} else {
			dispatch( 'stackable/device-type' ).setDeviceType( DEVICE_TYPES[ screen ] )
		}
	}

	const screens = DEVICE_OPTIONS.filter( ( { value } ) => props.screens?.includes( value ) )

	if ( screens <= 1 ) {
		return null
	}

	// In the Widget editor, the device type is always set to desktop.
	if ( ! deviceType ) {
		return null
	}

	return (
		<ControlIconToggle
			className="stk-control-responsive-toggle"
			value={ deviceType.toLowerCase() }
			options={ screens }
			onChange={ changeScreen }
		/>
	)
}

ResponsiveToggle.defaultProps = {
	screens: [ 'desktop' ],
}

export default memo( ResponsiveToggle )
