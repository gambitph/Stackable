/**
 * Internal dependencies
 */
import videoTest from './videos/test.mp4' // TODO: This is just a test video, remove this

/**
 * External dependencies
 */
import { srcUrl, cdnUrl } from 'stackable'

// Assign all videos to specific IDs so we can reference the videos by ID.
const VIDEOS = {
	'inner-column-spacing': videoTest, // TODO: This is just a test video, remove this
}

const getVideoUrl = id => {
	const video = VIDEOS[ id ] || ''
	// Provides the URL of the video. If during development, use the local copies; if production, use the CDN.
	return `${ process.env.NODE_ENV === 'development' ? srcUrl : cdnUrl }/${ video }`
}

export default getVideoUrl
