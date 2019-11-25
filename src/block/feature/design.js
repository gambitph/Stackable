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

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-feature-design-corporate-light-01.jpg"
			attributes: 
{
    "invert": true,
    "imageUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-light-01-02-1024x893.jpg",
    "imageWidth": 580,
    "imageHeight": 506,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ff550a",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#707070",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonDesign": "basic",
    "buttonSize": "small",
    "buttonTextColor": "#ff550a",
    "buttonBackgroundColor": "#ffffff",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "descriptionBottomMargin": 55,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffd781",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-feature-design-corporate-light-02.jpg"
			attributes: 
{
    "invert": true,
    "imageUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-dark-01-01-1024x893.jpg",
    "imageWidth": 580,
    "imageHeight": 506,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ffffff",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#ffffff",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonDesign": "basic",
    "buttonSize": "small",
    "buttonTextColor": "#ffffff",
    "buttonBackgroundColor": "#c49732",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "descriptionBottomMargin": 55,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#1e55d3",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-feature-design-corporate-dark-01.jpg"
			attributes: 
{
    "invert": true,
    "imageUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-dark-01-03-1024x893.jpg",
    "imageWidth": 580,
    "imageHeight": 506,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#eeffb5",
    "descriptionFontFamily": "Serif",
    "buttonFontFamily": "Roboto Condensed",
    "buttonLetterSpacing": 0.5,
    "buttonSize": "small",
    "buttonBorderRadius": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundMediaUrl": "http://sandbox.gambit.ph/v2-dev43-free-for-template-saving/wp-content/uploads/sites/42/2019/11/stack-cta-corporate-dark-01-01.jpg",
    "blockBackgroundFixedBackground": true,
    "descriptionColor": "#ffffff"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-feature-design-corporate-dark-02.jpg"
			attributes: 
{
    "invert": true,
    "imageUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-dark-02-01-1024x893.jpg",
    "imageWidth": 580,
    "imageHeight": 506,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#06c19d",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#ffffff",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonDesign": "basic",
    "buttonSize": "small",
    "buttonTextColor": "#ffffff",
    "buttonBackgroundColor": "#06c19d",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "descriptionBottomMargin": 55,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#2f2f2f",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false
},
		},
	}
} )
