
/**
 * Internal dependncies
 */
import { semverCompare } from '~stackable/util'
import { wpVersion } from 'stackable'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.block.metadata', 'stackable/wp-6-2', settings => {
	if ( wpVersion && semverCompare( wpVersion, '<', '6.3' ) && settings?.supports?.spacing ) {
		delete settings.supports.spacing
	}
	return settings
} )
