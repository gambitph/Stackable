import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withMainClassname = registeredBlockName => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		render() {
			const mainClassName = registeredBlockName.replace( /\//g, '-' )
			const blockName = registeredBlockName.replace( /^\w+\//g, '' )

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
