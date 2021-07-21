/**
 * External dependencies
 */
import { blockAttributeTests } from '~stackable/test/shared'

/**
 * Internal dependencies
 */
import { settings } from '../'

describe( `${ settings.title } block`, () => {
	blockAttributeTests( { settings } )
} )
