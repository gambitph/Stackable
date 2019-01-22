import domReady from '@wordpress/dom-ready'

/**
 * Permanently hide the dismissible notification if clicked.
 */
domReady( () => {
	const elems = document.querySelectorAll( '.ugb-notification.ugb-notification--dismissible[data-uid]' )
	elems.forEach( el => {
		// Dismiss handler.
		const uid = el.getAttribute( 'data-uid' )
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
			el.style.display = 'block'
			return
		}

		// Show if not yet dismissed.
		if ( ! localStorage.getItem( `stckbl-notif-${ uid }` ) ) {
			el.style.display = 'block'
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
