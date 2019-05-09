import { prependCSSClass } from '../util'

describe( 'Prepend CSS Class', () => {
	test( 'should work', () => {
		expect( prependCSSClass( '.title-block', 'title-block', 'my-title-be8d9a' ) ).toBe( '.my-title-be8d9a.title-block' )
		expect( prependCSSClass( '.title-block span', 'title-block', 'my-title-be8d9a' ) ).toBe( '.my-title-be8d9a.title-block span' )
		expect( prependCSSClass( 'span', 'title-block', 'my-title-be8d9a' ) ).toBe( '.my-title-be8d9a span' )
		expect( prependCSSClass( '.aa.bb', 'aa', 'unique' ) ).toBe( '.unique.aa.bb' )
	} )
	test( 'should support multiple selectors', () => {
		expect( prependCSSClass( '.title-block, .title-block', 'title-block', 'unique' ) ).toBe( '.unique.title-block, .unique.title-block' )
		expect( prependCSSClass( '.a, .b, .c', 'b', 'unique' ) ).toBe( '.unique .a, .unique.b, .unique .c' )
		expect( prependCSSClass( '.aa, .bb, .bb .cc', 'bb', 'unique' ) ).toBe( '.unique .aa, .unique.bb, .unique.bb .cc' )
	} )
	test( 'should not confuse similar selectors', () => {
		expect( prependCSSClass( '.aa-bb', 'aa', 'unique' ) ).toBe( '.unique .aa-bb' )
		expect( prependCSSClass( '.aa[bb]', 'aa', 'unique' ) ).toBe( '.unique.aa[bb]' )
		expect( prependCSSClass( '.aaa', 'aa', 'unique' ) ).toBe( '.unique .aaa' )
		expect( prependCSSClass( '.aa1', 'aa', 'unique' ) ).toBe( '.unique .aa1' )
	} )
	test( 'should not affect complex selectors', () => {
		expect( prependCSSClass( '.bb + .aa', 'aa', 'unique' ) ).toBe( '.unique .bb + .aa' )
	} )
} )
