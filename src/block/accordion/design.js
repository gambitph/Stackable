/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.accordion.design.no-text-attributes', 'stackable/accordion', attributes => {
	return omit( attributes, [
		'title',
	] )
} )

addFilter( 'stackable.accordion.edit.designs', 'stackable/accordion', designs => {
	return {
		...designs,
		// TODO: sample, remove this
		// corporate: {
		// 	label: __( 'Corporate', i18n ),
		// 	attributes: {
		// 		borderRadius: 50,
		// 		containerBackgroundColor: '#fcb900',
		// 	},
		// },
	}
} )
