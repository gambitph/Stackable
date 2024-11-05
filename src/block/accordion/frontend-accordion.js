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
		const isAnimationDisabled = ( ! ( 'ResizeObserver' in window ) || reduceMotion )

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

					// Prevent text selection while animating
					el.style.userSelect = 'none'

					clearTimeout( el.textSelectTimeout )

					// When inside columns, flex prevents the accordion closing animation, this hack fixes it.
					const doWrapHack = !! el.closest( '.stk-block-columns' )
					let wrapper = null

					if ( doWrapHack ) {
						wrapper = addWrapperHack( el )
					}

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

					// When the animation is done, remove wrapper and allow text selection again.
					el.anim.onfinish = el.anim.oncancel = () => {
						if ( doWrapHack ) {
							removeWrapperHack( el, wrapper )
						}
						el.style.userSelect = 'auto'
					}

					// Fallback to make sure accordion text is selectable just incase the onfinish or oncancel doesn't fire.
					el.textSelectTimeout = setTimeout( () => {
						el.style.userSelect = 'auto'
					}, 700 )
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
					! Array.from( el.classList ).includes( 'stk--is-open' ) ? 'add' : 'remove'
				]( 'stk--is-open' )

				// When the accordion is triggered to open/close, we animate
				// from this current height.
				el.dataset.preHeight = el.dataset.height

				if ( ! isAnimationDisabled ) {
					// Trigger the animation when the accordion is opened/closed.
					el.doAnimate = true
				}

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

				// If an accordion with large content is closed while opening
				// another accordion, it scrolls downwards.
				// This is to instantly scroll to the opening accordion.
				if ( el.open ) {
					const isAboveView = el.getBoundingClientRect().top < 0
					if ( isAboveView ) {
						el.scrollIntoView( {
							inline: 'start',
							block: 'start',
							behavior: 'instant',
						} )
					}
				}

				// If the accordion has an anchor ID, update the URL hash.
				if ( el.open && el.getAttribute( 'id' ) && window.location.hash !== el.getAttribute( 'id' ) ) {
					// use history API to update the URL hash without scrolling the page
					history.pushState( {}, '', `#${ el.getAttribute( 'id' ) }` )
				}

				// If accordion is closed, remove the URL hash because if accordion is closed and the URL hash matches the ID,
				// the accordion won't open if an anchor linked to the accordion was clicked.
				if ( ! el.hasAttribute( 'open' ) && el.getAttribute( 'id' ) &&
					window.location.hash === `#${ el.getAttribute( 'id' ) }` ) {
					history.pushState( {}, '', window.location.href.replace( `#${ el.getAttribute( 'id' ) }`, '' ) )
				}
			} )
		} )

		const els = document.querySelectorAll( '.stk-block-accordion' )
		const elsAnchors = {}
		els.forEach( el => {
			if ( ! el._StackableHasInitAccordion ) {
				el.contentEl = el.querySelector( '.stk-block-accordion__content' )
				if ( ! isAnimationDisabled ) {
					RO.observe( el )
				}
				MO.observe( el, {
					attributeFilter: [ 'open' ],
					attributeOldValue: true,
				} )

				if ( el.getAttribute( 'id' ) ) {
					elsAnchors[ el.getAttribute( 'id' ) ] = el
				}
				el._StackableHasInitAccordion = true
			}
		} )

		// Add window event listener only when there are accordion anchors
		if ( Object.keys( elsAnchors ).length ) {
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.addEventListener( 'hashchange', () => {
				const hash = window.location.hash.slice( 1 )
				if ( hash in elsAnchors ) {
					elsAnchors[ hash ].setAttribute( 'open', '' )
				}
			} )

			// Opens the accordion on first load when there is a hash in the URL.
			const hash = window.location.hash.slice( 1 )
			if ( hash in elsAnchors ) {
				elsAnchors[ hash ].setAttribute( 'open', '' )
			}
		}

		const addWrapperHack = el => {
			// wrap el with div if it is inside a columns block
			const wrapper = document.createElement( 'div' )
			wrapper.classList.add( 'stk-block-accordion__wrapper' )
			el.parentNode.insertBefore( wrapper, el )
			wrapper.appendChild( el )
			const svg = el.querySelector( 'summary .stk--svg-wrapper:not(.stk--has-icon2)' )
			if ( svg ) {
				const rotate = el.open ? { from: 0, to: 180 } : { from: 180, to: 0 }
				svg.anim = svg.animate( {
					transform: [ `rotate(${ rotate.from }deg)`, `rotate(${ rotate.to }deg)` ],
				}, {
					duration: 700,
					easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)',
				} )
			}
			return wrapper
		}

		const removeWrapperHack = ( el, wrapper ) => {
			// Unwrap el from the div
			wrapper.parentNode?.insertBefore( el, wrapper )
			wrapper?.remove()
		}
	}
}

window.stackableAccordion = new StackableAccordion()

// Open closed accordions when printing
// and close them again after printing
window?.matchMedia( 'print' ).addEventListener( 'change', event => {
	if ( event.matches ) {
		const els = document.querySelectorAll( 'details.stk-block-accordion:not([open])' )
		for ( const el of els ) {
			el.setAttribute( 'open', '' )
			// Mark the elements so they can be closed again after printing
			el.dataset.wasclosed = ''
		}
	} else {
		const els = document.body.querySelectorAll( 'details.stk-block-accordion[data-wasclosed]' )
		for ( const el of els ) {
			el.removeAttribute( 'open' )
			delete el.dataset.wasclosed
		}
	}
} )

domReady( window.stackableAccordion.init )
