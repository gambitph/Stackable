import { getShadowFilterValue } from '../'

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
