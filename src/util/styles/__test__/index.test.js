/**
 * Internal dependencies
 */
import { isDarkColor } from '../'

describe( 'isDarkColor', () => {
	it( 'should work', () => {
		expect( isDarkColor( '#000000' ) ).toBe( true )
		expect( isDarkColor( '#111' ) ).toBe( true )
		expect( isDarkColor( '222222' ) ).toBe( true )
		expect( isDarkColor( '#ffffff' ) ).toBe( false )
		expect( isDarkColor( '#eee' ) ).toBe( false )
		expect( isDarkColor( 'dddddd' ) ).toBe( false )
	} )
	it( 'should not error out with weird inputs', () => {
		expect( isDarkColor( '' ) ).toBe( false )
		expect( isDarkColor( null ) ).toBe( false )
		expect( isDarkColor( 'white' ) ).toBe( false )
		expect( isDarkColor( undefined ) ).toBe( false )
		expect( isDarkColor( {} ) ).toBe( false )
		expect( isDarkColor( 123 ) ).toBe( false )
		expect( isDarkColor( '#fae' ) ).toBe( false )
		expect( isDarkColor( 'fae' ) ).toBe( false )
	} )
} )
