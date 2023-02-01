/* eslint-disable @wordpress/no-global-event-listener */
/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableHorizontalScroller {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-horizontal-scroller > .stk-block-content' )
		let dragTimeout = null
		const pos = Array( els.length ).fill().map( ( ) => ( {
			top: 0,
			left: 0,
			x: 0,
			y: 0,
		} ) )

		els.forEach( ( el, i ) => {
			const mouseMoveHandler = function( e ) {
				// How far the mouse has been moved
				const dx = e.clientX - pos[ i ].x
				const dy = e.clientY - pos[ i ].y

				// Scroll the element
				el.scrollTop = pos[ i ].top - dy
				el.scrollTo( {
					left: pos[ i ].left - dx,
				} )
			}

			const mouseUpHandler = function() {
				document.body.removeEventListener( 'mousemove', mouseMoveHandler )
				document.body.removeEventListener( 'mouseup', mouseUpHandler )

				el.style.cursor = 'grab'
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

				pos[ i ] = {
					// The current scroll
					left: el.scrollLeft,
					top: el.scrollTop,
					// Get the current mouse position
					x: e.clientX,
					y: e.clientY,
				}

				document.body.addEventListener( 'mousemove', mouseMoveHandler )
				document.body.addEventListener( 'mouseup', mouseUpHandler )
			}

			el.addEventListener( 'mousedown', mouseDownHandler )
		} )
	}
}

window.stackableHorizontalScroller = new StackableHorizontalScroller()
domReady( window.stackableHorizontalScroller.init )
