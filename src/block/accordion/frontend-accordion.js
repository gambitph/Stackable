/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const ANIM_OPTS = {
	duration: 400,
	easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)',
}

class StackableAccordion {
	init = () => {
		// If reduce motion is on, don't use smooth resizing.
		const reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
		if ( ! ( 'ResizeObserver' in window ) || reduceMotion ) {
			return
		}

		// This observer is called whenever the size element is changed.
		const RO = new ResizeObserver( entries => { // eslint-disable-line compat/compat
			return entries.forEach( entry => {
				const height = entry.borderBoxSize[ 0 ].blockSize
				const el = entry.target

				// Take note of the current height of the element, this is
				// referenced in different points of the accordion.
				el.dataset.height = height

				// If the accordion is opened/closed this will trigger an
				// animation.
				if ( el.doAnimate ) {
					el.doAnimate = false
					const preHeight = el.dataset.preHeight

					// Animate the accordion height.
					el.anim = el.animate( {
						height: [ `${ preHeight }px`, `${ height }px` ],
					}, ANIM_OPTS )

					// We need to animate the content as well since it will
					// overflow out the accordion.
					if ( height - preHeight >= 0 ) {
						el.contentEl.anim = el.contentEl.animate( {
							maxHeight: [ `0px`, `${ height - preHeight }px` ],
						}, ANIM_OPTS )
					}
				}
			} )
		} )

		// This observer is called whenever the accordion's `open` attribute is
		// changed.
		const MO = new MutationObserver( function( mutations ) {
			mutations.forEach( function( mutation ) {
				const el = mutation.target

				// Cancel any animations if there are any.
				if ( el.anim ) {
					el.anim.cancel()
				}
				if ( el.contentEl.anim ) {
					el.contentEl.anim.cancel()
				}

				el.classList[
					( ! el.dataset.preHeight || ( el.dataset.preHeight < el.dataset.height ) ) ? 'add' : 'remove'
				]( 'stk--is-open' )

				// When the accordion is triggered to open/close, we animate
				// from this current height.
				el.dataset.preHeight = el.dataset.height

				// Trigger the animation when the accordion is opened/closed.
				el.doAnimate = true

				// Close other adjacent accordions if needed.
				if ( el.open && el.classList.contains( 'stk--single-open' ) ) {
					let adjacent = el.nextElementSibling
					while ( adjacent && adjacent.classList.contains( 'stk-block-accordion' ) ) {
						if ( adjacent.open ) {
							adjacent.open = false
						}
						adjacent = adjacent.nextElementSibling
					}
					adjacent = el.previousElementSibling
					while ( adjacent && adjacent.classList.contains( 'stk-block-accordion' ) ) {
						if ( adjacent.open ) {
							adjacent.open = false
						}
						adjacent = adjacent.previousElementSibling
					}
				}
			} )
		  } )

		const els = document.querySelectorAll( '.stk-block-accordion' )
		els.forEach( el => {
			el.contentEl = el.querySelector( '.stk-block-accordion__content' )
			RO.observe( el )
			MO.observe( el, {
				attributeFilter: [ 'open' ],
				attributeOldValue: true,
			} )
		} )
	}
}

window.stackableAccordion = new StackableAccordion()
domReady( window.stackableAccordion.init )
