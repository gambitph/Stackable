import { inheritDesktopAttribute } from '../'

describe( 'inheritDesktopAttribute', () => {
	it( 'should generate a default value based on desktop\'s attribute', () => {
		expect( inheritDesktopAttribute( '', 'px' ) ).toBe( undefined )
		expect( inheritDesktopAttribute( '10', 'px' ) ).toBe( undefined )
		expect( inheritDesktopAttribute( '10', 'vh', 20 ) ).toBe( undefined )
		expect( inheritDesktopAttribute( '20', 'vh', 10 ) ).toBe( '10vh !important' )
		expect( inheritDesktopAttribute( '10', 'vh', 20, false ) ).toBe( undefined )
		expect( inheritDesktopAttribute( '30', 'vh', 20, false ) ).toBe( '20vh' )
		expect( inheritDesktopAttribute( '10', 'vh', 20, true ) ).toBe( undefined )
	} )
} )

