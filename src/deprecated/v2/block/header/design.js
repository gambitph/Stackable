/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.header.design.no-text-attributes', 'stackable/header', attributes => {
	return omit( attributes, [
		'title',
		'subtitle',
		'buttonText',
		'button2Text',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.header.design.filtered-block-attributes', 'stackable/header', attributes => {
	return {
		...omit( attributes, [
			'buttonUrl',
			'buttonNewTab',
			'buttonNoFollow',
			'button2Url',
			'button2NewTab',
			'button2NoFollow',
		] ),
	}
} )
