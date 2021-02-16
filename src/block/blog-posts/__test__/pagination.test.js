/**
 * Internal dependencies
 */
import { generatePaginationArray } from '../pagination'

describe( 'generatePaginationArray function', () => {
	it( 'should generate the right pagination array', () => {
		expect( generatePaginationArray( 1, 3 ) ).toEqual( [
			1,
			2,
			3,
		] )
		expect( generatePaginationArray( 1, 7 ) ).toEqual( [
			1,
			2,
			3,
			'...',
			7,
		] )
		expect( generatePaginationArray( 2, 7 ) ).toEqual( [
			1,
			2,
			3,
			4,
			'...',
			7,
		] )
		expect( generatePaginationArray( 3, 7 ) ).toEqual( [
			1,
			2,
			3,
			4,
			5,
			'...',
			7,
		] )
		expect( generatePaginationArray( 4, 7 ) ).toEqual( [
			1,
			2,
			3,
			4,
			5,
			'...',
			7,
		] )
		expect( generatePaginationArray( 5, 7 ) ).toEqual( [
			1,
			'...',
			3,
			4,
			5,
			6,
			7,
		] )
	} )
} )
