/**
 * BLOCK: Separator Block.
 */

/**
 * Internal dependencies
 */
import { default as deprecated } from './deprecated'
import { default as edit } from './edit'
import { default as save } from './save'
import schema from './schema'
import example from './example'

/**
 * External dependencies
 */
import { SeparatorIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { applyFilters } from '@wordpress/hooks'

export const name = 'ugb/separator'

export const settings = {
	title: __( 'Separator', i18n ),
	description: __( 'A fancy separator to be placed between containers and content.', i18n ),
	icon: SeparatorIcon,
	category: 'layout',
	keywords: [
		__( 'Separator', i18n ),
		__( 'SVG Divider', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	example,
	supports: {
		align: [ 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		'advanced-block-spacing': {
			enableMarginRight: false,
			enableMarginLeft: false,
			enablePaddingRight: false,
			enablePaddingLeft: false,
			height: false,
			width: false,
			horizontalContentAlign: false,
			verticalContentAlign: false,
			modifyStyles: false,
			paddingUnits: [ 'px', 'em' ],
		},
		'custom-css': {
			default: applyFilters( 'stackable.separator.custom-css.default', '' ),
		},
	},
}
