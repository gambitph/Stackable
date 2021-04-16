/**
 * BLOCK: Advanced Text Block.
 */
/**
 * External dependencies
 */
import { TextIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const name = 'stackable/advanced-text'

export const settings = {
	title: __( 'Advanced Text', i18n ),
	description: __( 'Start with the building block of all page layouts.', i18n ),
	icon: TextIcon,
	category: 'common',
	keywords: [
		__( 'Text', i18n ),
		__( 'Paragraph', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		anchor: true,
	},
	edit,
	save,
}

