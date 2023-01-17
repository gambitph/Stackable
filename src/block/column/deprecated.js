/**
 * Internal dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.4.3 Deprecations, we now have a stk-block-column--v2 class.
addFilter( 'stackable.column.save.blockClassNames', 'stackable/3.4.3', ( output, props ) => {
	if ( compareVersions( props.version, '3.4.3' ) >= 0 ) {
		return output
	}

	return output.filter( s => s !== 'stk-block-column--v2' )
} )

// Version 3.4.3 Deprecations, we now have a stk-123abc-inner-blocks class.
addFilter( 'stackable.column.save.innerClassNames', 'stackable/3.4.3', ( output, props ) => {
	if ( compareVersions( props.version, '3.4.3' ) >= 0 ) {
		return output
	}

	return output.filter( s => ! s.match( /^stk-[\d\w]+-inner-blocks$/ ) )
} )

const deprecated = [
	{
		attributes: attributes(),
		save: withVersion( '3.4.2' )( Save ),
	},
]

export default deprecated
