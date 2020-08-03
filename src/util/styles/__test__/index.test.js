/**
 * Internal dependencies
 */
import {
	isDarkColor, __getValue, createResponsiveStyles,
} from '../'

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
	it( 'should handle different cased attribute names and inputs', () => {
		expect( __getValue( { attrBGColor: 'red' } )( 'attrBGColor' ) ).toBe( 'red' )
		expect( __getValue( { attrBGColor: 'red' } )( 'AttrBGColor' ) ).toBe( 'red' )
	} )
} )

describe( 'createResponsiveStyles', () => {
	it( 'should generate responsive styles', () => {
		const selector = '.ugb-sample-block'
		const attrNameTemplate = 'sample%sAttribute'
		const styleRule = 'sampleStyleRule'
		const format = '%spx'
		const attributes1 = {
			sampleAttribute: 30,
			sampleTabletAttribute: '',
			sampleMobileAttribute: '',
		}
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, { important: false } ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px' }, mobile: { '.ugb-sample-block': {} }, tabletOnly: { '.ugb-sample-block': {} },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, { important: true } ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px !important' }, mobile: { '.ugb-sample-block': {} }, tabletOnly: { '.ugb-sample-block': {} },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, { important: true, inherit: false } ) ).toEqual( [ {
			desktopOnly: { '.ugb-sample-block': { sampleStyleRule: '30px !important' } }, mobile: { '.ugb-sample-block': {} }, tabletOnly: { '.ugb-sample-block': {} },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, {
			important: true, inheritTabletMax: 25, inheritTabletMin: 20,
		} ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px !important' }, mobile: { '.ugb-sample-block': {} }, tabletOnly: { '.ugb-sample-block': { sampleStyleRule: '25px !important' } },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, {
			important: true, inheritMobileMax: 25, inheritMobileMin: 20,
		} ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px !important' }, mobile: { '.ugb-sample-block': { sampleStyleRule: '25px !important' } }, tabletOnly: { '.ugb-sample-block': {} },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, {
			important: true, inheritMobileMax: 60, inheritMobileMin: 20,
		} ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px !important' }, mobile: { '.ugb-sample-block': {} }, tabletOnly: { '.ugb-sample-block': {} },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, {
			important: true, inheritTabletMax: 60, inheritTabletMin: 20,
		} ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px !important' }, mobile: { '.ugb-sample-block': {} }, tabletOnly: { '.ugb-sample-block': {} },
		} ] )
		expect( createResponsiveStyles( selector, attrNameTemplate, styleRule, format, attributes1, {
			important: true, inheritMobileMax: 25, inheritMobileMin: 20, inheritTabletMax: 50, inheritTabletMin: 35,
		} ) ).toEqual( [ {
			'.ugb-sample-block': { sampleStyleRule: '30px !important' }, mobile: { '.ugb-sample-block': { sampleStyleRule: '25px !important' } }, tabletOnly: { '.ugb-sample-block': { sampleStyleRule: '35px !important' } },
		} ] )
	} )
} )
