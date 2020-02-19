/**
 * External dependencies
 */
import { omit } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.video-popup.design.filtered-block-attributes', 'stackable/video-popup', ( attributes, blockAttributes = null ) => {
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
		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-light-01.jpg',
			attributes: {
				borderRadius: 0,
				playButtonColor: '#ff550a',
				previewBackgroundColor: '#ffffff',
				previewBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-testimonial-corporate-light-01-01.jpg',
				previewBackgroundTintStrength: 6,
				paddingTop: 130,
				paddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'wide',
				align: 'full',
				blockBackgroundBackgroundColorType: 'gradient',
				blockBackgroundBackgroundColor: '#ff550a',
				blockBackgroundBackgroundColor2: '#ffb20b',
				showBlockTitle: true,
				blockTitleFontFamily: 'Roboto Condensed',
				blockTitleFontWeight: '100',
				blockTitleLetterSpacing: 0.5,
				blockTitleAlign: 'center',
				blockTitleColor: '#ffffff',
				showBlockDescription: true,
				blockDescriptionBottomMargin: 55,
				blockDescriptionAlign: 'center',
				blockDescriptionColor: '#ffffff',
			},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-light-02.jpg',
			attributes: {
				borderRadius: 0,
				playButtonColor: '#c49732',
				previewBackgroundColor: '#c49732',
				previewBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-video-popup-corporate-light-02-01.jpg',
				previewBackgroundTintStrength: 3,
				paddingTop: 130,
				paddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'wide',
				align: 'full',
				blockBackgroundBackgroundColorType: 'gradient',
				blockBackgroundBackgroundColor: '#1e55d3',
				blockBackgroundBackgroundColor2: '#6a91eb',
				showBlockTitle: true,
				blockTitleFontFamily: 'Roboto Condensed',
				blockTitleFontWeight: '100',
				blockTitleLetterSpacing: 0.5,
				blockTitleAlign: 'center',
				blockTitleColor: '#ffffff',
				showBlockDescription: true,
				blockDescriptionBottomMargin: 55,
				blockDescriptionAlign: 'center',
				blockDescriptionColor: '#ffffff',
			},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-dark-01.jpg',
			attributes: {
				borderRadius: 0,
				playButtonColor: '#0e2448',
				previewBackgroundColor: '#c5dfb4',
				previewBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-video-popup-corporate-dark-01-01.jpg',
				paddingTop: 130,
				paddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'wide',
				align: 'full',
				blockBackgroundBackgroundColor: '#0e2448',
				blockBackgroundBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-dark-01-01.jpg',
				showBlockTitle: true,
				blockTitleFontFamily: 'Roboto Condensed',
				blockTitleFontWeight: '100',
				blockTitleLetterSpacing: 0.5,
				blockTitleAlign: 'center',
				blockTitleColor: '#c5dfb4',
				showBlockDescription: true,
				blockDescriptionBottomMargin: 55,
				blockDescriptionAlign: 'center',
				blockDescriptionColor: '#ffffff',
			},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-dark-02.jpg',
			attributes: {
				borderRadius: 0,
				playButtonColor: '#ffffff',
				previewBackgroundColor: '#06c19d',
				previewBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-video-popup-corporate-dark-02-01.jpg',
				previewBackgroundTintStrength: 5,
				paddingTop: 130,
				paddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'wide',
				align: 'full',
				blockBackgroundBackgroundColor: '#707070',
				blockBackgroundBackgroundColor2: '#6a91eb',
				showBlockTitle: true,
				blockTitleFontFamily: 'Roboto Condensed',
				blockTitleFontWeight: '100',
				blockTitleLetterSpacing: 0.5,
				blockTitleAlign: 'center',
				blockTitleColor: '#06c19d',
				showBlockDescription: true,
				blockDescriptionBottomMargin: 55,
				blockDescriptionAlign: 'center',
				blockDescriptionColor: '#ffffff',
			},
		},
	}
} )
