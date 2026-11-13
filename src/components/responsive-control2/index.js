/**
 * WordPress dependencies
 */
import {
	Children, cloneElement, Fragment,
} from '@wordpress/element'
import { useDeviceType } from '~stackable/hooks'
import { getPropsWithDefaults } from '../../util/props'

const ResponsiveControl2 = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, RESPONSIVE_CONTROL2_DEFAULT_PROPS )
	const deviceType = useDeviceType()

	return (
		<Fragment>
			{ Children.toArray( props.children ).map( child => {
				return cloneElement( child, {
					screens: props.screens,
					...props[ deviceType.toLowerCase() + 'Props' ],
				} )
			} ) }
		</Fragment>
	)
}

const RESPONSIVE_CONTROL2_DEFAULT_PROPS = {
	screens: 'all',
	desktopProps: {},
	tabletProps: {},
	mobileProps: {},
}

export default ResponsiveControl2
