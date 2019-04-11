import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withMainClassname = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		render() {
			const className = classnames( [
				this.props.className,
				this.props.name.replace( /\//g, '-' ),
			] )

			return (
				<WrappedComponent { ...this.props } className={ className } />
			)
		}
	},
	'withMainClassname'
)

export default withMainClassname
