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
					// get only css rules with .editor-styles-wrapper
					if ( cssRule.selectorText?.includes( '.editor-styles-wrapper' ) ) {
						themeStyles += cssRule.cssText
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
