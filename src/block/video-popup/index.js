/**
 * BLOCK: Video Popup Block.
 */
/**
 * External dependencies
 */
import { VideoPopupIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import example from './example'
import schema from './schema'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'

export const name = 'ugb/video-popup'

export const settings = {
	title: __( 'Video Popup', i18n ),
	description: __( 'Display a large thumbnail that your users can click to play a video full-screen. Great for introductory or tutorial videos.', i18n ),
	icon: VideoPopupIcon,
	category: 'common',
	keywords: [
		__( 'Video Popup', i18n ),
		__( 'Stackable', i18n ),
		__( 'YouTube Vimeo mp4', i18n ),
	],
	attributes: schema,
	example,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
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
		'block-title': {
			marginBottomImportant: true,
		},
		// 'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.video-popup.custom-css.default', '' ),
		},
	},
}
