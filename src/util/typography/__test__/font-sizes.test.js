import { getFontSizes, getDefaultFontSize } from '../font-sizes'

describe( 'getFontSizes', () => {
	it( 'should grab font sizes correctly in an editor block', () => {
		const style = document.createElement( 'style' )
		style.innerHTML = `
		.editor-styles-wrapper .wp-block h1 {
			font-size: 40px;
		}
		.editor-styles-wrapper .wp-block p {
			font-size: 18px;
		}`
		document.body.appendChild( style )

		expect( getFontSizes( [ 'h1', 'p' ] ) ).toEqual( { h1: 40, p: 18 } )

		document.body.removeChild( style )
	} )
} )

describe( 'getDefaultFontSize', () => {
	it( 'should get the default font size', () => {
		const style = document.createElement( 'style' )
		style.innerHTML = `
		.editor-styles-wrapper .wp-block p {
			font-size: 24px;
		}`
		document.body.appendChild( style )

		expect( getDefaultFontSize( 'p', true ) ).toBe( 24 )

		document.body.removeChild( style )
	} )
} )
