/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableTableOfContents {
	init = () => {
		document
			.querySelectorAll(
				'.stk-block-table-of-contents .stk-block-table-of-contents__navigation'
			)
			.forEach( nav => {
				const behavior =
					nav.dataset.isSmoothScroll === 'true'
						? 'smooth'
						: 'auto'
				nav
					.querySelectorAll(
						':scope .stk-block-table-of-contents__link'
					)
					.forEach( anchor => {
						anchor.addEventListener( 'click', function( e ) {
							e.preventDefault()
							document
								.querySelector( this.getAttribute( 'href' ) )
								.scrollIntoView( {
									behavior,
								} )
						} )
					} )
			} )
	}
}

window.stackableTableOfContents = new StackableTableOfContents()
domReady( window.stackableTableOfContents.init )

