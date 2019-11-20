/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.blockquote.design.apply-block-attributes', 'stackable/blockquote', attributes => {
	return omit( attributes, [
		'text',
	] )
} )

addFilter( 'stackable.blockquote.edit.designs', 'stackable/blockquote', designs => {
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
