/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableHorizontalScroller {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-horizontal-scroller > .stk-block-content' )
		let dragTimeout = null
		let initialScrollLeft = 0
		let initialClientX = 0

		els.forEach( el => {
			const mouseMoveHandler = function( e ) {
				// How far the mouse has been moved
				const dx = e.clientX - initialClientX

				// Scroll the element
				el.scrollTo( {
					left: initialScrollLeft - dx,
				} )
			}

			const mouseUpHandler = function() {
				document.body.removeEventListener( 'mousemove', mouseMoveHandler )
				document.body.removeEventListener( 'mouseup', mouseUpHandler )

				el.style.cursor = ''
				el.style.removeProperty( 'user-select' )

				// This smooth scrolls to the place where we're supposed to snap.
				const oldScrollLeft = el.scrollLeft
				el.classList.remove( 'stk--snapping-deactivated' )
				const newScrollLeft = el.scrollLeft
				el.classList.add( 'stk--snapping-deactivated' )

				el.scrollLeft = oldScrollLeft
				el.scrollTo( {
					left: newScrollLeft,
					behavior: 'smooth',
				} )

				dragTimeout = setTimeout( () => {
					el.classList.remove( 'stk--snapping-deactivated' )
				}, 500 )
			}

			const mouseDownHandler = function( e ) {
				// Change the cursor and prevent user from selecting the text
				el.style.cursor = 'grabbing'
				el.style.userSelect = 'none'

				clearTimeout( dragTimeout )
				el.classList.add( 'stk--snapping-deactivated' )

				// The current scroll
				initialScrollLeft = el.scrollLeft
				// Get the current mouse position
				initialClientX = e.clientX

				document.body.addEventListener( 'mousemove', mouseMoveHandler )
				document.body.addEventListener( 'mouseup', mouseUpHandler )
			}

			el.addEventListener( 'mousedown', mouseDownHandler )
		} )
	}
}

window.stackableHorizontalScroller = new StackableHorizontalScroller()
domReady( window.stackableHorizontalScroller.init )
