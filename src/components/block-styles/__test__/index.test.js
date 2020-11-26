/**
 * Internal dependencies
 */
import BlockStyles, {
	addBlockClassNames, combineStyleRules, generateStyles,
} from '../'
import { render } from '@testing-library/react'
import { minifyCSS } from '~stackable/util'

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

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+min-width:900px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render desktop and tablet only styles', () => {
		const styles = {
			desktopTablet: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+min-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render tablet and mobile', () => {
		const styles = {
			tablet: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+max-width:900px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render tablet only', () => {
		const styles = {
			tabletOnly: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+max-width:900px[^\{]+\{\.test{color:red/ ) )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+min-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render mobile only', () => {
		const styles = {
			mobile: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media[^\{]+max-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render ie11 styles', () => {
		const styles = {
			ie11: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( minifyCSS( results.join( '' ) ) ).toEqual( expect.stringMatching( /@media screen and [^\{]+-ms-high-contrast:active[^\{]+,screen and [^\{]+-ms-high-contrast:none[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render editor only styles', () => {
		const styles = {
			editor: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400, true )
		expect( minifyCSS( results.join( '' ) ) ).toMatch( /.test\s*{\s*color:\s*red/ )
		expect( minifyCSS( results.join( '' ) ) ).toContain( '#editor' )
	} )
} )

describe( 'BlockStyles', () => {
	it( 'should render styles', () => {
		const { container } = render( <BlockStyles style={ { '.test': { color: 'red' } } } /> )
		expect( container.querySelector( 'style' ).innerHTML ).toBe( '.test{color:red}' )
	} )

	it( 'should render nothing when there are no styles given', () => {
		const { container } = render( <BlockStyles style={ {} } /> )
		expect( container.querySelector( 'style' ) ).toBeFalsy()
	} )

	it( 'should render breakpoints', () => {
		const styles = {
			'.desktop': {
				color: 'yellow',
			},
			tablet: {
				'.tablet': {
					color: 'red',
				},
			},
			mobile: {
				'.mobile': {
					color: 'blue',
				},
			},
		}
		const { container } = render( <BlockStyles style={ styles } breakTablet="900" breakMobile="400" /> )
		const results = container.querySelector( 'style' ).innerHTML

		expect( results ).toEqual( expect.stringMatching( /.desktop\{color:yellow/ ) )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+900px[^\}]+.tablet\{color:red/ ) )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+400px[^\}]+.mobile\{color:blue/ ) )
	} )

	it( 'should render block classnames', () => {
		const style = {
			'.test': { color: 'red' },
			'.main': { color: 'blue' },
		}
		const { container } = render( <BlockStyles style={ style } blockMainClassName="main" blockUniqueClassName="unique" /> )
		expect( container.querySelector( 'style' ).innerHTML ).toBe( '.unique .test{color:red}.unique.main{color:blue}' )
	} )

	it( 'should not render editor styles', () => {
		const style = {
			'.test': { color: 'red' },
			editor: {
				'.editor': { color: 'blue' },
			},
		}
		const { container } = render( <BlockStyles style={ style } editorMode={ false } /> )
		expect( container.querySelector( 'style' ).innerHTML ).not.toEqual( expect.stringMatching( /.editor/ ) )
	} )

	it( 'should render editor styles', () => {
		const style = {
			'.test': { color: 'red' },
			editor: {
				'.editor': { color: 'blue' },
			},
		}
		const { container } = render( <BlockStyles style={ style } editorMode={ true } /> )
		expect( container.querySelector( 'style' ).innerHTML ).toEqual( expect.stringMatching( /.editor/ ) )
		expect( container.querySelector( 'style' ).innerHTML ).toEqual( expect.stringMatching( /#editor/ ) )
	} )

	it( 'should render editor responsive styles', () => {
		const style = {
			'.test': { color: 'red' },
			editor: {
				'.editor': { color: 'blue' },
				tablet: {
					'.tablet': { color: 'yellow' },
				},
				mobile: {
					'.mobile': { color: 'green' },
				},
			},
		}
		const { container } = render( <BlockStyles style={ style } editorMode={ true } breakTablet="900" breakMobile="400" /> )
		expect( container.innerHTML ).toEqual( expect.stringMatching( /<style\s*>/ ) )
		expect( container.innerHTML ).toEqual( expect.stringMatching( /.editor/ ) )
		expect( container.innerHTML ).toEqual( expect.stringMatching( /#editor .editor\s*{\s*color:\s*blue/ ) )
		expect( container.innerHTML ).toEqual( expect.stringMatching( /@media[^\{]+900px[^\}]+#editor .tablet\s*{\s*color:\s*yellow/ ) )
		expect( container.innerHTML ).toEqual( expect.stringMatching( /@media[^\{]+400px[^\}]+#editor .mobile\s*{\s*color:\s*green/ ) )
	} )
} )
