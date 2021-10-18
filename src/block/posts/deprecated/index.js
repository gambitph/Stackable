/**
 * Internal dependencies
 */
import { attributes } from '../schema'
import { Save } from '../save'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'

const deprecated = [
	{
		attributes: attributes( '3.0.2' ),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated
