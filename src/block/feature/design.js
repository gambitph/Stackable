/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.feature.design.apply-block-attributes', 'stackable/feature', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		'imageId',
		...( blockAttributes && blockAttributes.imageId ? [ 'imageUrl' ] : [] ),
		'imageAlt',
		'title',
		'description',
		'buttonText',
		'buttonUrl',
		'buttonNewTab',
		'buttonNoFollow',
	] )
} )

addFilter( 'stackable.feature.edit.designs', 'stackable/feature', designs => {
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
