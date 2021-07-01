/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.icon-list.design.no-text-attributes', 'stackable/icon-list', attributes => {
	return omit( attributes, [
		'text',
	] )
} )
