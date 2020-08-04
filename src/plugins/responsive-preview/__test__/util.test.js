import {
	getCssObject, updateMediaQuery, getIncludedIndices,
} from '../util'

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash'

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

describe( 'getCssObject', () => {
	it( 'should not cache values if some arguments are invalid or undefined', () => {
		const documentStyleSheets = []
		const matchingFilenames = []
		expect( getCssObject( matchingFilenames, documentStyleSheets ) ).toEqual( {} )
	} )

	it( 'should populate the cssObject and cssRulesCache with media queries in document', () => {
		const documentStyleSheets = dummyStyleSheets
		const matchingFilenames = [ null ]
		expect( getCssObject( matchingFilenames, documentStyleSheets ) ).toEqual( dummyCssObject )
	} )
} )

describe( 'getIncludedIndices', () => {
	const styleSheets = [
		{ href: null },
		{ href: 'http://dummy/css/style1.css' },
		{ href: 'http://dummy/css/style2.css' },
		{ href: 'http://dummy/css/style3.css' },
		{ href: 'http://dummy/css/another2.css' },
		{ href: 'http://dummy/css/style4.css' },
		{ href: null },
	]
	const includeCss = [ 'style1.css', 'style2.css' ]
	const includeCss2 = [ null, 'style3.css' ]
	const includeCss3 = [ null, 'style' ]
	const includeCss4 = [ null, 'css/another' ]
	const includeCss5 = [ '2.css' ]
	it( 'should return an empty string if some arguments are invalid or undefined', () => {
		expect( getIncludedIndices( [], includeCss ) ).toEqual( [] )
		expect( getIncludedIndices( styleSheets ) ).toEqual( [] )
		expect( getIncludedIndices( styleSheets, [] ) ).toEqual( [] )
	} )
	it( 'should get all indices that matches an entry in includeCss', () => {
		expect( getIncludedIndices( styleSheets, includeCss ) ).toEqual( [ 1, 2 ] )
		expect( getIncludedIndices( styleSheets, includeCss2 ) ).toEqual( [ 0, 3, 6 ] )
		expect( getIncludedIndices( styleSheets, includeCss3 ) ).toEqual( [ 0, 1, 2, 3, 5, 6 ] )
		expect( getIncludedIndices( styleSheets, includeCss4 ) ).toEqual( [ 0, 4, 6 ] )
		expect( getIncludedIndices( styleSheets, includeCss5 ) ).toEqual( [ 2, 4 ] )
	} )
} )

describe( 'updateMediaQuery', () => {
	it( 'should modify media queries for tablet mode', () => {
		const document = { styleSheets: cloneDeep( dummyStyleSheets ) }
		const previewMode = 'Tablet'
		const matchingFilenames = [ null ]
		const width = 700

		expect( updateMediaQuery( matchingFilenames, previewMode, width, document.styleSheets ) ).toEqual(
			[
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
		)
	} )

	it( 'should modify media queries for mobile mode', () => {
		const document = { styleSheets: cloneDeep( dummyStyleSheets ) }
		const previewMode = 'Mobile'
		const matchingFilenames = [ null ]
		const width = 250

		expect( updateMediaQuery( matchingFilenames, previewMode, width, document.styleSheets ) ).toEqual(
			 [
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
		)
	} )

	it( 'should modify media queries for desktop mode', () => {
		const document = { styleSheets: cloneDeep( dummyStyleSheets ) }
		const previewMode = 'Desktop'
		const cssObject = {}
		const matchingFilenames = [ null ]
		const width = 1920

		// Transform the media queries to mobile first.
		updateMediaQuery( matchingFilenames, 'Mobile', 250, document.styleSheets, cssObject )

		expect( updateMediaQuery( matchingFilenames, previewMode, width, document.styleSheets, cssObject ) ).toEqual( cloneDeep( dummyStyleSheets ) )
	} )
} )
