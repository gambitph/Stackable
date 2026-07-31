/**
 * External dependencies
 */
import { settings } from 'stackable'

/**
 * Internal dependencies
 */
import { DEFAULT_SVG } from './util'

// Keep the admin default scoped to direct inserter creation. Parsed blocks and
// blocks created by the Design Library do not apply inserter variations.
export const getIconListVariations = ( editorSettings = {} ) => {
	return [
		{
			name: 'default',
			isDefault: true,
			scope: [ 'inserter' ],
			attributes: {
				icon: editorSettings.stackable_icon_list_block_default_icon || DEFAULT_SVG,
			},
		},
	]
}

export default getIconListVariations( settings )
