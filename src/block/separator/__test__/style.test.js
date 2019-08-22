/**
 * Internal dependencies
 */
import { name, settings } from '../'

/**
 * External dependencies
 */
import { blockStyleTests } from '~stackable/test/shared'
import createStyles from '../style'

describe( `${ settings.title } block`, () => {
	describe( 'Rendered styles', () => {
		// Specified attributes for save testing.
		const attributes = {}

		blockStyleTests( {
			settings, name, attributes, createStyles,
		} )
	} )
} )
