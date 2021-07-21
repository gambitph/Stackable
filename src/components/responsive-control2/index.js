/**
 * WordPress dependencies
 */
import {
	Children, cloneElement, Fragment,
} from '@wordpress/element'
import { useDeviceType } from '~stackable/hooks'

const ResponsiveControl2 = props => {
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

ResponsiveControl2.defaultProps = {
	screens: 'all',
	desktopProps: {},
	tabletProps: {},
	mobileProps: {},
}

export default ResponsiveControl2
