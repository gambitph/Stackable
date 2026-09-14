/**
 * Internal dependencies
 */
import {
	addBlockClassNames, combineStyleRules, generateStyles,
} from '../'
import { minifyCSS } from '~stackable/util'

describe( 'Add Block Class Names', () => {
	test( 'should work', () => {
		const styles1 = {
			'.aa': {},
			'.aa, .aab': {},
			'.bb': { margin: 0 },
		}
		const newClassNames = addBlockClassNames( styles1, 'unique' )
		expect( Object.keys( newClassNames )[ 0 ] ).toBe( '.unique .aa' )
		expect( Object.keys( newClassNames )[ 1 ] ).toBe( '.unique .aa, .unique .aab' )
		expect( Object.keys( newClassNames )[ 2 ] ).toBe( '.unique .bb' )
		expect( Object.keys( Object.values( newClassNames )[ 2 ] )[ 0 ] ).toBe( 'margin' )
		expect( Object.values( Object.values( newClassNames )[ 2 ] )[ 0 ] ).toBe( 0 )
	} )
} )

describe( 'Combine Style Rules', () => {
	test( 'should work', () => {
		expect( combineStyleRules( {} ) ).toEqual( [] )
		expect( combineStyleRules( {
			'.class': {},
		} )[ 0 ] ).toMatch( /.class\s*\{\s*\}/ )
		expect( combineStyleRules( {
			'.class': {},
			'.class2': {},
			'.class3': {
				margin: undefined,
			},
		} )[ 0 ] ).toMatch( /.class\s*\{\s*\}/ )
		expect( combineStyleRules( {
			'.class': {},
			'.class2': {},
			'.class3': {
				margin: undefined,
			},
		} )[ 1 ] ).toMatch( /.class2\s*\{\s*\}/ )
		expect( combineStyleRules( {
			'.class': {},
			'.class2': {},
			'.class3': {
				margin: undefined,
			},
		} )[ 2 ] ).toMatch( /.class3\s*\{\s*\}/ )

		expect( combineStyleRules( {
			'.class': {
				margin: 0,
			},
		} )[ 0 ] ).toMatch( /.class\s*\{\s*margin:\s*0;\s*}/ )
		expect( combineStyleRules( {
			'.class': {
				margin: 0,
				padding: 0,
			},
		} )[ 0 ] ).toMatch( /.class\s*\{\s*margin:\s*0;\s*padding:\s*0;\s*}/ )
		expect( combineStyleRules( {
			'.class': {
				margin: 0,
				padding: 0,
			},
			'.class2': {
				margin: 0,
			},
		} )[ 1 ] ).toMatch( /.class2\s*\{\s*margin:\s*0;\s*}/ )
	} )

	test( 'should adjust style rule names', () => {
		expect( combineStyleRules( {
			'.class': {
				marginRight: 0,
				padding: 0,
				BorderTopRadius: 0,
				'--customProp': 0,
			},
		} )[ 0 ] ).toMatch( /.class\s*\{\s*margin-right:\s*0;\s*padding:\s*0;\s*border-top-radius:\s*0;\s*--custom-prop:\s*0;\s*\}/ )
	} )
} )

describe( 'generateStyles', () => {
	it( 'should render basic styles', () => {
		const styles = {
			'.test': { color: 'red' },
		}
		expect( minifyCSS( generateStyles( styles ).join( '' ) ) ).toMatch( '.test{color:red}' )
	} )

	it( 'should render desktop only styles', () => {
		const styles = {
			desktopOnly: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+min-width:900px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render desktop and tablet only styles', () => {
		const styles = {
			desktopTablet: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+min-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render tablet and mobile', () => {
		const styles = {
			tablet: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+max-width:899px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render tablet only', () => {
		const styles = {
			tabletOnly: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+max-width:899px[^\{]+\{\.test{color:red/ ) )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+min-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render mobile only', () => {
		const styles = {
			mobile: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+max-width:399px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render ie11 styles', () => {
		const styles = {
			ie11: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media screen and [^\{]+-ms-high-contrast:active[^\{]+,screen and [^\{]+-ms-high-contrast:none[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render editor only styles', () => {
		const styles = {
			editor: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', 900, 400, true )
		expect( minifyCSS( results.join( '' ) ) ).toMatch( /.test\s*{\s*color:\s*red/ )
		expect( minifyCSS( results.join( '' ) ) ).toContain( '.editor-styles-wrapper' )
	} )
} )
