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
			// get all <a> tags for inner columns
			const children = el.querySelectorAll( '.stk-block-link' )

			// prevents redirecting to the inner column link
			const onClickHandler = function( e ) {
				e.preventDefault()
			}

			const mouseMoveHandler = function( e ) {
				// How far the mouse has been moved
				const dx = e.clientX - initialClientX

				// Scroll the element
				el.scrollTo( {
					left: initialScrollLeft - dx,
				} )

				// Prevent selection of contents because of dragging.
				e.preventDefault()
				// adds the on click event listener to each inner column
				children.forEach( child => {
					child.addEventListener( 'click', onClickHandler )
				 } )
			}

			const mouseUpHandler = function() {
				document.body.removeEventListener( 'mousemove', mouseMoveHandler )
				document.body.removeEventListener( 'mouseup', mouseUpHandler )

				el.style.cursor = ''

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
					// removed the on click event listeners to allow redirecting to inner column links
					children.forEach( child => {
						child.removeEventListener( 'click', onClickHandler )
					 } )
				}, 500 )
			}

			const mouseDownHandler = function( e ) {
				// Change the cursor and prevent user from selecting the text
				el.style.cursor = 'grabbing'

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
