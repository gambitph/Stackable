/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

/**
 * Permanently hide the dismissible notification if clicked.
 */

domReady( () => {
	const elems = document.querySelectorAll( '.ugb-expand' )
	elems.forEach( el => {
		const btn = el.querySelector( '.ugb-expand__toggle' )
		const clickHandler = e => {
			el.classList.toggle( 'ugb-expand--more' )
			const isExpanded = el.classList.contains( 'ugb-expand--more' )
			btn.setAttribute( 'aria-expanded', isExpanded ? 'true' : 'false' )
			e.preventDefault()
		}
		if ( btn ) {
			btn.addEventListener( 'click', clickHandler )
			btn.addEventListener( 'tapEnd', clickHandler )
		}
	} )
} )

/**
 * Deprecated < version 1.11
 */
domReady( () => {
	const elems = document.querySelectorAll( '.ugb-expand' )
	elems.forEach( el => {
		const btn = el.querySelector( '.ugb-expand-button' )
		const clickHandler = e => {
			el.classList.toggle( 'ugb-more' )
			e.preventDefault()
		}
		if ( btn ) {
			btn.addEventListener( 'click', clickHandler )
			btn.addEventListener( 'tapEnd', clickHandler )
		}
	} )
} )
