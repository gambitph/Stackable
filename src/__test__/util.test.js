/**
 * Internal dependencies
 */
import {
	createAllCombinationAttributes, descriptionPlaceholder, prependCSSClass,
} from '../util'

describe( 'Create All Combination Attributes', () => {
	test( 'should work with 1 array', () => {
		const attrs = createAllCombinationAttributes( 'Camel%sCase', { a: 'b' }, [ 'Foo', 'Bar' ] )
		expect( typeof attrs ).toBe( 'object' )
		expect( Object.keys( attrs ).length ).toBe( 2 )
		expect( Object.keys( attrs ) ).toContain( 'camelFooCase' )
		expect( Object.keys( attrs ) ).toContain( 'camelBarCase' )
		expect( Object.keys( attrs.camelFooCase ).length ).toBe( 1 )
		expect( Object.keys( attrs.camelFooCase )[ 0 ] ).toBe( 'a' )
		expect( attrs.camelFooCase.a ).toBe( 'b' )
		expect( Object.keys( attrs.camelBarCase ).length ).toBe( 1 )
		expect( Object.keys( attrs.camelBarCase )[ 0 ] ).toBe( 'a' )
		expect( attrs.camelBarCase.a ).toBe( 'b' )
	} )

	test( 'should work with 2 arrays', () => {
		const attrs = createAllCombinationAttributes( 'Camel%sCase%s', { a: 'b' }, [ 'Foo', 'Bar' ], [ 'Stack', 'Able' ] )
		expect( typeof attrs ).toBe( 'object' )
		expect( Object.keys( attrs ).length ).toBe( 4 )
		expect( Object.keys( attrs ) ).toContain( 'camelBarCaseStack' )
		expect( Object.keys( attrs ) ).toContain( 'camelBarCaseAble' )
		expect( Object.keys( attrs ) ).toContain( 'camelFooCaseStack' )
		expect( Object.keys( attrs ) ).toContain( 'camelFooCaseAble' )
		expect( Object.keys( attrs.camelBarCaseStack ).length ).toBe( 1 )
		expect( Object.keys( attrs.camelBarCaseAble ).length ).toBe( 1 )
		expect( Object.keys( attrs.camelFooCaseStack ).length ).toBe( 1 )
		expect( Object.keys( attrs.camelFooCaseAble ).length ).toBe( 1 )
		expect( Object.keys( attrs.camelBarCaseStack )[ 0 ] ).toBe( 'a' )
		expect( Object.keys( attrs.camelBarCaseAble )[ 0 ] ).toBe( 'a' )
		expect( Object.keys( attrs.camelFooCaseStack )[ 0 ] ).toBe( 'a' )
		expect( Object.keys( attrs.camelFooCaseAble )[ 0 ] ).toBe( 'a' )
		expect( attrs.camelBarCaseStack.a ).toBe( 'b' )
		expect( attrs.camelBarCaseAble.a ).toBe( 'b' )
		expect( attrs.camelFooCaseStack.a ).toBe( 'b' )
		expect( attrs.camelFooCaseAble.a ).toBe( 'b' )
	} )
} )

describe( 'Prepend CSS Class', () => {
	test( 'should work', () => {
		expect(
			prependCSSClass( '.title-block', 'title-block', 'my-title-be8d9a' )
		).toBe( '.my-title-be8d9a.title-block' )
		expect(
			prependCSSClass( '.title-block span', 'title-block', 'my-title-be8d9a' )
		).toBe( '.my-title-be8d9a.title-block span' )
		expect( prependCSSClass( 'span', 'title-block', 'my-title-be8d9a' ) ).toBe(
			'.my-title-be8d9a span'
		)
		expect( prependCSSClass( '.aa.bb', 'aa', 'unique' ) ).toBe( '.unique.aa.bb' )
	} )
	test( 'should support multiple selectors', () => {
		expect(
			prependCSSClass( '.title-block, .title-block', 'title-block', 'unique' )
		).toBe( '.unique.title-block, .unique.title-block' )
		expect( prependCSSClass( '.a, .b, .c', 'b', 'unique' ) ).toBe(
			'.unique .a, .unique.b, .unique .c'
		)
		expect( prependCSSClass( '.aa, .bb, .bb .cc', 'bb', 'unique' ) ).toBe(
			'.unique .aa, .unique.bb, .unique.bb .cc'
		)
	} )
	test( 'should not confuse similar selectors', () => {
		expect( prependCSSClass( '.aa-bb', 'aa', 'unique' ) ).toBe( '.unique .aa-bb' )
		expect( prependCSSClass( '.aa[bb]', 'aa', 'unique' ) ).toBe( '.unique.aa[bb]' )
		expect( prependCSSClass( '.aa:before', 'aa', 'unique' ) ).toBe( '.unique.aa:before' )
		expect( prependCSSClass( '.aa#id', 'aa', 'unique' ) ).toBe( '.unique.aa#id' )
		expect( prependCSSClass( '.aa:nth-child(1)', 'aa', 'unique' ) ).toBe( '.unique.aa:nth-child(1)' )
		expect( prependCSSClass( '.aa:not(:first-child)', 'aa', 'unique' ) ).toBe( '.unique.aa:not(:first-child)' )
		expect( prependCSSClass( '.aa.bb', 'aa', 'unique' ) ).toBe( '.unique.aa.bb' )
		expect( prependCSSClass( '.aaa', 'aa', 'unique' ) ).toBe( '.unique .aaa' )
		expect( prependCSSClass( '.aa1', 'aa', 'unique' ) ).toBe( '.unique .aa1' )
	} )
	test( 'should not affect complex selectors', () => {
		expect( prependCSSClass( '.bb + .aa', 'aa', 'unique' ) ).toBe(
			'.unique .bb + .aa'
		)
	} )
} )

describe( 'Description Placeholder', () => {
	test( 'should work', () => {
		expect( typeof descriptionPlaceholder() ).toBe( 'string' )
		expect( descriptionPlaceholder().length ).toBeGreaterThan( 1 )
	} )

	test( 'should have the correct length', () => {
		const short = descriptionPlaceholder( 'short' )
		const normal = descriptionPlaceholder()
		const medium = descriptionPlaceholder( 'medium' )
		const long = descriptionPlaceholder( 'long' )

		expect( normal.length ).toBeGreaterThan( short.length )
		expect( medium.length ).toBeGreaterThan( normal.length )
		expect( long.length ).toBeGreaterThan( medium.length )
		expect( short.length ).toBeLessThan( normal.length )
		expect( normal.length ).toBeLessThan( medium.length )
		expect( medium.length ).toBeLessThan( long.length )
	} )

	test( 'should not change (since this is used in deprecations)', () => {
		const short = descriptionPlaceholder( 'short' )
		const normal = descriptionPlaceholder()
		const medium = descriptionPlaceholder( 'medium' )
		const long = descriptionPlaceholder( 'long' )

		expect( short ).toMatchInlineSnapshot(
			`"Description for this block. You can use this space for describing your block."`
		)
		expect( normal ).toMatchInlineSnapshot(
			`"Description for this block. Use this space for describing your block. Any text will do."`
		)
		expect( medium ).toMatchInlineSnapshot(
			`"Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block."`
		)
		expect( long ).toMatchInlineSnapshot(
			`"Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block."`
		)
	} )
} )
