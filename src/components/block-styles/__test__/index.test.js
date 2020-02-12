/**
 * Internal dependencies
 */
import BlockStyles, {
	addBlockClassNames, combineStyleRules, generateStyles,
} from '../'
import { render } from '@testing-library/react'

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

describe( 'generateStyles', () => {
	it( 'should render basic styles', () => {
		const styles = {
			'.test': { color: 'red' },
		}
		expect( generateStyles( styles ) ).toEqual( '.test{color:red}' )
	} )

	it( 'should render desktop only styles', () => {
		const styles = {
			desktopOnly: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+min-width:900px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render desktop and tablet only styles', () => {
		const styles = {
			desktopTablet: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+min-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render tablet and mobile', () => {
		const styles = {
			tablet: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+max-width:900px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render tablet only', () => {
		const styles = {
			tabletOnly: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+max-width:900px[^\{]+\{\.test{color:red/ ) )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+min-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render mobile only', () => {
		const styles = {
			mobile: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400 )
		expect( results ).toEqual( expect.stringMatching( /@media[^\{]+max-width:400px[^\{]+\{\.test{color:red/ ) )
	} )

	it( 'should render editor only styles', () => {
		const styles = {
			editor: { '.test': { color: 'red' } },
		}

		const results = generateStyles( styles, '', '', 900, 400, true )
		expect( results ).toContain( '.test{color:red' )
		expect( results ).toContain( '#editor' )
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
} )
