/**
 * Internal dependencies
 */
import { addMatcher } from './listener'

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

/**
 * Listens for clicks on given block inner components and opens the corresponding panel.
 *
 * @param {Array} matchers An array of mathcer arrays. For example [ [ 'ugb-cta__title', 'title' ] ]
 *                         This will listen for clicks on the element that has the class `ugb-cta__title`
 *                         and will open the panel with the ID `title`
 *
 * @return {Object} HOC
 */
const withClickOpenInspector = ( matchers = [] ) => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		constructor() {
			super( ...arguments )
			const { blockName } = this.props
			matchers.forEach( value => {
				addMatcher( blockName, value[ 0 ], value[ 1 ] )
			} )
		}

		render() {
			return (
				<WrappedComponent { ...this.props } />
			)
		}
	},
	'withClickOpenInspector'
)

export default withClickOpenInspector
