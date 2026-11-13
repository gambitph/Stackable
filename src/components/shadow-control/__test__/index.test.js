import { PRESET_SOURCES } from '~stackable/hooks'
import { getShadowFilterValue, getShadowPresetSections } from '../'

describe( 'getShadowFilterValue', () => {
	it( 'resolves a selected preset to its raw shadow for advanced editing', () => {
		const presets = [
			{ shadow: 'none' },
			{ shadow: '0 5px 5px 0 #123f5209' },
		]

		expect( getShadowFilterValue(
			1,
			presets,
			'var(--stk--preset--shadow--shadow-3, 0 5px 5px 0 #123f5209)'
		) ).toBe( '0 5px 5px 0 #123f5209' )
	} )

	it( 'keeps custom shadow values unchanged', () => {
		expect( getShadowFilterValue(
			'custom',
			[],
			'2px 4px 8px 0 #00000040'
		) ).toBe( '2px 4px 8px 0 #00000040' )
	} )

	it( 'falls back to the stored value when a selected preset is unavailable', () => {
		expect( getShadowFilterValue(
			3,
			[],
			'2px 4px 8px 0 #00000040'
		) ).toBe( '2px 4px 8px 0 #00000040' )
	} )
} )

describe( 'getShadowPresetSections', () => {
	const presets = [
		{
			name: 'No shadow', shadow: 'none', value: 'none',
		},
		{
			name: 'Theme', shadow: '1px 1px #000', value: 'theme', source: PRESET_SOURCES.WORDPRESS,
		},
		{
			name: 'Stackable', shadow: '2px 2px #000', value: 'stackable', source: PRESET_SOURCES.STACKABLE,
		},
	]

	it( 'separates WordPress and Stackable presets while preserving their indexes', () => {
		expect( getShadowPresetSections( presets, false ) ).toEqual( [
			{ source: '', presets: [ { preset: presets[ 0 ], index: 0 } ] },
			{ source: PRESET_SOURCES.WORDPRESS, presets: [ { preset: presets[ 1 ], index: 1 } ] },
			{ source: PRESET_SOURCES.STACKABLE, presets: [ { preset: presets[ 2 ], index: 2 } ] },
		] )
	} )

	it( 'keeps caller-supplied presets in one section', () => {
		expect( getShadowPresetSections( presets, true ) ).toEqual( [ {
			source: '',
			presets: presets.map( ( preset, index ) => ( { preset, index } ) ),
		} ] )
	} )

	it( 'labels the remaining source when all Stackable presets are duplicates', () => {
		expect( getShadowPresetSections( presets.slice( 0, 2 ), false ) ).toEqual( [
			{ source: '', presets: [ { preset: presets[ 0 ], index: 0 } ] },
			{ source: PRESET_SOURCES.WORDPRESS, presets: [ { preset: presets[ 1 ], index: 1 } ] },
		] )
	} )
} )
