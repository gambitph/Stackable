/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.cta.design.apply-block-attributes', 'stackable/cta', attributes => {
	return omit( attributes, [
		'title',
		'description',
		'buttonText',
		'buttonUrl',
		'buttonNewTab',
		'buttonNoFollow',
	] )
} )

addFilter( 'stackable.cta.edit.designs', 'stackable/cta', designs => {
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
