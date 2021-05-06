/**
 * BLOCK: Image Box Block.
 */

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * External dependencies
 */
import { ImageBoxIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { disabledBlocks, i18n } from 'stackable'

export const name = 'ugb/image-box'

export const settings = {
	title: __( 'Image Box', i18n ),
	description: __( 'Display an image that shows more information when hovered on. Can be used as a fancy link to other pages.', i18n ),
	icon: ImageBoxIcon,
	category: 'layout',
	keywords: [
		__( 'Image Box', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},
	attributes: schema,
	example,

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			paddings: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': {
			marginBottomImportant: true,
		},
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.image-box.custom-css.default', '' ),
		},
	},
}

// The "height" option is really the "columnHeight" option. @see edit.js
// Disable the default column height.
addFilter( 'stackable.image-box.advanced-column-spacing.styles', 'stackable/image-box/column-height', styles => {
	styles.desktopTablet[ '> .ugb-inner-block > .ugb-block-content > *' ] = {
		minHeight: undefined,
	}
	styles.tabletOnly[ '> .ugb-inner-block > .ugb-block-content > *' ] = {
		minHeight: undefined,
	}
	styles.mobile[ '> .ugb-inner-block > .ugb-block-content > *' ] = {
		minHeight: undefined,
	}

	return styles
} )
