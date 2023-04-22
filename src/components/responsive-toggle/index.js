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
import { useBlockAttributesContext, useDeviceType } from '~stackable/hooks'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'
import { dispatch } from '@wordpress/data'
import { isEmptyAttributes } from '~stackable/util'
import { upperFirst, camelCase } from 'lodash'

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

const ALL_HOVER = [ 'normal', 'hover', 'parent-hovered', 'collapsed' ]
const ALL_HOVER_ATTRIBUTE_SUFFIX = ALL_HOVER.filter( s => s !== 'normal' ).map( s => upperFirst( camelCase( s ) ) )

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

	const _screens = DEVICE_OPTIONS.filter( ( { value } ) => props.screens?.includes( value ) )

	const responsiveValues = useBlockAttributesContext( attributes => {
		if ( ! props.attribute ) {
			return {}
		}

		const tabletAttributes = [ attributes[ `${ props.attribute }Tablet` ] ]
		ALL_HOVER_ATTRIBUTE_SUFFIX.forEach( suffix => {
			tabletAttributes.push( attributes[ `${ props.attribute }Tablet${ suffix }` ] )
		} )

		const mobileAttributes = [ attributes[ `${ props.attribute }Mobile` ] ]
		ALL_HOVER_ATTRIBUTE_SUFFIX.forEach( suffix => {
			mobileAttributes.push( attributes[ `${ props.attribute }Mobile${ suffix }` ] )
		} )

		return {
			tablet: tabletAttributes,
			mobile: mobileAttributes,
		}
	} )

	// Add the hasValue option if the hover state is styled.
	const screens = _screens.map( option => {
		if ( option.value === 'desktop' ) {
			return option
		}

		let hasAttributeValue = false
		if ( props.attribute ) {
			hasAttributeValue = ! isEmptyAttributes( responsiveValues[ option.value ] )
		}

		const hasDeviceValue = option.value === 'desktop' ? false
			: option.value === 'tablet' ? props.hasTabletValue
				: props.hasMobileValue

		return {
			...option,
			hasValue: hasDeviceValue || hasAttributeValue,
		}
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
			onChange={ changeScreen }
		/>
	)
}

ResponsiveToggle.defaultProps = {
	screens: [ 'desktop' ],
	attribute: '',
	hasTabletValue: undefined, // If true, then the toggle for tablet will be highlighted to show that the tablet value has been set.
	hasMobileValue: undefined, // If true, then the toggle for mobile will be highlighted to show that the mobile value has been set.
}

export default memo( ResponsiveToggle )
