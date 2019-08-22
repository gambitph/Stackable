/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withTabbedInspector = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		constructor() { // eslint-disable-line
			super( ...arguments )
		}

		render() {
			return (
				<WrappedComponent { ...this.props } />
			)
		}
	},
	'withTabbedInspector'
)

export default withTabbedInspector
