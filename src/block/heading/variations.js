/**
 * External dependencies
 */
import { settings } from 'stackable'

/**
 * Internal dependencies
 */
import { getHeadingDefaultAttributes } from './util'

// Scope this variation to direct inserter creation.
export const getHeadingVariations = ( editorSettings = {} ) => [
	{
		name: 'default',
		isDefault: true,
		scope: [ 'inserter' ],
		attributes: getHeadingDefaultAttributes( editorSettings ),
	},
]

export default getHeadingVariations( settings )
