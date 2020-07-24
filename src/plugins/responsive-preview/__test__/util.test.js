import {
	cacheCssObject, updateMediaQuery, getIncludedIndices,
} from '../util'

describe( 'cacheCssObject', () => {
	const document = {}
	const cssObject = {}
	const cssRulesCache = {}
	const includeCss = []
	it( 'should not cache values if some arguments are invalid or undefined', () => {
		expect( cacheCssObject( null, cssObject, cssRulesCache, includeCss ) ).toBe( undefined )
		expect( cacheCssObject( document, null, cssRulesCache, includeCss ) ).toBe( undefined )
		expect( cacheCssObject( document, cssObject, null, includeCss ) ).toBe( undefined )
		expect( cacheCssObject( document, cssObject, cssRulesCache, null ) ).toBe( undefined )
	} )
} )

describe( 'getIncludedIndices', () => {
	const styleSheets = [
		{
			href: null,
		},
		{
			href: 'style1.css',
		},
		{
			href: 'style2.css',
		},
		{
			href: 'style3.css',
		},
	]
	const includeCss = [
		'style1.css',
		'style2.css',
	]
	const includeCss2 = [ 'style3.css' ]
	const includeCss3 = []
	it( 'should return an empty string if some arguments are invalid or undefined', () => {
		expect( getIncludedIndices( null, includeCss ) ).toEqual( [] )
		expect( getIncludedIndices( styleSheets, null ) ).toEqual( [] )
	} )
	it( 'should get all indices that matches an entry in includeCss', () => {
		expect( getIncludedIndices( styleSheets, includeCss ) ).toEqual( [ 0, 1, 2 ] )
		expect( getIncludedIndices( styleSheets, includeCss2 ) ).toEqual( [ 0, 3 ] )
		expect( getIncludedIndices( styleSheets, includeCss3 ) ).toEqual( [ 0 ] )
	} )
} )

describe( 'updateMediaQuery', () => {
	const document = {}
	const previewMode = 'desktop'
	const cssObject = {}
	const width = 720
	it( 'should not update media queries if some arguments are invalid or undefined', () => {
		expect( updateMediaQuery( null, cssObject, previewMode, width ) ).toBe( undefined )
		expect( updateMediaQuery( document, null, previewMode, width ) ).toBe( undefined )
		expect( updateMediaQuery( document, cssObject, null, width ) ).toBe( undefined )
		expect( updateMediaQuery( document, cssObject, previewMode, null ) ).toBe( undefined )
	} )
} )
