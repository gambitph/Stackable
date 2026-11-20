/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	Children, cloneElement, Fragment,
} from '@wordpress/element'
import { getPropsWithDefaults } from '../../util/props'

const WhenResponsiveScreen = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, WHEN_RESPONSIVE_SCREEN_DEFAULT_PROPS )
	const deviceType = useDeviceType()

	const children = Children.toArray( props.children ).map( child => {
		return cloneElement( child, { screens: props.screens, screen: deviceType.toLowerCase() } )
	} )

	// If this is the currently selected screen.
	const isCurrentScreen = !! deviceType
		? ( deviceType?.toLowerCase() === props.screen ) // If there's a device type, check if it's the current screen.
		: props.screen.toLowerCase() === 'desktop' // If there's no device type, then only show desktop.

	// If there is no screen available, then just show the desktop. For
	// example, if only desktop & tablet are assigned to the screens prop,
	// and we're currently showing the mobile screen option, since there's
	// no option available, then just show the desktop screen option.
	const isNoScreen = ! props.screens.includes( deviceType.toLowerCase() ) && ! isCurrentScreen && deviceType === 'Desktop'

	return (
		<Fragment>
			{ ( isCurrentScreen || isNoScreen ) && children }
		</Fragment>
	)
}

const WHEN_RESPONSIVE_SCREEN_DEFAULT_PROPS = {
	screen: 'desktop',
	screens: [ 'desktop', 'tablet', 'mobile' ],
}

export default WhenResponsiveScreen
