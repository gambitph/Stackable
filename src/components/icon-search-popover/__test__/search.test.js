import { searchFontAwesomeIconName } from '../search'

// We're sure that the Free API doesn't have duotones,
// which are denoted by the prefix "fad".

describe( 'searchFontAwesomeIconName', () => {
	it( 'should be able to search the free Font Awesome API', async () => {
		const results = await searchFontAwesomeIconName( 'coffee', false )
		const hasProResults = results.some( ( { prefix } ) => prefix === 'fad' )
		expect( hasProResults ).toBe( false )
	} )

	it( 'should be able to search the Premium Font Awesome API', async () => {
		const results = await searchFontAwesomeIconName( 'coffee', true )
		const hasProResults = results.some( ( { prefix } ) => prefix === 'fad' )
		expect( hasProResults ).toBe( true )
	} )
} )
