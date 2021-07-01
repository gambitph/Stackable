/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.heading.design.no-text-attributes', 'stackable/heading', attributes => {
	return omit( attributes, [
		'title',
		'subtitle',
	] )
} )
