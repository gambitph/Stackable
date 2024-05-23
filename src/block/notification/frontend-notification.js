/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableNotification {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-notification.stk--is-dismissible' )
		els.forEach( el => {
			if ( el._StackableHasInitAccordion ) {
				return
			}
			// Dismiss handler.
			const uid = el.getAttribute( 'data-block-id' )
			const itemName = `stckbl-notif-${ uid }`

			// Show if not yet dismissed.
			if ( localStorage.getItem( itemName ) &&
				! window.location.search.match( /preview=\w+/ ) ) { // Always show notification if in preview.
				el.style.display = 'none'
			}

			el.querySelector( '.stk-block-notification__close-button' ).addEventListener( 'click', () => {
				localStorage.setItem( itemName, 1 )
				el.style.display = 'none'
			} )
			el._StackableHasInitAccordion = true
		} )
	}
}

window.stackableNotification = new StackableNotification()
domReady( window.stackableNotification.init )
