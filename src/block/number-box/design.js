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

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-number-box-design-corporate-light-01.jpg"
			attributes: 
{
    "numberColor": "#ffffff",
    "numberBGColor": "#ffb20b",
    "titleColor": "#ff550a",
    "descriptionColor": "#707070",
    "borderRadius": 0,
    "numberAlign": "center",
    "columnBackgroundColor": "#ffffff",
    "columnBackgroundColorOpacity": 0.8,
    "numberFontFamily": "Roboto",
    "numberFontWeight": "bold",
    "numberPadding": 2.2,
    "numberBottomMargin": 40,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "descriptionFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#ff550a",
    "blockBackgroundBackgroundColor2": "#ffb20b",
    "blockBackgroundBackgroundGradientDirection": 20,
    "showBlockTitle": true,
    "blockTitle": "Number Box",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ffffff",
    "showBlockDescription": true,
    "blockDescription": "Present information best relayed using numbers like steps in a process or different packages.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-number-box-design-corporate-light-02.jpg"
			attributes: 
{
    "numberColor": "#ffffff",
    "numberBGColor": "#c49732",
    "titleColor": "#ffffff",
    "descriptionColor": "#ffffff",
    "borderRadius": 0,
    "numberAlign": "center",
    "columnBackgroundColor": "#6a91eb",
    "columnBackgroundColorOpacity": 1,
    "numberFontFamily": "Roboto",
    "numberFontWeight": "bold",
    "numberPadding": 2.2,
    "numberBottomMargin": 40,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "descriptionFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffffff",
    "showBlockTitle": true,
    "blockTitle": "Number Box",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#1e55d3",
    "showBlockDescription": true,
    "blockDescription": "Present information best relayed using numbers like steps in a process or different packages.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#707070"
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-number-box-design-corporate-dark-01.jpg"
			attributes: 
{
    "numberColor": "#3f4174",
    "numberBGColor": "#c4e558",
    "titleColor": "#eeffb5",
    "descriptionColor": "#ffffff",
    "borderRadius": 0,
    "numberAlign": "center",
    "columnBackgroundColor": "#0c4887",
    "columnBackgroundColorOpacity": 0.8,
    "numberFontFamily": "Roboto",
    "numberFontWeight": "bold",
    "numberPadding": 2.2,
    "numberBottomMargin": 40,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "descriptionFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-number-box-corporate-dark-01-01.jpg",
    "showBlockTitle": true,
    "blockTitle": "Number Box",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#eeffb5",
    "showBlockDescription": true,
    "blockDescription": "Present information best relayed using numbers like steps in a process or different packages.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-number-box-design-corporate-dark-02.jpg"
			attributes: 
{
    "numberColor": "#ffffff",
    "numberBGColor": "#2f2f2f",
    "titleColor": "#ffffff",
    "descriptionColor": "#ffffff",
    "borderRadius": 0,
    "numberAlign": "center",
    "columnBackgroundColor": "#06c19d",
    "columnBackgroundColorOpacity": 0.8,
    "numberFontFamily": "Roboto",
    "numberFontWeight": "bold",
    "numberPadding": 2.2,
    "numberBottomMargin": 40,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "descriptionFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#000000",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-header-corporate-dark-02-01-1.jpg",
    "blockBackgroundBackgroundTintStrength": 7,
    "showBlockTitle": true,
    "blockTitle": "Number Box",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#06c19d",
    "showBlockDescription": true,
    "blockDescription": "Present information best relayed using numbers like steps in a process or different packages.",
    "blockDescriptionBottomMargin": 55,
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
	}
} )
