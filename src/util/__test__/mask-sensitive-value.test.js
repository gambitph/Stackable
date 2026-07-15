/**
 * Internal dependencies
 */
import { maskSensitiveValue } from '../mask-sensitive-value'

describe( 'maskSensitiveValue', () => {
	it( 'fully masks values with 12 or fewer characters', () => {
		expect( maskSensitiveValue( '' ) ).toBe( '' )
		expect( maskSensitiveValue( '123456' ) ).toBe( '******' )
		expect( maskSensitiveValue( '123456789012' ) ).toBe( '************' )
	} )

	it( 'keeps the first 6 and last 6 characters for longer values', () => {
		expect( maskSensitiveValue( '1234567890123' ) ).toBe( '123456*890123' )
		expect( maskSensitiveValue( 'abcdefghijklmnopqrstuvwxyz' ) ).toBe( 'abcdef**************uvwxyz' )
	} )
} )
