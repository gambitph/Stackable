/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableColumnsHasPolyfill {
	init = () => {
		const columns = document.querySelectorAll( 'body:not(.wp-admin) .stk-block-columns' )
		columns.forEach( block => {
			const hasSingleBlock = block.querySelector( ':scope > .stk-block-content > .stk-block-column:first-child:last-child' )
			if ( hasSingleBlock ) {
				block.classList.add( 'stk-block-columns--has-single-block-polyfill' )
			}
		} )
	}
}

window.stackableColumnsHasPolyfill = new StackableColumnsHasPolyfill()
domReady( window.stackableColumnsHasPolyfill.init )
