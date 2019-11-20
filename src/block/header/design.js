/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.header.design.apply-block-attributes', 'stackable/header', attributes => {
	return omit( attributes, [
		'title',
		'subtitle',
		'buttonText',
		'buttonUrl',
		'buttonNewTab',
		'buttonNoFollow',
		'button2Text',
		'button2Url',
		'button2NewTab',
		'button2NoFollow',
	] )
} )

addFilter( 'stackable.header.edit.designs', 'stackable/header', designs => {
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
