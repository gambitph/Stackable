/**
 * Internal dependencies
 */
import { name, settings } from '../'

/**
 * External dependencies
 */
import { blockSaveRender } from '~stackable/test'

describe( `${ settings.title } block`, () => {
	describe( 'Save render', () => {
		// Specified attributes for save testing.
		const attributes = {
			design: 'basic',
			icon: 'check',
		}

		test( 'should match snapshot', () => {
			const wrapper = blockSaveRender( name, settings )
			expect( wrapper ).toMatchSnapshot()
		} )

		test( 'should match snapshot with attributes', () => {
			const wrapper = blockSaveRender( name, settings, attributes )
			expect( wrapper ).toMatchSnapshot()
		} )
	} )
} )
