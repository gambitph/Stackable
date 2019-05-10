import { descriptionPlaceholder, prependCSSClass } from '../util'

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
