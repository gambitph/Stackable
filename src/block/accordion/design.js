/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.accordion.design.apply-block-attributes', 'stackable/accordion', attributes => {
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
