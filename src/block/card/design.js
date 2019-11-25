/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.card.design.apply-block-attributes', 'stackable/card', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
		'image1Id',
		...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
		'image2Id',
		...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
		'image3Id',
		'title1',
		'title2',
		'title3',
		'subtitle1',
		'subtitle2',
		'subtitle3',
		'description1',
		'description2',
		'description3',
		'button1Text',
		'button1Url',
		'button1NewTab',
		'button1NoFollow',
		'button2Text',
		'button2Url',
		'button2NewTab',
		'button2NoFollow',
		'button3Text',
		'button3Url',
		'button3NewTab',
		'button3NoFollow',
	] )
} )

addFilter( 'stackable.card.edit.designs', 'stackable/card', designs => {
	return {
		...designs,
		// TODO: sample, remove this

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-card-design-corporate-light-01.jpg"
			attributes: 
{
    "columns": 1,
    "borderRadius": 0,
    "image1Url": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-card-corporate-light-01-01-1024x683.jpg",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ff550a",
    "subtitleFontFamily": "Roboto",
    "subtitleColor": "#acacac",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#707070",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonDesign": "basic",
    "buttonSize": "small",
    "buttonTextColor": "#ffffff",
    "buttonBackgroundColor": "#ff550a",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "descriptionBottomMargin": 55,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffd781",
    "blockBackgroundFixedBackground": true,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ff550a",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#707070"
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-card-design-corporate-light-02.jpg"
			attributes: 
{
    "columns": 1,
    "borderRadius": 0,
    "image1Url": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-card-corporate-light-02-01-1024x683.jpg",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#1e55d3",
    "subtitleFontFamily": "Roboto",
    "subtitleColor": "#acacac",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#707070",
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
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#4571d5",
    "blockBackgroundBackgroundColor2": "#86abff",
    "blockBackgroundBackgroundGradientDirection": 180,
    "blockBackgroundFixedBackground": true,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#c49732",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-card-design-corporate-dark-01.jpg"
			attributes: 
{
    "columns": 1,
    "borderRadius": 0,
    "image1Url": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-card-corporate-dark-01-01-1024x683.jpg",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#1785cb",
    "subtitleFontFamily": "Roboto",
    "subtitleColor": "#acacac",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#707070",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonDesign": "ghost",
    "buttonSize": "small",
    "buttonBackgroundColor": "#c4e558",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "descriptionBottomMargin": 55,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-feature-corporate-dark-01-01.jpg",
    "blockBackgroundFixedBackground": true,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#c5dfb4",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-card-design-corporate-dark-02.jpg"
			attributes: 
{
    "columns": 1,
    "borderRadius": 0,
    "image1Url": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-card-corporate-dark-02-01-1024x684.jpg",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#06c19d",
    "subtitleFontFamily": "Roboto",
    "subtitleColor": "#acacac",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#707070",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonDesign": "ghost",
    "buttonSize": "small",
    "buttonBackgroundColor": "#06c19d",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "descriptionBottomMargin": 55,
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#717171",
    "blockBackgroundBackgroundColor2": "#393939",
    "blockBackgroundFixedBackground": true,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#06c19d",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
	}
} )
