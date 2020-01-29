/**
 * Internal dependencies
 */
import { hexToRgba, prependCSSClass } from '../'

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

describe( 'prependCSSClass', () => {
	it( 'should return the selector if no unique class or main class provided', () => {
		expect( prependCSSClass( '.test', '', 'unique' ) ).toBe( '.test' )
		expect( prependCSSClass( '.test', 'main' ) ).toBe( '.test' )
	} )
	it( 'should preappend unique class name', () => {
		expect( prependCSSClass( '.test', 'main', 'unique' ) ).toBe( '.unique .test' )
		expect( prependCSSClass( '#id', 'main', 'unique' ) ).toBe( '.unique #id' )
	} )
	it( 'should work with complex selectors', () => {
		expect( prependCSSClass( '.test + .test2 ~ .test3:nth-of-type(2)', 'main', 'unique' ) ).toBe( '.unique .test + .test2 ~ .test3:nth-of-type(2)' )
		expect( prependCSSClass( '.test:before:hover > p', 'main', 'unique' ) ).toBe( '.unique .test:before:hover > p' )
	} )
	it( 'should preappend unique class name to mulitple selectors', () => {
		expect( prependCSSClass( '.test,.test2', 'main', 'unique' ) ).toBe( '.unique .test, .unique .test2' )
	} )
	it( 'should connect the unique class and the main class if both are near each other', () => {
		expect( prependCSSClass( '.test .main, .main .test2', 'main', 'unique' ) ).toBe( '.unique .test .main, .unique.main .test2' )
		expect( prependCSSClass( '.main:first-child .test', 'main', 'unique' ) ).toBe( '.unique.main:first-child .test' )
	} )
	it( 'should not preappend unique class name if it already exists', () => {
		expect( prependCSSClass( '.unique', 'main', 'unique' ) ).toBe( '.unique' )
		expect( prependCSSClass( '.test .unique', 'main', 'unique' ) ).toBe( '.test .unique' )
	} )
	it( 'should always prepend if wrap selector is given', () => {
		expect( prependCSSClass( '.test', 'main', 'unique', '.wrap' ) ).toBe( '.wrap .unique .test' )
		expect( prependCSSClass( '.test, .main .test2', 'main', 'unique', '.wrap' ) ).toBe( '.wrap .unique .test, .wrap .unique.main .test2' )
		expect( prependCSSClass( '.test', '', '', '.wrap' ) ).toBe( '.wrap .test' )
	} )
} )
