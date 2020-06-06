/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.blog-posts.design.no-text-attributes', 'stackable/blog-posts', attributes => {
	return omit( attributes, [
		'text',
	] )
} )
