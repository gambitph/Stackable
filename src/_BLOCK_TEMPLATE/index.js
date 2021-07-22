// TODO: Search and replace BLOCKSLUG with slug of block e.g. "heading"
/**
 * BLOCK: New Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { HeadingIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	// TODO: add block attributes.
	alignment: {
		type: 'string',
		default: 'center',
	},
}

export const name = 'ugb/BLOCKSLUG'

export const settings = {
	 // TODO: change block title
	title: __( 'Advanced Heading', i18n ),
	// TODO: change block description
	description: __( 'Introduce new sections of your content in style.', i18n ),
	// TODO: change block icon (add a new block icon in ./src/icons/index.js )
	icon: HeadingIcon,
	// TODO: change block category: common, layout, formatting
	category: 'common',
	// TODO: change keywords.
	keywords: [
		__( 'Heading', i18n ),
		__( 'Title', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	edit,
	save,
	deprecated,

	// Stackable modules.
	modules: {
		// TODO: remove modules which are not used.
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': { columnGap: false },
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			// TODO: change block name "header" to your block
			default: applyFilters( 'stackable.BLOCKSLUG.custom-css.default', '' ),
		},
	},
}
