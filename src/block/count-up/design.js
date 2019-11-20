/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.count-up.design.apply-block-attributes', 'stackable/count-up', attributes => {
	return omit( attributes, [
		'title1',
		'title2',
		'title3',
		'title4',
		'countText1',
		'countText2',
		'countText3',
		'countText4',
		'description1',
		'description2',
		'description3',
		'description4',
	] )
} )

addFilter( 'stackable.count-up.edit.designs', 'stackable/count-up', designs => {
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
