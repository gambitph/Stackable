/**
 * BLOCK: Video Popup Block.
 */

import { createBackgroundAttributes, createResponsiveAttributes } from '@stackable/util'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import deprecated from './deprecated'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import save from './save'
import { VideoPopupIcon } from '@stackable/icons'

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
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	playButtonColor: {
		type: 'string',
		default: '#ffffff',
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

	hoverEffect: {
		type: 'string',
		default: '',
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

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		// 'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.video-popup.custom-css.default', '' ),
		},
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/video-popup-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}

export const showOptions = blockProps => {
	const {
		showBlockBackground = false,
		blockInnerWidth = '',
		align = '',
	} = blockProps.attributes

	const previewIsFullWidth = ( ! showBlockBackground && align === 'full' ) || ( showBlockBackground && blockInnerWidth === 'full' )

	return applyFilters( 'stackable.video-popup.show', {
		containerWidth: ! previewIsFullWidth,
		borderRadius: ! previewIsFullWidth,
	}, blockProps )
}
