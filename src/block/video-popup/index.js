/**
 * BLOCK: Video Popup Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
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
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	backgroundColor2: {
		type: 'string',
		default: '',
	},
	backgroundColorDirection: {
		type: 'number',
		default: 0,
	},
	backgroundType: {
		type: 'string',
		default: '',
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
	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
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
	title: __( 'Video Popup', i18n ),
	description: __( 'Display a large thumbnail that your users can click to play a video full-screen. Great for introductory or tutorial videos.', i18n ),
	icon: VideoPopupIcon,
	category: 'stackable',
	keywords: [
		__( 'Video Popup', i18n ),
		__( 'Stackable', i18n ),
		__( 'YouTube Vimeo mp4', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/video-popup-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
