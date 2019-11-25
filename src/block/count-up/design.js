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

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-countup-design-corporate-light-01.jpg"
			attributes: 
{
    "columns": 3,
    "iconColor": "#eeffb5",
    "numberFontFamily": "Roboto Condensed",
    "numberFontWeight": "bold",
    "numberFontSize": 58,
    "numberColor": "#ffffff",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ffffff",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#ffffff",
    "paddingTop": 80,
    "paddingBottom": 80,
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#ff550a",
    "blockBackgroundBackgroundColor2": "#ffb20b",
    "blockBackgroundBackgroundGradientDirection": 40,
    "blockTitle": "",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleColor": "#ffffff",
    "blockDescription": "",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-countup-design-corporate-light-02.jpg"
			attributes: 
{
    "columns": 3,
    "iconColor": "#eeffb5",
    "numberFontFamily": "Roboto Condensed",
    "numberFontWeight": "bold",
    "numberFontSize": 58,
    "numberColor": "#1e55d3",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ffffff",
    "descriptionFontFamily": "Serif",
    "descriptionColor": "#ffffff",
    "paddingTop": 80,
    "paddingBottom": 80,
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColor": "#6a91eb",
    "blockTitle": "",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleColor": "#1e55d3",
    "blockDescription": "",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionColor": "#ffffff"
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-countup-design-corporate-dark-01.jpg"
			attributes: 
{
    "columns": 3,
    "iconColor": "#eeffb5",
    "numberFontFamily": "Roboto Condensed",
    "numberFontWeight": "bold",
    "numberFontSize": 58,
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#eeffb5",
    "descriptionFontFamily": "Serif",
    "paddingTop": 80,
    "paddingBottom": 80,
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColor": "#0e2448",
    "blockTitle": "",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleColor": "#eeffb5",
    "blockDescription": "",
    "blockDescriptionFontFamily": "Serif"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-countup-design-corporate-dark-02.jpg"
			attributes: 
{
    "columns": 3,
    "iconColor": "#eeffb5",
    "numberFontFamily": "Roboto Condensed",
    "numberFontWeight": "bold",
    "numberFontSize": 58,
    "numberColor": "#06c19d",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ffffff",
    "descriptionFontFamily": "Serif",
    "paddingTop": 80,
    "paddingBottom": 80,
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColor": "#2f2f2f",
    "blockTitle": "",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleColor": "#06c19d",
    "blockDescription": "",
    "blockDescriptionFontFamily": "Serif"
},
		},
	}
} )
