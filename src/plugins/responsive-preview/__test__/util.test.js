import {
	cacheCssObject, updateMediaQuery, getIncludedIndices,
} from '../util'

const dummyStyleSheets = [
	{
		href: null,
		cssRules: [
			{
				cssText: '@media screen and (max-width: 600px) { .ugb-sample.block { display: block; } }',
				media: { mediaText: 'screen and (max-width: 600px)' },
			},
			{
				cssText: '@media screen { .block-editor { display: block; } }',
				media: { mediaText: 'screen' },
			},
			{
				cssText: '@media screen and (min-width: 760px) { .ugb-sample.block { display: block; } }',
				media: { mediaText: 'screen and (min-width: 760px)' },
			},
			{
				cssText: '@media screen and (min-width: 480px) and (max-width: 1025px) { .ugb-sample.block { display: block; } }',
				media: { mediaText: 'screen and (min-width: 480px) and (max-width: 1025px)' },
			},
			{
				cssText: '@media screen and (max-width: 1025px) .ugb-sample.block { display: block; }',
				media: { mediaText: 'screen and (min-width: 1025px)' },
			},
		],
	},
]

const dummyCssObject = {
	0: {
		0: {
			mediaText: 'screen and (max-width: 600px)', min: 0, max: 600,
		},
		2: {
			mediaText: 'screen and (min-width: 760px)', min: 760, max: 9999,
		},
		3: {
			mediaText: 'screen and (min-width: 480px) and (max-width: 1025px)', min: 480, max: 1025,
		},
		4: {
			mediaText: 'screen and (min-width: 1025px)', min: 1025, max: 9999,
		},
	},
}

const dummyCssRulesCache = 	{
	0: [
		{
			cssText: '@media screen and (max-width: 600px) { .ugb-sample.block { display: block; } }',
			media: { mediaText: 'screen and (max-width: 600px)' },
		},
		{
			cssText: '@media screen { .block-editor { display: block; } }',
			media: { mediaText: 'screen' },
		},
		{
			cssText: '@media screen and (min-width: 760px) { .ugb-sample.block { display: block; } }',
			media: { mediaText: 'screen and (min-width: 760px)' },
		},
		{
			cssText: '@media screen and (min-width: 480px) and (max-width: 1025px) { .ugb-sample.block { display: block; } }',
			media: { mediaText: 'screen and (min-width: 480px) and (max-width: 1025px)' },
		},
		{
			cssText: '@media screen and (max-width: 1025px) .ugb-sample.block { display: block; }',
			media: { mediaText: 'screen and (min-width: 1025px)' },
		},
	],
}

describe( 'cacheCssObject', () => {
	it( 'should not cache values if some arguments are invalid or undefined', () => {
		const document = {}
		const cssObject = {}
		const cssRulesCache = {}
		const includeCss = []
		expect( cacheCssObject( null, cssObject, cssRulesCache, includeCss ) ).toBe( undefined )
		expect( cacheCssObject( document, null, cssRulesCache, includeCss ) ).toBe( undefined )
		expect( cacheCssObject( document, cssObject, null, includeCss ) ).toBe( undefined )
		expect( cacheCssObject( document, cssObject, cssRulesCache, null ) ).toBe( undefined )
	} )

	it( 'should populate the cssObject and cssRulesCache with media queries in document', () => {
		const document = { styleSheets: [ ...dummyStyleSheets ] }
		const cssObject = {}
		const cssRulesCache = {}
		const includeCss = []
		cacheCssObject( document, cssObject, cssRulesCache, includeCss )

		expect( cssObject ).toEqual( dummyCssObject )

		expect( cssRulesCache ).toEqual( dummyCssRulesCache )
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
	it( 'should not update media queries if some arguments are invalid or undefined', () => {
		const document = {}
		const previewMode = 'Desktop'
		const cssObject = {}
		const width = 720
		expect( updateMediaQuery( null, cssObject, previewMode, width ) ).toBe( undefined )
		expect( updateMediaQuery( document, null, previewMode, width ) ).toBe( undefined )
		expect( updateMediaQuery( document, cssObject, null, width ) ).toBe( undefined )
		expect( updateMediaQuery( document, cssObject, previewMode, null ) ).toBe( undefined )
	} )

	it( 'should modify media queries for tablet mode', () => {
		const document = { styleSheets: [ ...dummyStyleSheets ] }
		const previewMode = 'Tablet'
		const cssObject = { ...dummyCssObject }
		const width = 700

		updateMediaQuery( document, cssObject, previewMode, width )

		expect( document ).toEqual( {
			styleSheets: [
				{
					href: null,
					cssRules: [
						{
							cssText: '@media screen and (max-width: 600px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
						{
							cssText: '@media screen { .block-editor { display: block; } }',
							media: { mediaText: 'screen' },
						},
						{
							cssText: '@media screen and (min-width: 760px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
						{
							cssText: '@media screen and (min-width: 480px) and (max-width: 1025px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (max-width: 5000px)' },
						},
						{
							cssText: '@media screen and (max-width: 1025px) .ugb-sample.block { display: block; }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
					],
				},
			],
		}
		)
	} )

	it( 'should modify media queries for mobile mode', () => {
		const document = { styleSheets: [ ...dummyStyleSheets ] }
		const previewMode = 'Mobile'
		const cssObject = { ...dummyCssObject }
		const width = 250

		updateMediaQuery( document, cssObject, previewMode, width )

		expect( document ).toEqual( {
			styleSheets: [
				{
					href: null,
					cssRules: [
						{
							cssText: '@media screen and (max-width: 600px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (max-width: 5000px)' },
						},
						{
							cssText: '@media screen { .block-editor { display: block; } }',
							media: { mediaText: 'screen' },
						},
						{
							cssText: '@media screen and (min-width: 760px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
						{
							cssText: '@media screen and (min-width: 480px) and (max-width: 1025px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
						{
							cssText: '@media screen and (max-width: 1025px) .ugb-sample.block { display: block; }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
					],
				},
			],
		}
		)
	} )

	it( 'should modify media queries for desktop mode', () => {
		const document = {
			styleSheets: [
				{
					href: null,
					cssRules: [
						{
							cssText: '@media screen and (max-width: 600px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (max-width: 5000px)' },
						},
						{
							cssText: '@media screen { .block-editor { display: block; } }',
							media: { mediaText: 'screen' },
						},
						{
							cssText: '@media screen and (min-width: 760px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
						{
							cssText: '@media screen and (min-width: 480px) and (max-width: 1025px) { .ugb-sample.block { display: block; } }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
						{
							cssText: '@media screen and (max-width: 1025px) .ugb-sample.block { display: block; }',
							media: { mediaText: 'screen and (min-width: 5000px)' },
						},
					],
				} ],
		}
		const previewMode = 'Desktop'
		const cssObject = { ...dummyCssObject }
		const width = 1920

		updateMediaQuery( document, cssObject, previewMode, width )

		expect( document ).toEqual( { styleSheets: [ ...dummyStyleSheets ] } )
	} )
} )
