/**
 * External dependencies
 */
import BigPicture from 'bigpicture'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const getVideoProviderFromURL = url => {
	let id = ''

	// Check for YouTube.
	id = ( url.match( /youtube\.com\/watch\?v=([^\&\?\/]+)/i ) || [] )[ 1 ]

	if ( ! id ) {
		id = ( url.match( /youtube\.com\/embed\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtube\.com\/v\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtu\.be\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}

	if ( id ) {
		return {
			type: 'youtube',
			id,
		}
	}

	// Check for Vimeo.
	id = ( url.match( /vimeo\.com\/(\w*\/)*(\d+)/i ) || [] )[ 2 ]
	if ( ! id ) {
		id = ( url.match( /^\d+$/i ) || [] )[ 0 ]
	}

	if ( id ) {
		return {
			type: 'vimeo',
			id,
		}
	}

	return {
		type: '',
		id: url,
	}
}

class StackableVideoPopup {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-video-popup' )

		const openVideo = el => {
			if ( BigPicture ) {
				const args = {
					el,
					noLoader: true,
				}

				const videoID = el.getAttribute( 'data-video' )
				if ( videoID.match( /^https?:/ ) ) {
					const { type, id } = getVideoProviderFromURL( videoID )
					if ( type === 'youtube' ) {
						args.ytSrc = id
					} else if ( type === 'vimeo' ) {
						args.vimeoSrc = id
					} else {
						args.vidSrc = id
					}
				}

				BigPicture( args )
			}
		}
		els.forEach( el => {
			el.querySelector( 'button' ).addEventListener( 'click', ev => {
				ev.preventDefault()
				openVideo( el )
			} )
		} )
	}
}

window.stackableVideoPopup = new StackableVideoPopup()
domReady( window.stackableVideoPopup.init )
