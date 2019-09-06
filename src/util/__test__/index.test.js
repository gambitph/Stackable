/**
 * Internal dependencies
 */
import { hexToRgba } from '../'

describe( 'hexToRgba', () => {
	it( 'should work', () => {
		expect( hexToRgba( '#000000' ) ).toBe( 'rgba(0, 0, 0, 1)' )
		expect( hexToRgba( '#000000', 0 ) ).toBe( 'rgba(0, 0, 0, 0)' )
		expect( hexToRgba( '#000000', 1 ) ).toBe( 'rgba(0, 0, 0, 1)' )
		expect( hexToRgba( '#000000', 0.5 ) ).toBe( 'rgba(0, 0, 0, 0.5)' )
		expect( hexToRgba( '#ffffff' ) ).toBe( 'rgba(255, 255, 255, 1)' )
		expect( hexToRgba( '#fff' ) ).toBe( 'rgba(255, 255, 255, 1)' )
		expect( hexToRgba( 'ffffff' ) ).toBe( 'rgba(255, 255, 255, 1)' )
		expect( hexToRgba( 'fff' ) ).toBe( 'rgba(255, 255, 255, 1)' )
		expect( hexToRgba( '000' ) ).toBe( 'rgba(0, 0, 0, 1)' )
		expect( hexToRgba( '#ab5af1' ) ).toBe( 'rgba(171, 90, 241, 1)' )
		expect( hexToRgba( '#ab5af1', 0.4 ) ).toBe( 'rgba(171, 90, 241, 0.4)' )
	} )
} )
