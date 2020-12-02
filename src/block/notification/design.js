/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.notification.design.no-text-attributes', 'stackable/notification', attributes => {
	return omit( attributes, [
		'title',
		'description',
		'buttonText',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.notification.design.filtered-block-attributes', 'stackable/notification', attributes => {
	return {
		...omit( attributes, [
			'buttonUrl',
			'buttonNewTab',
			'buttonNoFollow',
		] ),
		design: attributes.design || 'basic',
	}
} )
