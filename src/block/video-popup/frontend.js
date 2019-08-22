/**
 * External dependencies
 */
import BigPicture from 'bigpicture'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

domReady( () => {
	const elems = document.querySelectorAll( '.ugb-video-popup[data-video], .ugb-video-popup [data-video]' )
	const openVideo = el => {
		if ( BigPicture ) {
			const videoID = el.getAttribute( 'data-video' )
			const args = {
				el,
				noLoader: true,
			}
			if ( videoID.match( /^\d+$/g ) ) {
				args.vimeoSrc = videoID
			} else if ( videoID.match( /^https?:\/\//g ) ) {
				args.vidSrc = videoID
			} else {
				args.ytSrc = videoID
			}
			BigPicture( args )
		}
	}
	elems.forEach( el => {
		const a = el.querySelector( 'a' )
		a.addEventListener( 'click', ev => {
			ev.preventDefault()
			openVideo( el )
		} )
		a.addEventListener( 'touchend', ev => {
			ev.preventDefault()
			openVideo( el )
		} )
	} )
} )
