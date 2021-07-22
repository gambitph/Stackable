/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'

const withVersion = ( version = VERSION ) => createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<WrappedComponent { ...props } version={ version } />
		)
	},
	'withVersion'
)

export default withVersion
