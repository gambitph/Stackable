/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

/**
 * External dependencies
 */
import md5 from 'md5'

/**
 * Permanently hide the dismissible notification if clicked.
 */
domReady( () => {
	const elems = document.querySelectorAll( '.ugb-notification.ugb-notification--dismissible' )
	elems.forEach( el => {
		// Dismiss handler.
		const uid = el.getAttribute( 'data-uid' ) ?
		            el.getAttribute( 'data-uid' ) : // Backward compatibility < 1.12.
		            md5( el.outerHTML ).substr( 0, 6 )

		el.querySelector( '.ugb-notification__close-button' ).addEventListener( 'click', ev => {
			ev.preventDefault()
			localStorage.setItem( `stckbl-notif-${ uid }`, 1 )
			el.style.display = ''
		} )
		el.querySelector( '.ugb-notification__close-button' ).addEventListener( 'keypress', ev => {
			ev.preventDefault()
			localStorage.setItem( `stckbl-notif-${ uid }`, 1 )
			el.style.display = ''
		} )

		// Always show notification if in preview.
		if ( window.location.search.match( /preview=\w+/ ) ) {
			el.style.display = 'flex'
			return
		}

		// Show if not yet dismissed.
		if ( ! localStorage.getItem( `stckbl-notif-${ uid }` ) ) {
			el.style.display = 'flex'
		}
	} )
} )

/**
 * Deprecated < version 1.11
 */
domReady( () => {
	const elemsDep = document.querySelectorAll( '.ugb-notification.dismissible-true[data-uid]' )
	elemsDep.forEach( el => {
		// Dismiss handler.
		const uid = el.getAttribute( 'data-uid' )
		el.querySelector( '.close-button' ).addEventListener( 'click', () => {
			localStorage.setItem( `stckbl-notif-${ uid }`, 1 )
			el.style.display = ''
		} )

		// Always show notification if in preview.
		if ( window.location.search.match( /preview=\w+/ ) ) {
			el.style.display = 'block'
			return
		}

		// Show if not yet dismissed.
		if ( ! localStorage.getItem( `stckbl-notif-${ uid }` ) ) {
			el.style.display = 'block'
		}
	} )
} )
