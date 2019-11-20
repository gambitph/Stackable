/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.number-box.design.apply-block-attributes', 'stackable/number-box', attributes => {
	return omit( attributes, [
		'num1',
		'num2',
		'num3',
		'title1',
		'title2',
		'title3',
		'description1',
		'description2',
		'description3',
	] )
} )

addFilter( 'stackable.number-box.edit.designs', 'stackable/number-box', designs => {
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
