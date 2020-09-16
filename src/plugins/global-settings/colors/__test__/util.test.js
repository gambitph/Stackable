/**
 * Internal dependencies
 */
import { replaceGlobalColorAttributes, updateFallbackColorAttributes } from '../util'

describe( 'replaceGlobalColorAttributes', () => {
	it( 'should replace all global color attributes to the default colors', () => {
		const dummyAttributes = {
			level1Attribute1: 'var(--stk-global-color-111111, #123abc)',
			level1Attribute2: 'var(--stk-global-color-111112, var(--dummy-style, #123abc))',
			level1Attribute3: 'stk-global-color-111111',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111113, #123abc)' },
				{
					level2Attribute4: {
						level3Attribute1: 'stk-global-color-111112',
						level3Attribute2: 'var(--stk-global-color-111111, #123abc)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111113, #123abc); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: 'stk-global-color-111114',
							level4Attribute2: 'var(--stk-global-color-111114, #123abc)',
						},
					},
				},
			],
		}

		const dummyColorsBeforeReset = [
			{
				name: 'Dummy Color 1', slug: 'stk-global-color-111111', color: '#123abc',
			},
			{
				name: 'Dummy Color 2', slug: 'stk-global-color-111112', color: 'var(--dummy-style, #123abc)',
			},
			{
				name: 'Dummy Color 3', slug: 'stk-global-color-111113', color: '#123abc',
			},
			{
				name: 'Dummy Color 4', slug: 'stk-global-color-111114', color: '#123abc',
			},
		]
		expect( replaceGlobalColorAttributes( dummyAttributes, dummyColorsBeforeReset ) ).toEqual( {
			level1Attribute1: '#123abc',
			level1Attribute2: 'var(--dummy-style, #123abc)',
			level1Attribute3: 'stk-global-color-111111',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: '#123abc' },
				{
					level2Attribute4: {
						level3Attribute1: 'stk-global-color-111112',
						level3Attribute2: '#123abc',
						level3Attribute3: '<span style="color: #123abc; background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: 'stk-global-color-111114',
							level4Attribute2: '#123abc',
						},
					},
				},
			],
		} )

		expect( replaceGlobalColorAttributes( dummyAttributes, dummyColorsBeforeReset, { includeSlugNames: true } ) ).toEqual( {
			level1Attribute1: '#123abc',
			level1Attribute2: 'var(--dummy-style, #123abc)',
			level1Attribute3: '#123abc',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: '#123abc' },
				{
					level2Attribute4: {
						level3Attribute1: 'var(--dummy-style, #123abc)',
						level3Attribute2: '#123abc',
						level3Attribute3: '<span style="color: #123abc; background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: '#123abc',
							level4Attribute2: '#123abc',
						},
					},
				},
			],
		} )

		expect( replaceGlobalColorAttributes( dummyAttributes, dummyColorsBeforeReset, { includeSlugNames: true, includeColorVar: false } ) ).toEqual( {
			level1Attribute1: 'var(--stk-global-color-111111, #123abc)',
			level1Attribute2: 'var(--stk-global-color-111112, var(--dummy-style, #123abc))',
			level1Attribute3: '#123abc',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111113, #123abc)' },
				{
					level2Attribute4: {
						level3Attribute1: 'var(--dummy-style, #123abc)',
						level3Attribute2: 'var(--stk-global-color-111111, #123abc)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111113, #123abc); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: '#123abc',
							level4Attribute2: 'var(--stk-global-color-111114, #123abc)',
						},
					},
				},
			],
		} )
	} )
} )

describe( 'updateFallbackColorAttributes', () => {
	it( 'should update all global color fallbak color attributes', () => {
		const dummyAttributes = {
			level1Attribute1: 'var(--stk-global-color-111111, #444abc)',
			level1Attribute2: 'var(--stk-global-color-111112, var(--dummy-style, #123abc)',
			level1Attribute3: 'stk-global-color-111111',
			level1Attribute4: [
				{ level2Attribute1: '#123456' },
				{ level2Attribute2: 'center' },
				{ level2Attribute3: 'var(--stk-global-color-111113, #342add)' },
				{
					level2Attribute4: {
						level3Attribute1: 'stk-global-color-111112',
						level3Attribute2: 'var(--stk-global-color-111111, #463dea)',
						level3Attribute3: '<span style="color: var(--stk-global-color-111113, #1da342); background-color: #123456;">Dummy Text</span>',
						level3Attribute4: {
							level4Attribute1: 'stk-global-color-111114',
							level4Attribute2: 'var(--stk-global-color-111114, #bccd33)',
						},
					},
				},
			],
		}

		const dummyColors = [
			{
				name: 'Dummy Color 1', slug: 'stk-global-color-111111', color: '#123abc',
			},
			{
				name: 'Dummy Color 2', slug: 'stk-global-color-111112', color: 'var(--dummy-style, #123abc)',
			},
			{
				name: 'Dummy Color 3', slug: 'stk-global-color-111113', color: '#123abc',
			},
			{
				name: 'Dummy Color 4', slug: 'stk-global-color-111114', color: '#123abc',
			},
		]

		expect( updateFallbackColorAttributes( dummyAttributes, dummyColors ) ).toEqual(
			{
				level1Attribute1: 'var(--stk-global-color-111111, #123abc)',
				level1Attribute2: 'var(--stk-global-color-111112, var(--dummy-style, #123abc)',
				level1Attribute3: 'stk-global-color-111111',
				level1Attribute4: [
					{ level2Attribute1: '#123456' },
					{ level2Attribute2: 'center' },
					{ level2Attribute3: 'var(--stk-global-color-111113, #123abc)' },
					{
						level2Attribute4: {
							level3Attribute1: 'stk-global-color-111112',
							level3Attribute2: 'var(--stk-global-color-111111, #123abc)',
							level3Attribute3: '<span style="color: var(--stk-global-color-111113, #123abc); background-color: #123456;">Dummy Text</span>',
							level3Attribute4: {
								level4Attribute1: 'stk-global-color-111114',
								level4Attribute2: 'var(--stk-global-color-111114, #123abc)',
							},
						},
					},
				],
			}
		)
	} )
} )
