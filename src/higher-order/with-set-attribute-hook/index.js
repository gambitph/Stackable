/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

/**
 * External dependencies
 */
import PropTypes from 'prop-types'

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
