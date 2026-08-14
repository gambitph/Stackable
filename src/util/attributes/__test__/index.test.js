/**
 * Internal dependencies
 */
import {
	createAllCombinationAttributes,
	createResponsiveAttributes,
	getAttributeName,
} from '../'

describe( 'createAllCombinationAttributes', () => {
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

describe( 'createResponsiveAttributes', () => {
	test( 'should add desktop, tablet, and mobile names', () => {
		const attrs = createResponsiveAttributes( '%sMargin', { type: 'number' } )
		expect( Object.keys( attrs ) ).toEqual( [ 'margin', 'tabletMargin', 'mobileMargin' ] )
		expect( attrs.margin ).toEqual( { type: 'number' } )
		expect( attrs.tabletMargin ).toEqual( { type: 'number' } )
		expect( attrs.mobileMargin ).toEqual( { type: 'number' } )
	} )
} )

describe( 'getAttributeName', () => {
	test( 'should leave desktop normal names unchanged', () => {
		expect( getAttributeName( 'fontSize' ) ).toBe( 'fontSize' )
		expect( getAttributeName( 'fontSize', 'desktop', 'normal' ) ).toBe( 'fontSize' )
		expect( getAttributeName( 'fontSize', 'Desktop', 'normal' ) ).toBe( 'fontSize' )
	} )

	test( 'should append tablet and mobile', () => {
		expect( getAttributeName( 'fontSize', 'tablet' ) ).toBe( 'fontSizeTablet' )
		expect( getAttributeName( 'fontSize', 'mobile' ) ).toBe( 'fontSizeMobile' )
	} )

	test( 'should append hover states', () => {
		expect( getAttributeName( 'fontSize', 'desktop', 'hover' ) ).toBe( 'fontSizeHover' )
		expect( getAttributeName( 'fontSize', 'tablet', 'hover' ) ).toBe( 'fontSizeTabletHover' )
		expect( getAttributeName( 'fontSize', 'mobile', 'collapsed' ) ).toBe( 'fontSizeMobileCollapsed' )
		expect( getAttributeName( 'fontSize', 'desktop', 'parent-hover' ) ).toBe( 'fontSizeParentHover' )
	} )
} )
