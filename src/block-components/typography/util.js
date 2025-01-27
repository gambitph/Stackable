import { escapeHTML } from '@wordpress/escape-html'

export const escapeHTMLIfInvalid = html => {
	const parser = new DOMParser()
	const doc = parser.parseFromString( html, 'text/html' )
	const parseError = doc.querySelector( 'parsererror' )
	const serialized = doc.body.innerHTML.trim()

	// If valid, return the raw HTML
	if ( ! parseError && serialized === html.trim() ) {
		return html
	}
	return escapeHTML( html )
}
