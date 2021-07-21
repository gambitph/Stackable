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
import {
	useCallback, memo, useMemo,
} from '@wordpress/element'
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

	const changeScreen = useCallback( screen => {
		const {
			__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		} = dispatch( 'core/edit-post' )

		setPreviewDeviceType( DEVICE_TYPES[ screen ] )
	}, [] )

	const screens = useMemo( () => {
		return DEVICE_OPTIONS.filter( ( { value } ) => props.screens?.includes( value ) )
	}, [ props.screens ] )

	if ( screens <= 1 ) {
		return null
	}

	return (
		<ControlIconToggle
			className="stk-control-responsive-toggle"
			value={ deviceType.toLowerCase() }
			options={ screens }
			onChange={ screen => changeScreen( screen ) }
		/>
	)
}

ResponsiveToggle.defaultProps = {
	screens: [ 'desktop' ],
}

export default memo( ResponsiveToggle )
