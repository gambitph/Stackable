import { addAction, removeAction } from '@wordpress/hooks'
import { Component, Fragment } from '@wordpress/element'
import { getSelectedScreen } from '@stackable/util'
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
		return (
			<Fragment>
				{ this.state.screen === this.props.screen && this.props.children }
			</Fragment>
		)
	}
}

WhenResponsiveScreen.defaultProps = {
	screen: 'desktop',
}

export default withInstanceId( WhenResponsiveScreen )
