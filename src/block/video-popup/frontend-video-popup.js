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
	if ( ! id ) {
		id = ( url.match( /youtube\.com\/shorts\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}

	if ( id ) {
		return {
			type: 'youtube',
			id,
		}
	}

	// Check for Vimeo.
	const _id = ( url.match( /vimeo\.com\/(\d+)\/(\w+)/i ) || [] ) // https://vimeo.com/VIDEO_ID/PRIVACY_HASH
	id = _id[ 1 ]
	if ( _id[ 1 ] && _id[ 2 ] ) {
		return {
			type: 'vimeo-unlisted',
			id: { video: _id[ 1 ], hash: _id[ 2 ] },
		}
	}

	if ( ! id ) {
		id = ( url.match( /vimeo\.com\/(\w*\/)*(\d+)/i ) || [] )[ 2 ] // https://vimeo.com/CATEGORY/IDENTIFIER/VIDEO_ID
	}
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
						args.ytNoCookie = true // Use youtube-nocookie.
					} else if ( type === 'vimeo' ) {
						args.vimeoSrc = id
					} else if ( type === 'vimeo-unlisted' ) {
						// Create custom iframe src for unlisted vimeo videos.
						// https://developer.vimeo.com/api/oembed/videos#table-2
						args.iframeSrc = `https://player.vimeo.com/video/${ id.video }?h=${ id.hash }&autoplay=1`
					} else {
						args.vidSrc = id
						args.animationStart = () => {
							const nodownload = el.getAttribute( 'data-nodownload' ) === '' ? 'nodownload' : null
							const nofullscreen = el.getAttribute( 'data-nofullscreen' ) === '' ? 'nofullscreen' : null
							const loop = el.getAttribute( 'data-loop' ) === '' ? true : false
							const controls = [ nodownload, nofullscreen ].filter( attr => attr !== null ).join( ' ' )
							const vid = document.getElementById( 'bp_vid' )
							vid.setAttribute( 'controlslist', controls )
							if ( ! loop ) {
								vid.removeAttribute( 'loop' )
							}
						  }
					}
				}

				BigPicture( args )
			}
		}
		els.forEach( el => {
			// We're now using divs, but keep the `button` selector for backward compatibility.
			el.querySelector( 'div[role="button"], button' ).addEventListener( 'click', ev => {
				ev.preventDefault()
				openVideo( el )
			} )
		} )
	}
}

window.stackableVideoPopup = new StackableVideoPopup()
domReady( window.stackableVideoPopup.init )
