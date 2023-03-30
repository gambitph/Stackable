/**
 * BLOCK: Tabs Block
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import './with-active-tab'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	 ...metadata,
	 attributes: schema,
	 supports: {
		 anchor: true,
	 },
	 edit,
	 save,
}

