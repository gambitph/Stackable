/**
 * Internal dependencies
 */
import { addBlockClassNames, combineStyleRules } from '../'

describe( 'Add Block Class Names', () => {
	test( 'should work', () => {
		const styles1 = {
			'.aa': {},
			'.aa, .aab': {},
			'.bb': { margin: 0 },
		}
		const newClassNames = addBlockClassNames( styles1, 'aa', 'unique' )
		expect( Object.keys( newClassNames )[ 0 ] ).toBe( '.unique.aa' )
		expect( Object.keys( newClassNames )[ 1 ] ).toBe( '.unique.aa, .unique .aab' )
		expect( Object.keys( newClassNames )[ 2 ] ).toBe( '.unique .bb' )
		expect( Object.keys( Object.values( newClassNames )[ 2 ] )[ 0 ] ).toBe( 'margin' )
		expect( Object.values( Object.values( newClassNames )[ 2 ] )[ 0 ] ).toBe( 0 )
	} )
} )

describe( 'Combine Style Rules', () => {
	test( 'should work', () => {
		expect( combineStyleRules( {} ) ).toBe( '' )
		expect( combineStyleRules( {
			'.class': {},
		} ) ).toBe( '' )
		expect( combineStyleRules( {
			'.class': {},
			'.class2': {},
			'.class3': {
				margin: undefined,
			},
		} ) ).toBe( '' )
		expect( combineStyleRules( {
			'.class': {
				margin: 0,
			},
		} ) ).toBe( '.class{margin:0}' )
		expect( combineStyleRules( {
			'.class': {
				margin: 0,
				padding: 0,
			},
		} ) ).toBe( '.class{margin:0;padding:0}' )
		expect( combineStyleRules( {
			'.class': {
				margin: 0,
				padding: 0,
			},
			'.class2': {
				margin: 0,
			},
		} ) ).toBe( '.class{margin:0;padding:0}.class2{margin:0}' )
		expect( combineStyleRules( {
			'.class': {
				margin: 0,
				padding: 0,
			},
			'.class2': {
			},
			'.class3:after': {
				margin: 0,
				content: '""',
			},
		} ) ).toBe( '.class{margin:0;padding:0}.class3:after{margin:0;content:""}' )
	} )

	test( 'should adjust style rule names', () => {
		expect( combineStyleRules( {
			'.class': {
				marginRight: 0,
				padding: 0,
				BorderTopRadius: 0,
				'--customProp': 0,
			},
		} ) ).toBe( '.class{margin-right:0;padding:0;border-top-radius:0;--custom-prop:0}' )
	} )
} )
