/**
 * BLOCK: Video Popup Block.
 */
/**
 * External dependencies
 */
import { VideoPopupIcon } from '~stackable/icons'
import { createBackgroundAttributes, createResponsiveAttributes } from '~stackable/util'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'

export const schema = {
	videoLink: {
		type: 'string',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: '[data-video]',
		attribute: 'data-video',
	},

	...createResponsiveAttributes( '%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeight', {
		type: 'number',
		default: '',
	} ),
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	playButtonColor: {
		type: 'string',
	},
	playButtonSize: {
		type: 'number',
		default: '',
	},
	playButtonOpacity: {
		type: 'number',
		default: '',
	},

	...createBackgroundAttributes( 'preview%s' ),
	previewBackgroundColor: {
		type: 'string',
		default: '#000000',
	},

	hoverEffect: {
		type: 'string',
		default: '',
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

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		// 'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.video-popup.custom-css.default', '' ),
		},
	},
}
