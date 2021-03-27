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

const WhenResponsiveScreen = props => {
	const deviceType = useDeviceType()

	const children = Children.toArray( props.children ).map( child => {
		return cloneElement( child, { screens: props.screens, screen: deviceType.toLowerCase() } )
	} )

	// If this is the currently selected screen.
	const isCurrentScreen = deviceType.toLowerCase() === props.screen

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

WhenResponsiveScreen.defaultProps = {
	screen: 'desktop',
	screens: [ 'desktop', 'tablet', 'mobile' ],
}

export default WhenResponsiveScreen
