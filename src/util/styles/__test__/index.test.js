/**
 * Internal dependencies
 */
import { isDarkColor, __getValue } from '../'

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

describe( '__getValue', () => {
	it( 'returns a function', () => {
		expect( typeof __getValue() ).toBe( 'function' )
	} )
	it( 'returns the correct default value', () => {
		expect( typeof __getValue( { attr1: 9 } )( 'notExist' ) ).toBe( 'undefined' )
		expect( __getValue( { attr1: 9 }, null, '' )( 'notExist' ) ).toBe( '' )
	} )
	it( 'returns the correct attribute', () => {
		expect( __getValue( { attr1: 9, attr2: 10 } )( 'attr1' ) ).toBe( 9 )
		expect( __getValue( { attr1: 9, attr2: 10 } )( 'attr2' ) ).toBe( 10 )
		expect( __getValue( { attrOne: 9, attrTwo: 10 } )( 'attrOne' ) ).toBe( 9 )
	} )
	it( 'calls the attribute name callback', () => {
		const appendSomething = attr => attr + 'A'
		expect( __getValue( { attr1A: 9, attr2A: 10 }, appendSomething )( 'attr1' ) ).toBe( 9 )
		expect( __getValue( { attr1A: 9, attr2A: 10 }, appendSomething )( 'attr2' ) ).toBe( 10 )

		// Not called when null
		expect( __getValue( { attr1: 9, attr2: 10 }, null )( 'attr2' ) ).toBe( 10 )
	} )
	it( 'formats the return value', () => {
		expect( __getValue( { attr1: 9 } )( 'attr1', '' ) ).toBe( 9 )
		expect( __getValue( { attr1: 9 } )( 'attr1', '%spx' ) ).toBe( '9px' )
		expect( __getValue( { attr1: 9 } )( 'attr1', '%s%' ) ).toBe( '9%' )
		expect( __getValue( { attr1: 9 } )( 'attr1', 'hello' ) ).toBe( 'hello' )
	} )
} )
