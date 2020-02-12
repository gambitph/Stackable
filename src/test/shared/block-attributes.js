const blockAttributeTests = props => {
	const {
		attributes = {},
	} = props.settings

	test( 'selectors should not have :nth-child', () => {
		Object.values( attributes ).filter( attributes => attributes.selector ).forEach( attributes => {
			expect( attributes.selector ).not.toMatch( /:nth-child\w/ )
		} )
	} )

	test( 'should not have old custom CSS selectors (< 1.16), custom-css module does this already', () => {
		expect( Object.keys( attributes ) ).not.toContain( 'customCSSUniqueID' )
		expect( Object.keys( attributes ) ).not.toContain( 'customCSS' )
		expect( Object.keys( attributes ) ).not.toContain( 'customCSSCompiled' )
	} )
}

export default blockAttributeTests
