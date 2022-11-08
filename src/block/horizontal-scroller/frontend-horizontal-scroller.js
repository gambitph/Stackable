/* eslint-disable @wordpress/no-global-event-listener */
/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableHorizontalScroller {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-horizontal-scroller:not(.editor) > .stk-block-content' )
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
				el.scrollLeft = pos[ i ].left - dx
			}

			const mouseUpHandler = function() {
				document.removeEventListener( 'mousemove', mouseMoveHandler )
				document.removeEventListener( 'mouseup', mouseUpHandler )

				el.style.cursor = 'grab'
				el.style.removeProperty( 'user-select' )
			}

			const mouseDownHandler = function( e ) {
				// Change the cursor and prevent user from selecting the text
				el.style.cursor = 'grabbing'
				el.style.userSelect = 'none'

				pos[ i ] = {
					// The current scroll
					left: el.scrollLeft,
					top: el.scrollTop,
					// Get the current mouse position
					x: e.clientX,
					y: e.clientY,
				}

				document.addEventListener( 'mousemove', mouseMoveHandler )
				document.addEventListener( 'mouseup', mouseUpHandler )
			}

			el.addEventListener( 'mousedown', mouseDownHandler )
		} )
	}
}

window.stackableHorizontalScroller = new StackableHorizontalScroller()
domReady( window.stackableHorizontalScroller.init )
