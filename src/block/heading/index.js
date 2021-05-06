/**
 * BLOCK: Advanced Heading Block.
 */
/**
 * External dependencies
 */
import { HeadingIcon } from '~stackable/icons'

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

export const name = 'stackable/advanced-heading'

export const settings = {
	title: __( 'Advanced Heading', i18n ),
	description: __( 'Introduce new sections of your content in style.', i18n ),
	icon: HeadingIcon,
	category: 'common',
	keywords: [
		__( 'Heading', i18n ),
		__( 'Title', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		anchor: true,
	},
	edit,
	save,
}
