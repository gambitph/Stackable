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

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.0.2 Deprecations
addFilter( 'stackable.feature.save.contentClassNames', 'stackable/3.0.2', ( output, version, rowClass ) => {
	if ( compareVersions( version, '3.0.2' ) < 1 ) {
		return {
			...output,
			[ rowClass ]: rowClass,
		}
	}

	return output
} )

addFilter( 'stackable.feature.save.innerClassNames', 'stackable/3.0.2', ( output, version, rowClass ) => {
	if ( compareVersions( version, '3.0.2' ) < 1 ) {
		return {
			...output,
			[ rowClass ]: false,
		}
	}

	return output
} )

const deprecated = [
	{
		attributes: attributes( '3.0.2' ),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated
