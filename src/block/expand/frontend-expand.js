/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableExpand {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-expand .stk-button' )
		const onClick = event => {
			const el = event.target.closest( '.stk-block-expand' )
			const expanded = el.getAttribute( 'aria-expanded' ) === 'true'
			el.setAttribute( 'aria-expanded', ! expanded )

			// Invert the hidden text.
			const visibles = el.querySelectorAll( '[aria-hidden="false"]' )
			const hiddens = el.querySelectorAll( '[aria-hidden="true"]' )
			hiddens.forEach( el => el.setAttribute( 'aria-hidden', 'false' ) )
			visibles.forEach( el => el.setAttribute( 'aria-hidden', 'true' ) )

			// Refocus on the hide/show button.
			el.querySelector( `.stk-button[aria-hidden="false"]` ).focus()

			event.preventDefault()
		}
		els.forEach( el => {
			el.addEventListener( 'click', onClick )
		} )
	}
}

window.stackableExpand = new StackableExpand()
domReady( window.stackableExpand.init )
