/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableExpand {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-expand .stk-button' )
		const blocks = document.querySelectorAll( '.stk-block-expand' )

		const onClick = event => {
			const el = event.target.closest( '.stk-block-expand' )

			// Invert the hidden text.
			const visibles = el.querySelectorAll( '[aria-hidden="false"]' )
			const hiddens = el.querySelectorAll( '[aria-hidden="true"]' )
			hiddens.forEach( el => el.setAttribute( 'aria-hidden', 'false' ) )
			visibles.forEach( el => el.setAttribute( 'aria-hidden', 'true' ) )

			// Refocus on the hide/show button.
			el.querySelector( `.stk-button[aria-hidden="false"]` ).focus( {
				preventScroll: true,
			} )

			event.preventDefault()
		}

		const addAriaAttributes = el => {
			const shortText = el.querySelector( '.stk-block-expand__short-text' )
			const showBtn = el.querySelector( '.stk-block-expand__show-button > .stk-button' )
			const moreText = el.querySelector( '.stk-block-expand__more-text' )
			const hideBtn = el.querySelector( '.stk-block-expand__hide-button > .stk-button' )

			shortText.setAttribute( 'id', shortText.getAttribute( 'data-block-id' ) )
			moreText.setAttribute( 'id', moreText.getAttribute( 'data-block-id' ) )

			showBtn.setAttribute( 'aria-controls', shortText.getAttribute( 'data-block-id' ) )
			hideBtn.setAttribute( 'aria-controls', moreText.getAttribute( 'data-block-id' ) )
		}

		const fixAriaAttributes = el => {
			if ( el.hasAttribute( 'aria-expanded' ) ) {
				el.removeAttribute( 'aria-expanded' )
			}
		}

		els.forEach( el => {
			if ( ! el._StackableHasInitExpand ) {
				el.addEventListener( 'click', onClick )
				el._StackableHasInitExpand = true
			}
		} )

		blocks.forEach( block => {
			if ( ! block._StackableHasInitExpandFix ) {
				fixAriaAttributes( block )
				addAriaAttributes( block )
				block._StackableHasInitExpandFix = true
			}
		} )
	}
}

window.stackableExpand = new StackableExpand()
domReady( window.stackableExpand.init )
