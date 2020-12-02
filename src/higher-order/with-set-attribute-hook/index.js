/**
 * WordPress dependencies
 */
import { applyFilters, doAction } from '@wordpress/hooks'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

/**
 * External dependencies
 */
import PropTypes from 'prop-types'
import { isEqual, omit } from 'lodash'

export const createUniqueClass = uid => `ugb-${ uid.substring( 0, 7 ) }`

const withSetAttributeHook = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static propTypes = {
			setAttributes: PropTypes.func.isRequired,
		}

		constructor() {
			super( ...arguments )
			this.setAttributes = this.setAttributes.bind( this )
		}

		/**
		 * Triggers the observerCallback in responsive-preview.
		 * This allows the editor mode to update based on attribute changes
		 * in Tablet or Mobile mode.
		 *
		 * @param {Object} prevProps previous props
		 *
		 * @see src/plugins/responsive-preview/index.js
		 */
		componentDidUpdate( prevProps ) {
			if ( ! isEqual( prevProps.attributes, this.props.attributes ) ) {
				doAction( 'stackable.setAttributes.after' )
			}
		}

		shouldComponentUpdate( nextProps ) {
			return ! isEqual( omit( nextProps.attributes, 'uniqueClass' ), omit( this.props.attributes, 'uniqueClass' ) )
		}

		setAttributes( attributes ) {
			const { blockName } = this.props
			let attributesToSet = applyFilters( 'stackable.setAttributes', attributes, this.props )
			attributesToSet = applyFilters( `stackable.${ blockName }.setAttributes`, attributesToSet, this.props )
			this.props.setAttributes( attributesToSet )
		}

		render() {
			return (
				<WrappedComponent { ...this.props } setAttributes={ this.setAttributes } />
			)
		}
	},
	'withSetAttributeHook'
)

export default withSetAttributeHook
