/**
 * Internal dependencies
 */
import { attributes } from './schema'
import { Save } from './save'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.table-of-contents.save.titleNotRender', 'stackable/titleNotRendered', ( output, props ) => {
	if ( compareVersions( props.version, '3.6.0' ) === 0 ) {
		return false
	}

	return output
} )

const deprecated = [
	{
		attributes: attributes(),
		migrate: attributes => {
			return {
				...attributes,
				titleShow: false,
			}
		},
		save: withVersion( '3.6.0' )( Save ),
	},
]

export default deprecated
