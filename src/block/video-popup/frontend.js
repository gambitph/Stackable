import BigPicture from 'bigpicture'
import domReady from '@wordpress/dom-ready'

domReady( () => {
	const elems = document.querySelectorAll( '.ugb-video-popup' )
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
	} )
} )
