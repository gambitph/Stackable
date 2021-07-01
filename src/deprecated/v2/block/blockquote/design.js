/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.blockquote.design.no-text-attributes', 'stackable/blockquote', attributes => {
	return omit( attributes, [
		'text',
	] )
} )
