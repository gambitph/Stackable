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
			if ( el._StackableHasInitHorizontalScroller ) {
				return
			}
			// get all links, because we will need to disable them during drag
			const children = el.querySelectorAll( '.stk-block-link, a' )

			// Get all images and set draggable to false
			const images = el.querySelectorAll( 'img' )
			images.forEach( image => {
				image.draggable = false
			} )

			// prevents redirecting to the inner column link
			const onClickHandler = function( e ) {
				e.preventDefault()
				e.stopPropagation()
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
				children.forEach( child => {
					// links will trigger while dragging, this disabled the links
					// set the third parameter to true to prevent triggering the on click event for lightbox
					// check useCapture parameter: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
					child.addEventListener( 'click', onClickHandler, true )
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
					children.forEach( child => {
						// this enables the links after dragging
						child.removeEventListener( 'click', onClickHandler, true )
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

			el._StackableHasInitHorizontalScroller = true
		} )
	}
}

window.stackableHorizontalScroller = new StackableHorizontalScroller()
domReady( window.stackableHorizontalScroller.init )
