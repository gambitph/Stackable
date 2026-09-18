/**
 * Internal dependencies
 */
import {
	isPassThroughLinkValue,
	isUrlLike,
	isValidLinkValue,
	normalizeLinkValue,
} from '../validate'

describe( 'link-control validation', () => {
	it( 'treats empty values as pass-through', () => {
		expect( isPassThroughLinkValue( '' ) ).toBe( true )
		expect( isPassThroughLinkValue( '   ' ) ).toBe( true )
		expect( isPassThroughLinkValue( undefined ) ).toBe( true )
		expect( isValidLinkValue( '' ) ).toBe( true )
	} )

	it( 'allows shortcodes without treating them as URLs', () => {
		expect( isPassThroughLinkValue( '[my_shortcode]' ) ).toBe( true )
		expect( isPassThroughLinkValue( '[contact-form-7 id="1"]' ) ).toBe( true )
		expect( isPassThroughLinkValue( '[site.url]' ) ).toBe( true )
		expect( isValidLinkValue( '[my_shortcode]' ) ).toBe( true )
		expect( normalizeLinkValue( '[my_shortcode]' ) ).toBe( '[my_shortcode]' )
	} )

	it( 'allows dynamic content tokens', () => {
		const token = '!#stk_dynamic/current-page/url!#'
		expect( isPassThroughLinkValue( token ) ).toBe( true )
		expect( isValidLinkValue( token ) ).toBe( true )
		expect( normalizeLinkValue( token ) ).toBe( token )
	} )

	it( 'allows other non-URL strings', () => {
		expect( isPassThroughLinkValue( '{{permalink}}' ) ).toBe( true )
		expect( isPassThroughLinkValue( '%post_url%' ) ).toBe( true )
		expect( isPassThroughLinkValue( 'hello' ) ).toBe( true )
		expect( isValidLinkValue( 'hello' ) ).toBe( true )
		expect( isUrlLike( 'hello' ) ).toBe( false )
	} )

	it( 'recognizes URL-like values', () => {
		expect( isUrlLike( 'https://example.com' ) ).toBe( true )
		expect( isUrlLike( 'example.com' ) ).toBe( true )
		expect( isUrlLike( 'www.example.com' ) ).toBe( true )
		expect( isUrlLike( '#section' ) ).toBe( true )
		expect( isUrlLike( '/about' ) ).toBe( true )
		expect( isUrlLike( 'mailto:hi@example.com' ) ).toBe( true )
	} )

	it( 'accepts valid URLs, anchors, and relative paths', () => {
		expect( isValidLinkValue( 'https://example.com' ) ).toBe( true )
		expect( isValidLinkValue( '#section' ) ).toBe( true )
		expect( isValidLinkValue( '/about' ) ).toBe( true )
		expect( isValidLinkValue( '../parent' ) ).toBe( true )
		expect( isValidLinkValue( 'mailto:hi@example.com' ) ).toBe( true )
	} )

	it( 'rejects incomplete URL-like values', () => {
		expect( isValidLinkValue( 'https://' ) ).toBe( false )
		expect( isValidLinkValue( 'http://' ) ).toBe( false )
	} )

	it( 'prepends https to bare domains on normalize', () => {
		expect( normalizeLinkValue( 'example.com' ) ).toBe( 'https://example.com' )
		expect( normalizeLinkValue( '  example.com  ' ) ).toBe( 'https://example.com' )
		expect( normalizeLinkValue( 'https://example.com' ) ).toBe( 'https://example.com' )
		expect( normalizeLinkValue( '#section' ) ).toBe( '#section' )
		expect( normalizeLinkValue( '/about' ) ).toBe( '/about' )
	} )
} )
