/**
 * External dependencies
 */
import { loadGoogleFontInAttributes } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withGoogleFont = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			attributes: {},
		}

		componentDidMount() {
			loadGoogleFontInAttributes( this.props.attributes )
		}

		render() {
			return (
				<WrappedComponent { ...this.props } />
			)
		}
	},
	'withGoogleFont'
)

export default withGoogleFont
