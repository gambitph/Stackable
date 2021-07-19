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
import _metadata from './block.json'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { disabledBlocks } from 'stackable'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	icon: VideoPopupIcon,
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
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
		'block-separators': true,
		'block-title': {
			blockTitleMarginBottomImportant: true,
			blockDescriptionMarginBottomImportant: true,
		},
		// 'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.video-popup.custom-css.default', '' ),
		},
	},
}
