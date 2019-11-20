/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.blog-posts.design.apply-block-attributes', 'stackable/blog-posts', attributes => {
	return omit( attributes, [
		'text',
	] )
} )

addFilter( 'stackable.blog-posts.edit.designs', 'stackable/blog-posts', designs => {
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
