/**
 * BLOCK: Team Member Block
 */
/**
 * Internal dependencies
 */
import variations from './variations'
import metadata from './block.json'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import deprecated from './deprecated'
import substitute from './substitute'

/**
 * External dependencies
 */
import { TeamMemberIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: TeamMemberIcon,
	attributes: schema,
	supports: {
		anchor: true,
		html: false,
		align: true,
		stkAlign: true,
		stkDefaultTab: 'layout',
		spacing: true,
	},
	example,

	variations,
	deprecated,
	edit,
	save,
	substitute,
}
