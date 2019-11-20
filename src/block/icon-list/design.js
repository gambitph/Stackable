/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.icon-list.design.apply-block-attributes', 'stackable/icon-list', attributes => {
	return omit( attributes, [
		'text',
	] )
} )

addFilter( 'stackable.icon-list.edit.designs', 'stackable/icon-list', designs => {
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
