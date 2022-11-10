/**
 * External dependencies
 */
import BigPicture from 'bigpicture'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableImagePopup {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-image-popup' )

		const openimage = el => {
			if ( BigPicture ) {
				const args = {
					el,
					noLoader: true,
				}

				const imageID = el.getAttribute( 'data-image' )
				if ( imageID.match( /^https?:/ ) ) {
					args.imgSrc = imageID
				}

				BigPicture( args )
			}
		}
		els.forEach( el => {
			el.querySelector( 'button' ).addEventListener( 'click', ev => {
				ev.preventDefault()
				openimage( el )
			} )
		} )
	}
}

window.stackableImagePopup = new StackableImagePopup()
domReady( window.stackableImagePopup.init )
