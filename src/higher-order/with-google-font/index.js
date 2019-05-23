import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import { loadGoogleFont } from '@stackable/util'

const withGoogleFont = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			attributes: {},
		}

		componentDidMount() {
			const { attributes } = this.props
			Object.keys( attributes )
				.filter( attrName => attrName.match( /fontfamily/i ) )
				.forEach( attrName => {
					const fontName = attributes[ attrName ]
					if ( fontName ) {
						loadGoogleFont( fontName )
					}
				} )
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
