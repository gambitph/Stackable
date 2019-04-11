import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withMainClassname = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		render() {
			const mainClassName = this.props.name.replace( /\//g, '-' )
			const blockName = this.props.name.replace( /^\w+\//g, '' )

			const className = classnames( [
				this.props.className,
				mainClassName,
			] )

			return (
				<WrappedComponent
					{ ...this.props }
					className={ className }
					mainClassName={ mainClassName }
					blockName={ blockName }
				/>
			)
		}
	},
	'withMainClassname'
)

export default withMainClassname
