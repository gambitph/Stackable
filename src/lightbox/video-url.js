// Keep video detection broad enough to catch URLs GLightbox may classify as video.
const VIDEO_EXTENSION = /\.(mp4|ogg|webm|mov)$/i
const VIDEO_ID = /^[a-zA-Z0-9_-]+$/
const UNSAFE_URL_CHARACTER = /[<>"'\s\x00-\x1f\x7f]/

export const detectIfVideo = url => {
	return /(youtube(?:-nocookie)?\.com|youtu\.be|vimeo\.com|\.(mp4|ogg|webm|mov))/i.test( url )
}

export const isValidVideoUrl = value => {
	// These characters can break out of GLightbox's HTML-string video builder.
	if ( UNSAFE_URL_CHARACTER.test( value ) ) {
		return false
	}

	let url
	try {
		url = new URL( value, window.location.href )
	} catch ( error ) {
		return false
	}

	if ( ! [ 'http:', 'https:' ].includes( url.protocol ) || url.username || url.password ) {
		return false
	}

	// Validate provider URLs by exact host and expected path/ID shape.
	const hostname = url.hostname.toLowerCase()
	if ( [ 'youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com' ].includes( hostname ) ) {
		if ( url.port ) {
			return false
		}
		if ( url.pathname === '/watch' ) {
			const ids = url.searchParams.getAll( 'v' )
			return ids.length === 1 && VIDEO_ID.test( ids[ 0 ] )
		}
		const embed = url.pathname.match( /^\/embed\/([a-zA-Z0-9_-]+)\/?$/ )
		return Boolean( embed )
	}
	if ( hostname === 'youtu.be' ) {
		return ! url.port && /^\/[a-zA-Z0-9_-]+\/?$/.test( url.pathname )
	}
	if ( hostname === 'vimeo.com' || hostname === 'www.vimeo.com' ) {
		return ! url.port && /^\/[0-9]+\/?$/.test( url.pathname )
	}

	// Other supported video hosts are allowed for direct video files only.
	return VIDEO_EXTENSION.test( url.pathname )
}
