// Adds a the help tip class only if the component doesn't have on added in yet.

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withHelpTip = helpTipClass => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			className: '',
		}

		render() {
			const hasHelpTip = this.props.className.match( /ugb--help-tip/ )
			const mainClasses = classnames( [
				this.props.className,
			], {
				[ `ugb--help-tip-${ helpTipClass }` ]: ! hasHelpTip,
			} )

			return (
				<WrappedComponent
					{ ...this.props }
					className={ mainClasses }
				/>
			)
		}
	},
	'withHelpTip'
)

export default withHelpTip
