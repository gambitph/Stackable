/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.testimonial.design.apply-block-attributes', 'stackable/testimonial', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		'testimonial1',
		'testimonial1',
		'testimonial3',
		'image1Id',
		...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
		'image2Id',
		...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
		'image3Id',
		...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
		'image1Alt',
		'image2Alt',
		'image3Alt',
		'name1',
		'name2',
		'name3',
		'position1',
		'position2',
		'position3',
	] )
} )

addFilter( 'stackable.testimonial.edit.designs', 'stackable/testimonial', designs => {
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
