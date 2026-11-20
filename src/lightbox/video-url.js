// Keep video detection broad enough to catch URLs GLightbox may classify as video.
const VIDEO_EXTENSION = /\.(mp4|ogg|webm|mov)(?=$|[^a-z0-9])/i

const parseUrl = value => {
	try {
		return new URL( value, window.location.href )
	} catch ( error ) {
		return null
	}
}

export const detectIfVideo = url => {
	const parsedUrl = parseUrl( url )
	if ( ! parsedUrl ) {
		return false
	}

	const hostname = parsedUrl.hostname.toLowerCase()
	const isVideoProvider = hostname === 'youtu.be' ||
		hostname === 'youtube.com' || hostname.endsWith( '.youtube.com' ) ||
		hostname === 'youtube-nocookie.com' || hostname.endsWith( '.youtube-nocookie.com' ) ||
		hostname === 'vimeo.com' || hostname.endsWith( '.vimeo.com' )

	return isVideoProvider || VIDEO_EXTENSION.test( parsedUrl.pathname )
}

export const isValidVideoUrl = value => {
	const url = parseUrl( value )
	if ( ! url ) {
		return false
	}

	// Keep URL checks permissive so GLightbox-supported video formats keep working.
	// The caller HTML-escapes video URLs before GLightbox inserts them with innerHTML.
	return [ 'http:', 'https:' ].includes( url.protocol ) && ! url.username && ! url.password
}
