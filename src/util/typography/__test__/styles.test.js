import { createTypographyStyles } from '../styles'

describe( 'createTypographyStyles', () => {
	it( 'should clamp font sizes correctly', () => {
		let attributes = {}
		let options = {
			inheritMax: 50,
		}

		// Undefined all.
		expect( createTypographyStyles( '%s', 'desktop', attributes ).fontSize ).toBe( undefined )
		expect( createTypographyStyles( '%s', 'tablet', attributes ).fontSize ).toBe( undefined )
		expect( createTypographyStyles( '%s', 'mobile', attributes ).fontSize ).toBe( undefined )

		// No clamping.
		attributes = {
			fontSize: 30,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes ).fontSize ).toBe( '30px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes ).fontSize ).toBe( undefined )
		expect( createTypographyStyles( '%s', 'mobile', attributes ).fontSize ).toBe( undefined )

		// Clamped desktop.
		attributes = {
			fontSize: 100,
		}
		options = {
			inheritMax: 50,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '50px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( undefined )

		// Clamped mobile.
		attributes = {
			fontSize: 100,
			tabletFontSize: 200,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '200px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '50px' )

		// Clamped mobile.
		attributes = {
			tabletFontSize: 200,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( undefined )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '200px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '50px' )

		// No clamping.
		attributes = {
			fontSize: 100,
			tabletFontSize: 200,
			mobileFontSize: 300,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '200px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '300px' )

		// Not clamped.
		attributes = {
			fontSize: 100,
			tabletFontSize: 40,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '40px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( undefined )

		// Tablet only.
		attributes = {
			tabletFontSize: 40,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( undefined )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '40px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( undefined )

		// Clamped on mobile.
		attributes = {
			tabletFontSize: 100,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( undefined )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '50px' )

		// Different clamping.
		attributes = {
			fontSize: 100,
		}
		options = {
			inheritMax: 40,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '40px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( undefined )

		// Not clamped desktop, clamped mobile.
		attributes = {
			fontSize: 30,
			tabletFontSize: 100,
		}
		options = {
			inheritMax: 50,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '30px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '50px' )

		// All given.
		attributes = {
			fontSize: 30,
			tabletFontSize: 100,
			mobileFontSize: 200,
		}
		options = {
			inheritMax: 50,
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '30px' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '200px' )

		// Different units.
		attributes = {
			fontSize: 30,
			tabletFontSize: 100,
			mobileFontSize: 200,
			fontSizeUnit: 'em',
			tabletFontSizeUnit: 'px',
			mobileFontSizeUnit: 'em',
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '30em' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '100px' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '200em' )

		// Clamped will follow the unit when it was clamped.
		attributes = {
			fontSize: 100,
			fontSizeUnit: 'x',
			tabletFontSizeUnit: 'px',
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100x' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '50x' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( undefined )

		// Clamped will follow the unit when it was clamped.
		attributes = {
			fontSize: 100,
			fontSizeUnit: 'y',
			tabletFontSize: 100,
			tabletFontSizeUnit: 'x',
		}
		expect( createTypographyStyles( '%s', 'desktop', attributes, options ).fontSize ).toBe( '100y' )
		expect( createTypographyStyles( '%s', 'tablet', attributes, options ).fontSize ).toBe( '100x' )
		expect( createTypographyStyles( '%s', 'mobile', attributes, options ).fontSize ).toBe( '50x' )
	} )
} )
