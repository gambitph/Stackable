/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableAlignment {
	init = () => {
		const modifyCSS = () => {
			const containers = document.querySelectorAll( '.stk-container' )
			containers.forEach( container => {
				const columnFlex = container.querySelector( '.stk--column-flex' )
				if ( columnFlex ) {
					container.classList.add( 'stk-container--has-child-column-flex' )
				} else if ( ! columnFlex && container.classList.contains( 'stk-container--has-child-column-flex' ) ) {
					container.classList.remove( 'stk-container--has-child-column-flex' )
				}
			} )

			const blocks = document.querySelectorAll( ':is(.stk-block-content, .stk-inner-blocks):not(.stk--column-flex)' )
			blocks.forEach( block => {
				const hasMargin = block.querySelector( ':scope > .stk--block-margin-top-auto, :scope > .stk--block-margin-bottom-auto' )
				if ( hasMargin ) {
					block.classList.add( 'stk--height-100' )
				} else if ( ! hasMargin && block.classList.contains( 'stk--height-100' ) ) {
					block.classList.remove( 'stk--height-100' )
				}
			} )
		}

		modifyCSS()
		const observerOptions = {
			childList: true,
			subtree: true,
		}

		const observer = new MutationObserver( modifyCSS )
		observer.observe( document, observerOptions )
	}
}

window.stackableAlignment = new StackableAlignment()
domReady( window.stackableAlignment.init )
