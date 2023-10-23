// This function gets all the editor-related styles by collects all the styles inside the editor iframe that contain the selector .editor-styles-wrapper.
export const getThemeStyles = () => {
	const iframe = document.querySelector( 'iframe[name="editor-canvas"]' )
	let themeStyles = ''

	if ( iframe ) {
		const doc = iframe.contentDocument || iframe.contentWindow.document

		try {
			const stylesheets = Array.from( doc.styleSheets ).filter( stylesheet => stylesheet.href === null )

			stylesheets.forEach( stylesheet => {
				const cssRules = Array.from( stylesheet.cssRules )

				cssRules.forEach( cssRule => {
					let selector = cssRule.selectorText
					const text = cssRule.cssText?.split( '{' )[ 1 ]
					let addText = false
					// get only css rules with .editor-styles-wrapper
					if ( cssRule.selectorText?.includes( 'body' ) && ! cssRule.selectorText?.includes( '.editor-styles-wrapper' ) ) {
						selector = selector.replace( 'body', '.editor-styles-wrapper' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( 'h1' ) ) {
						selector = selector.replace( 'h1', '.interface-complementary-area .editor-styles-wrapper h1' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( 'h2' ) ) {
						selector = selector.replace( 'h2', '.interface-complementary-area .editor-styles-wrapper h2' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( 'h3' ) ) {
						selector = selector.replace( 'h3', '.interface-complementary-area .editor-styles-wrapper h3' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( 'h4' ) ) {
						selector = selector.replace( 'h4', '.interface-complementary-area .editor-styles-wrapper h4' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( 'h5' ) ) {
						selector = selector.replace( 'h5', '.interface-complementary-area .editor-styles-wrapper h5' )
					}
					if ( cssRule.selectorText?.includes( 'h6' ) ) {
						selector = selector.replace( 'h6', '.interface-complementary-area .editor-styles-wrapper h6' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( 'p' ) ) {
						selector = selector.replace( 'p', '.interface-complementary-area .editor-styles-wrapper p' )
						addText = true
					}
					if ( cssRule.selectorText?.includes( '.editor-styles-wrapper' ) ) {
						addText = true
					}
					if ( addText ) {
						themeStyles += [ selector, text ].join( '{' )
					}
				} )
			} )
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'An error occurred while retrieving stylesheets', error )
		}
	}
	return themeStyles
}
