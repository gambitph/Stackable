/**
 * BLOCK: Design Library Block.
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'

import { addFilter } from '@wordpress/hooks'

export const settings = {
	...metadata,
	icon: StackableIcon,
	attributes: {
		previewMode: {
			type: 'boolean',
			default: false,
		},
	},
	supports: {
		stkSaveBlockStyle: false,
	},
	example: {
		attributes: {
			previewMode: true,
		},
	},
	edit,
	save,
}

// Always hide design library from block inserter
addFilter( `stackable.design-library.settings`, `stackable/design-library/inserter`, settings => {
	return {
		...settings,
		supports: {
			...settings.supports,
			inserter: false,
		},
	}
} )
