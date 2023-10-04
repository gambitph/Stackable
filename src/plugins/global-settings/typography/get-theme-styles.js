export const getThemeStyles = () => {
	const iframe = document.querySelector( 'iframe[name="editor-canvas"]' )
	let themeStyles = ''

	if ( iframe ) {
		const doc = iframe.contentDocument || iframe.contentWindow.document

		// theme styles are stored in <style> tags that are direct children of body
		let styleList = doc.querySelectorAll( 'body style' )

		// converts node list to array
		styleList = Array.from( styleList )

		styleList.forEach( style => {
			// retrieves css rules with .editor-styles-wrapper only
			if ( ! style.hasAttribute( 'id' ) && style.innerHTML.includes( '.editor-styles-wrapper' ) ) {
				themeStyles += style.innerHTML
			}
		} )
	}
	return themeStyles
}
