/**
 * External dependencies
 */
import { getAttrName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withContentAlignReseter = ( attributeNamesToReset = [] ) => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			attributes: {},
			blockName: '',
		}

		componentDidMount() {
			const { blockName } = this.props

			// Go through each screen then reset attibutes if needed.
			addFilter( `stackable.${ blockName }.setAttributes`, `stackable/${ blockName }/contentAlign`, attributes => {
				const screens = [ '', 'Tablet', 'Mobile' ]
				const resetAlignments = applyFilters( 'stackable.with-content-align-reseter.attributeNamesToReset', attributeNamesToReset, blockName )

				screens.forEach( screen => {
					if ( typeof attributes[ getAttrName( '%sContentAlign', screen ) ] !== 'undefined' ) {
						resetAlignments.forEach( attrName => {
							attributes[ getAttrName( attrName, screen ) ] = ''
						} )
					}
				} )

				return attributes
			} )
		}

		render() {
			return <WrappedComponent { ...this.props } />
		}
	},
	'withContentAlignReseter'
)

export default withContentAlignReseter
