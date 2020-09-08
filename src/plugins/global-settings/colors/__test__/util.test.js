/**
 * Internal dependencies
 */
import { replaceGlobalColorAttributes, updateFallbackColorAttributes } from '../util'

describe( 'replaceGlobalColorAttributes', () => {
	it( 'should replace all global color attributes to the default colors', () => {
		const dummyAttributes = {
			level1Attribute1: 'var(--stk-global-color-111abc, #123abc)',
			level1Attribute2: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc)',
			level1Attribute3: 'stk-global-color-111111',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111abe, #123abc)' },
				{
					level2Attribute4: {
						level3Attribute1: 'stk-global-color-111112',
						level3Attribute2: 'var(--stk-global-color-111abc, #123abc)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111abe, #123abc); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: 'stk-global-color-111114',
							level4Attribute2: 'var(--stk-global-color-111abf, #123abc)',
						},
					},
				},
			],
		}

		const dummyColorsBeforeReset = [
			{
				name: 'Dummy Color 1', slug: 'stk-global-color-111111', colorVar: '--stk-global-color-111abc', fallback: '#123abc', color: 'var(--stk-global-color-111abc, #123abc)',
			},
			{
				name: 'Dummy Color 2', slug: 'stk-global-color-111112', colorVar: '--stk-global-color-111abd', fallback: 'var(--dummy-style, #123abc)', color: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc))',
			},
			{
				name: 'Dummy Color 3', slug: 'stk-global-color-111113', colorVar: '--stk-global-color-111abe', fallback: '#123abc', color: 'var(--stk-global-color-111abe, #123abc)',
			},
			{
				name: 'Dummy Color 4', slug: 'stk-global-color-111114', colorVar: '--stk-global-color-111abf', fallback: '#123abc', color: 'var(--stk-global-color-111abf, #123abc)',
			},
		]

		const dummyColorsAfterReset = [
			{
				name: 'Dummy Color 1', slug: 'stk-global-color-111111', colorVar: '--stk-global-color-111abc', fallback: '#ffffff', color: 'var(--stk-global-color-111abc, #ffffff)',
			},
			{
				name: 'Dummy Color 2', slug: 'stk-global-color-111112', colorVar: '--stk-global-color-111abd', fallback: 'var(--dummy-style, #123abc)', color: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc))',
			},
			{
				name: 'Dummy Color 3', slug: 'stk-global-color-111113', colorVar: '--stk-global-color-111abe', fallback: '#cccf11', color: 'var(--stk-global-color-111abe, #cccf11)',
			},
		]

		expect( replaceGlobalColorAttributes( dummyAttributes, dummyColorsBeforeReset, dummyColorsAfterReset ) ).toEqual( {
			level1Attribute1: 'var(--stk-global-color-111abc, #ffffff)',
			level1Attribute2: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc)',
			level1Attribute3: 'stk-global-color-111111',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111abe, #cccf11)' },
				{
					level2Attribute4: {
						level3Attribute1: 'stk-global-color-111112',
						level3Attribute2: 'var(--stk-global-color-111abc, #ffffff)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111abe, #cccf11); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: 'stk-global-color-111114',
							level4Attribute2: '#123abc',
						},
					},
				},
			],
		} )

		expect( replaceGlobalColorAttributes( dummyAttributes, dummyColorsBeforeReset, dummyColorsAfterReset, { includeSlugNames: true } ) ).toEqual( {
			level1Attribute1: 'var(--stk-global-color-111abc, #ffffff)',
			level1Attribute2: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc)',
			level1Attribute3: '#ffffff',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111abe, #cccf11)' },
				{
					level2Attribute4: {
						level3Attribute1: 'var(--dummy-style, #123abc)',
						level3Attribute2: 'var(--stk-global-color-111abc, #ffffff)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111abe, #cccf11); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: '#123abc',
							level4Attribute2: '#123abc',
						},
					},
				},
			],
		} )

		expect( replaceGlobalColorAttributes( dummyAttributes, dummyColorsBeforeReset, dummyColorsAfterReset, { includeSlugNames: true, includeColorVar: false } ) ).toEqual( {
			level1Attribute1: 'var(--stk-global-color-111abc, #123abc)',
			level1Attribute2: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc)',
			level1Attribute3: '#ffffff',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111abe, #123abc)' },
				{
					level2Attribute4: {
						level3Attribute1: 'var(--dummy-style, #123abc)',
						level3Attribute2: 'var(--stk-global-color-111abc, #123abc)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111abe, #123abc); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: '#123abc',
							level4Attribute2: 'var(--stk-global-color-111abf, #123abc)',
						},
					},
				},
			],
		} )
	} )
} )

describe( 'updateFallbackCOlorAttributes', () => {
	it( 'should update all global color fallbak color attributes', () => {
		const dummyAttributes = {
			level1Attribute1: 'var(--stk-global-color-111abc, #444abc)',
			level1Attribute2: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc)',
			level1Attribute3: 'stk-global-color-111111',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111abe, #342add)' },
				{
					level2Attribute4: {
						level3Attribute1: 'stk-global-color-111112',
						level3Attribute2: 'var(--stk-global-color-111abc, #463dea)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111abe, #1da342); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: 'stk-global-color-111114',
							level4Attribute2: 'var(--stk-global-color-111abf, #bccd33)',
						},
					},
				},
			],
		}

		const dummyColors = [
			{
				name: 'Dummy Color 1', slug: 'stk-global-color-111111', colorVar: '--stk-global-color-111abc', fallback: '#123abc', color: 'var(--stk-global-color-111abc, #123abc)',
			},
			{
				name: 'Dummy Color 2', slug: 'stk-global-color-111112', colorVar: '--stk-global-color-111abd', fallback: 'var(--dummy-style, #123abc)', color: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc))',
			},
			{
				name: 'Dummy Color 3', slug: 'stk-global-color-111113', colorVar: '--stk-global-color-111abe', fallback: '#123abc', color: 'var(--stk-global-color-111abe, #123abc)',
			},
			{
				name: 'Dummy Color 4', slug: 'stk-global-color-111114', colorVar: '--stk-global-color-111abf', fallback: '#123abc', color: 'var(--stk-global-color-111abf, #123abc)',
			},
		]

		expect( updateFallbackColorAttributes( dummyAttributes, dummyColors ) ).toEqual(
			{
				level1Attribute1: 'var(--stk-global-color-111abc, #123abc)',
				level1Attribute2: 'var(--stk-global-color-111abd, var(--dummy-style, #123abc)',
				level1Attribute3: 'stk-global-color-111111',
				level1Attribute4: [
					{ level2Attribute1: '#123456' },
					{ level2Attribute2: 'center' },
					{ level2Attribute3: 'var(--stk-global-color-111abe, #123abc)' },
					{
						level2Attribute4: {
							level3Attribute1: 'stk-global-color-111112',
							level3Attribute2: 'var(--stk-global-color-111abc, #123abc)',
							level3Attribute3: '<span style="color: var(--stk-global-color-111abe, #123abc); background-color: #123456;">Dummy Text</span>',
							level3Attribute4: {
								level4Attribute1: 'stk-global-color-111114',
								level4Attribute2: 'var(--stk-global-color-111abf, #123abc)',
							},
						},
					},
				],
			}
		)
	} )
} )
