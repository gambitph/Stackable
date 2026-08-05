/**
 * External dependencies
 */
import { settings } from 'stackable'

/**
 * Internal dependencies
 */
import { getIconListDefaultAttributes } from './util'

// Scope this variation to direct inserter creation.
export const getIconListVariations = ( editorSettings = {} ) => [
	{
		name: 'default',
		isDefault: true,
		scope: [ 'inserter' ],
		attributes: getIconListDefaultAttributes( editorSettings ),
	},
]

export default getIconListVariations( settings )
