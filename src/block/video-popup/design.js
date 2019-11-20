/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.video-popup.design.apply-block-attributes', 'stackable/video-popup', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		'videoLink',
		'videoID',
		'video-popup3',
		'previewBackgroundMediaId',
		...( blockAttributes && blockAttributes.previewBackgroundMediaId ? [ 'previewBackgroundMediaUrl' ] : [] ),
	] )
} )

addFilter( 'stackable.video-popup.edit.designs', 'stackable/video-popup', designs => {
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
