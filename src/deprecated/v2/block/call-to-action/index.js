/**
 * BLOCK: CTA Block.
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
/**
 * External dependencies
 */
import { CTAIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const name = 'ugb/cta'

export const settings = {
	title: __( 'Call to Action', i18n ),
	description: __( 'A small section you can use to call the attention of your visitors. Great for calling attention to your products or deals.', i18n ),
	icon: CTAIcon,
	category: 'layout',
	keywords: [
		__( 'Call to Action', i18n ),
		__( 'Stackable', i18n ),
		__( 'CTA', i18n ),
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
		'advanced-column-spacing': {
			columnGap: false,
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
		'block-separators': true,
		// 'block-title': true,
		'container-link': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.cta.custom-css.default', '' ),
		},
	},
}
