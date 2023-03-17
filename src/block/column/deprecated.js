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
import classnames from 'classnames/dedupe'
import { Alignment } from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.8 added horizontal flex, this changes the stk--block-orientation-* to stk--block-horizontal-flex.
addFilter( 'stackable.column.save.innerClassNames', 'stackable/3.8.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.8.0' ) >= 0 ) {
		return output
	}

	return classnames( output, {
		'stk--block-horizontal-flex': false,
		[ `stk--block-orientation-${ props.attributes.innerBlockOrientation }` ]: props.attributes.innerBlockOrientation,
	} )
} )

// Version 3.7 Deprecations, we now have a stk-block-column--v3 class and removed the --v2 class
addFilter( 'stackable.column.save.blockClassNames', 'stackable/3.7.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.7.0' ) >= 0 ) {
		return output
	}

	return output.filter( s => s !== 'stk-block-column--v3' )
} )

// Version 3.4.3 Deprecations, we now have a stk-block-column--v2 class.
addFilter( 'stackable.column.save.blockClassNames', 'stackable/3.4.3', ( output, props ) => {
	if ( compareVersions( props.version, '3.4.3' ) >= 0 ) {
		output.push( 'stk-block-column--v2' )
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
		save: withVersion( '3.7.9' )( Save ),
		migrate: Alignment.deprecated.horizontalOrientationMigrate,
	},
	{
		attributes: attributes(),
		save: withVersion( '3.6.6' )( Save ),
	},
	{
		attributes: attributes(),
		save: withVersion( '3.4.2' )( Save ),
	},
]

export default deprecated
