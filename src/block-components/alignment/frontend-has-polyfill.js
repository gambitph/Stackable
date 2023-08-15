/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableAlignmentPolyfill {
	init = () => {
		const modifyCSS = () => {
			const containers = document.querySelectorAll( '.stk-container' )
			containers.forEach( container => {
				const columnFlex = container.querySelector( ':scope > .stk--column-flex' )
				if ( columnFlex ) {
					container.classList.add( 'stk-container--has-child-column-flex-polyfill' )
				}
			} )

			const blocks = document.querySelectorAll( ':is(.stk-block-content, .stk-inner-blocks):not(.stk--column-flex)' )
			blocks.forEach( block => {
				const hasMargin = block.querySelector( ':scope > .stk--block-margin-top-auto, :scope > .stk--block-margin-bottom-auto' )
				if ( hasMargin ) {
					block.classList.add( 'stk--height-100-polyfill' )
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

window.stackableAlignmentPolyfill = new StackableAlignmentPolyfill()
domReady( window.stackableAlignmentPolyfill.init )
