import { name, settings } from '../'
import { blockEditRender } from '@stackable/test'
import { blockInspectorTests } from '@stackable/test/shared'

describe( `${ settings.title } block`, () => {
	describe( 'Edit render', () => {
		// Test inspector snapshot.
		blockInspectorTests( { name } )

		test( 'should match snapshot', () => {
			const wrapper = blockEditRender( name, settings )
			expect( wrapper ).toMatchSnapshot()
		} )
	} )
} )
