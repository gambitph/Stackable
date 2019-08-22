/**
 * External dependencies
 */
import { getSelectedScreen } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { addAction, removeAction } from '@wordpress/hooks'
import {
	Children, cloneElement, Component, Fragment,
} from '@wordpress/element'
import { withInstanceId } from '@wordpress/compose'

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
		const { instanceId } = this.props
		addAction( 'stackable.responsive-toggle.screen.change', `stackable/when-responsive-screen-${ instanceId }`, this.onScreenChange )
	}

	componentWillUnmount() {
		const { instanceId } = this.props
		removeAction( 'stackable.responsive-toggle.screen.change', `stackable/when-responsive-screen-${ instanceId }` )
	}

	render() {
		const children = Children.toArray( this.props.children ).map( child => {
			return cloneElement( child, { screens: this.props.screens } )
		} )

		return (
			<Fragment>
				{ this.state.screen === this.props.screen && children }
			</Fragment>
		)
	}
}

WhenResponsiveScreen.defaultProps = {
	screen: 'desktop',
	screens: [ 'desktop', 'tablet', 'mobile' ],
}

export default withInstanceId( WhenResponsiveScreen )
