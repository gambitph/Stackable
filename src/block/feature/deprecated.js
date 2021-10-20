/**
 * Internal Dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import {
	getAlignmentClasses, getContentAlignmentClasses, getRowClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.0.2 Deprecations
addFilter( 'stackable.feature.save.contentClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	const contentAlignmentClasses = getContentAlignmentClasses( props.attributes )
	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	return {
		[ rowClass ]: rowClass,
		[ contentAlignmentClasses ]: contentAlignmentClasses,
	}
} )

addFilter( 'stackable.feature.save.innerClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	return {
		'stk-inner-blocks': true,
		[ blockAlignmentClass ]: blockAlignmentClass,
		'stk-block-content': true,
	}
} )

const deprecated = [
	{
		attributes: attributes( '3.0.2' ),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated
