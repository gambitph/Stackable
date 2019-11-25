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

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-light-01.jpg"
			attributes: 
{
    "borderRadius": 0,
    "playButtonColor": "#ff550a",
    "previewBackgroundColor": "#ffffff",
    "previewBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-testimonial-corporate-light-01-01.jpg",
    "previewBackgroundTintStrength": 6,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#ff550a",
    "blockBackgroundBackgroundColor2": "#ffb20b",
    "showBlockTitle": true,
    "blockTitle": "Video Popup",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ffffff",
    "showBlockDescription": true,
    "blockDescription": "Use the Video Popup block to include videos in your website. This is a very handy block.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-light-02.jpg"
			attributes: 
{
    "borderRadius": 0,
    "playButtonColor": "#c49732",
    "previewBackgroundColor": "#c49732",
    "previewBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-video-popup-corporate-light-02-01.jpg",
    "previewBackgroundTintStrength": 3,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#1e55d3",
    "blockBackgroundBackgroundColor2": "#6a91eb",
    "showBlockTitle": true,
    "blockTitle": "Video Popup",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ffffff",
    "showBlockDescription": true,
    "blockDescription": "Use the Video Popup block to include videos in your website. This is a very handy block.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-dark-01.jpg"
			attributes: 
{
    "borderRadius": 0,
    "playButtonColor": "#0e2448",
    "previewBackgroundColor": "#c5dfb4",
    "previewBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-video-popup-corporate-dark-01-01.jpg",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-dark-01-01.jpg",
    "showBlockTitle": true,
    "blockTitle": "Video Popup",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#c5dfb4",
    "showBlockDescription": true,
    "blockDescription": "Use the Video Popup block to include videos in your website. This is a great and handy block.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-video-popup-design-corporate-dark-02.jpg"
			attributes: 
{
    "borderRadius": 0,
    "playButtonColor": "#ffffff",
    "previewBackgroundColor": "#06c19d",
    "previewBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-video-popup-corporate-dark-02-01.jpg",
    "previewBackgroundTintStrength": 5,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#707070",
    "blockBackgroundBackgroundColor2": "#6a91eb",
    "showBlockTitle": true,
    "blockTitle": "Video Popup",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#06c19d",
    "showBlockDescription": true,
    "blockDescription": "Use the Video Popup block to include videos in your website. This is a very handy block.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
	}
} )
