/**
 * Internal dependencies
 */
import { numShapesInSvg } from '../util'

describe( 'numShapesInSvg', () => {
	it( 'should count adjacent shapes', () => {
		expect( numShapesInSvg( '<svg></svg>' ) ).toBe( 0 )
		expect( numShapesInSvg( '<svg><g></g></svg>' ) ).toBe( 0 )
		expect( numShapesInSvg( '<svg><shape /></svg>' ) ).toBe( 1 )
		expect( numShapesInSvg( '<svg><shape></shape></svg>' ) ).toBe( 1 )
		expect( numShapesInSvg( '<svg><shape/><shape/></svg>' ) ).toBe( 2 )
		expect( numShapesInSvg( '<svg><shape></shape><shape></shape></svg>' ) ).toBe( 2 )
		expect( numShapesInSvg( '<svg><shape/><shape></shape></svg>' ) ).toBe( 2 )
	} )
	it( 'should handle nested', () => {
		expect( numShapesInSvg( '<svg><g><shape/></g><g><shape/></g></svg>' ) ).toBe( 1 )
		expect( numShapesInSvg( '<svg><g><g><shape/></g></g></svg>' ) ).toBe( 1 )
		expect( numShapesInSvg( '<svg><g><g><shape/><shape></shape></g></g></svg>' ) ).toBe( 2 )
		expect( numShapesInSvg( '<svg><g><g><shape/><shape></shape></g></g><g><shape></shape></g></svg>' ) ).toBe( 2 )
		expect( numShapesInSvg( '<svg><g><g><shape/><shape></shape></g></g><g><shape></shape><circle></circle></g></svg>' ) ).toBe( 2 )
		expect( numShapesInSvg( '<svg><g><g><shape/><shape></shape></g></g><g><shape></shape><circle></circle><rect></rect></g></svg>' ) ).toBe( 3 )
	} )
} )
