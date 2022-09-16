/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableProgressCircle {
	callback = entries => {
		entries.forEach( entry => {
			if ( entry.isIntersecting ) {
				const el = entry.target
				el.classList.add( 'animate' )
			}
		} )
	}

  init = () => {
  	const els = document.querySelectorAll( '.stk-progress-circle' )
  	if ( ! ( 'IntersectionObserver' in window ) ) {
  		els.forEach( el => {
  			el.classList.add( 'animate' )
  		} )
  	}
  	if ( this.io ) {
  		this.io.disconnect()
  	}
  	this.io = new IntersectionObserver( this.callback, { threshold: 0.25 } ) // eslint-disable-line compat/compat
  	els.forEach( el => {
  		this.io.observe( el )
  	} )
  }
}

window.stackableProgressCircle = new StackableProgressCircle()
domReady( window.stackableProgressCircle.init )
