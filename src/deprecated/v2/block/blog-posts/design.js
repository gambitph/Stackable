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

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.blog-posts.design.filtered-block-attributes', 'stackable/button', attributes => {
	return {
		...omit( attributes, [
			'numberOfItems',
			'order',
			'orderBy',
			'postType',
			'taxonomyType',
			'taxonomy',
			'taxonomyFilterType',
			'postOffset',
			'postExclude',
			'postInclude',
		] ),
	}
} )
