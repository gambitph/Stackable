/**
 * Internal dependencies
 */
import FullHeight from './videos/full-height.mp4'
import VideoBorderPadding from './videos/button-padding.mp4'
import GeneralBorderRadius from './videos/general-border-radius.mp4'
import GeneralShadows from './videos/general-shadow.mp4'
import AlignmentTitle from './videos/alignment-title.mp4'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const VIDEOS = {
	// Template object.
	// helpId: {
	// 	video: GeneralShadows,
	//	title: __( 'Border Radius', i18n ),
	// 	description: __( 'Full-height ito pampatangkad ng bloke', i18n ),
	// 	learnMore: 'https://wpstackable.com/blog',
	// },

	// General, common across most blocks.
	generalShadows: {
		video: GeneralShadows,
		title: __( 'Shadow / Outline', i18n ),
		description: __( 'Adjusts the intensity of the shadow/outline of the block and the appearance of the block border.', i18n ),
		learnMore: 'https://wpstackable.com/blog',
	},
	generalBorderRadius: {
		video: GeneralBorderRadius,
		title: __( 'Border Radius', i18n ),
		description: __( 'Adjusts the radius of block corners to make them more rounded.', i18n ),
	},
	fullHeight: {
		video: FullHeight,
		title: __( 'Full Height', i18n ),
		description: __( 'Block height takes up the full height of the screen.', i18n ),
	},

	// Buttons.
	buttonPadding: {
		video: VideoBorderPadding,
		title: __( 'Padding', i18n ),
		description: __( 'Adjust the space between the button text and button border.', i18n ),
	},

	// Alignment.
	alignmentTitle: {
		video: AlignmentTitle,
		title: __( 'Alignment', i18n ),
		description: __( 'Adjusts the placement of all content in the block to align left, center or right.', i18n ),
	},
}

export default VIDEOS
