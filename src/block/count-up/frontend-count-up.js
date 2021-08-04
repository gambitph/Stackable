/**
 * External dependencies
 */
import counterUp from 'counterup2'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const ACTIVE = 'stk--count-up-active'
class StackableCountUp {
	callback = entries => {
		entries.forEach( entry => {
			const el = entry.target
			if ( ! el.classList.contains( ACTIVE ) && entry.isIntersecting ) {
				counterUp( el )
				el.classList.add( ACTIVE )
			}
		} )
	}

	init = () => {
		const els = document.querySelectorAll( '.stk-block-count-up__text' )

		// If IntersectionObserver is not supported, just show the blocks.
		if ( ! ( 'IntersectionObserver' in window ) ) {
			els.forEach( el => {
				el.classList.add( ACTIVE )
			} )
			return
		}

		if ( this.io ) {
			this.io.disconnect()
		}
		this.io = new IntersectionObserver( this.callback, { threshold: 1 } ) // eslint-disable-line compat/compat
		els.forEach( el => {
			this.io.observe( el )
		} )
	}
}

window.stackableCountUp = new StackableCountUp()
domReady( window.stackableCountUp.init )
