/**
 * External dependencies
 */
import { getSelectedScreen } from '~stackable/util'
import { lowerCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { addAction, removeAction } from '@wordpress/hooks'
import {
	Children, cloneElement, Component, Fragment,
} from '@wordpress/element'
import { withInstanceId } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

class WhenResponsiveScreen extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			screen: getSelectedScreen(),
		}
		this.onScreenChange = this.onScreenChange.bind( this )
	}

	onScreenChange( screen ) {
		this.setState( { screen } )
	}

	componentDidMount() {
		const { instanceId, previewDeviceType } = this.props
		if ( ! previewDeviceType ) {
			// Add action hooks for WP <= 5.4.
			addAction( 'stackable.responsive-toggle.screen.change', `stackable/when-responsive-screen-${ instanceId }`, this.onScreenChange )
		}
	}

	componentWillUnmount() {
		const { instanceId, previewDeviceType } = this.props
		if ( ! previewDeviceType ) {
			// Add action hooks for WP <= 5.4.
			removeAction( 'stackable.responsive-toggle.screen.change', `stackable/when-responsive-screen-${ instanceId }` )
		}
	}

	render() {
		const screen = this.props.previewDeviceType || this.state.screen
		const children = Children.toArray( this.props.children ).map( child => {
			return cloneElement( child, { screens: this.props.screens, screen } )
		} )

		// If this is the currently selected screen.
		const isCurrentScreen = screen === this.props.screen

		// If there is no screen available, then just show the desktop. For
		// example, if only desktop & tablet are assigned to the screens prop,
		// and we're currently showing the mobile screen option, since there's
		// no option available, then just show the desktop screen option.
		const isNoScreen = ! this.props.screens.includes( this.state.screen ) && ! isCurrentScreen && this.props.screen === 'desktop'

		return (
			<Fragment>
				{ ( isCurrentScreen || isNoScreen ) && children }
			</Fragment>
		)
	}
}

WhenResponsiveScreen.defaultProps = {
	screen: 'desktop',
	screens: [ 'desktop', 'tablet', 'mobile' ],
}

export default withSelect( select => ( {
	previewDeviceType: select( 'core/edit-post' ).__experimentalGetPreviewDeviceType && lowerCase( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType() ),
} ) )( withInstanceId( WhenResponsiveScreen ) )
