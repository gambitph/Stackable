/**
 * BLOCK: Video Popup Block.
 */

import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
import { VideoPopupIcon } from '@stackable/icons'

export const schema = {
	videoLink: {
		type: 'string',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: 'div',
		attribute: 'data-video',
	},
	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	playButtonColor: {
		type: 'string',
		default: '#ffffff',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	align: {
		type: 'string',
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	overlayColor: {
		type: 'string',
	},
	mediaLink: {
		type: 'string',
	},
	mediaID: {
		type: 'number',
	},
}

export const name = 'ugb/video-popup'

export const settings = {
	title: __( 'Video Popup' ),
	description: __( 'Display a large thumbnail that your users can click to play a video full-screen. Great for introductory or tutorial videos.' ),
	icon: VideoPopupIcon,
	category: 'stackable',
	keywords: [
		__( 'Video Popup' ),
		__( 'Stackable' ),
		__( 'YouTube Vimeo mp4' ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/video-popup-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
