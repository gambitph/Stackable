/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.text.design.no-text-attributes', 'stackable/text', attributes => {
	return omit( attributes, [
		'title',
		'subtitle',
		'text',
	] )
} )
