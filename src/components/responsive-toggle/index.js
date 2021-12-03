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
import { getAttributeName, isEmptyAttribute } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	useCallback, memo, useMemo,
} from '@wordpress/element'
import { dispatch } from '@wordpress/data'
import { HOVER_OPTIONS } from '../base-control2/hover-state-toggle'

const DEVICE_TYPES = {
	desktop: 'Desktop',
	tablet: 'Tablet',
	mobile: 'Mobile',
}

const HOVER_STATES = HOVER_OPTIONS.map( ( { value } ) => value )

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

	const _screens = useMemo( () => {
		return DEVICE_OPTIONS.filter( ( { value } ) => props.screens?.includes( value ) )
	}, [ props.screens ] )

	// Add the hasValue option if the hover state is styled.
	const screens = _screens.map( option => {
		if ( option.value === 'desktop' ) {
			return option
		}

		if ( props.attribute && props.attributes ) {
			const hasValue = HOVER_STATES.some( hoverState => {
				const value = props.attributes[ getAttributeName( props.attribute, option.value, hoverState ) ]
				return ! isEmptyAttribute( value )
			} )
			return {
				...option,
				hasValue,
			}
		}

		return option
	} )

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
			onChange={ screen => changeScreen( screen ) }
		/>
	)
}

ResponsiveToggle.defaultProps = {
	screens: [ 'desktop' ],
}

export default memo( ResponsiveToggle )
