/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.icon-list.design.apply-block-attributes', 'stackable/icon-list', attributes => {
	return omit( attributes, [
		'text',
	] )
} )

addFilter( 'stackable.icon-list.edit.designs', 'stackable/icon-list', designs => {
	return {
		...designs,
		// TODO: sample, remove this

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-icon-list-design-corporate-light-01.jpg"
			attributes: 
{
    "iconShape": "circle",
    "iconColor": "#ff550a",
    "iconSize": 25,
    "columns": 3,
    "listTextColor": "#707070",
    "listTextFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffd781",
    "showBlockTitle": true,
    "blockTitle": "This is an Icon List",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ff550a",
    "showBlockDescription": true,
    "blockDescription": "Use this amazing block for items that you want to put in a bullet list layout.",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#707070"
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-icon-list-design-corporate-light-02.jpg"
			attributes: 
{
    "iconShape": "circle",
    "iconColor": "#1e55d3",
    "iconSize": 25,
    "columns": 3,
    "listTextColor": "#707070",
    "listTextFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffffff",
    "showBlockTitle": true,
    "blockTitle": "This is an Icon List",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#c49732",
    "showBlockDescription": true,
    "blockDescription": "Use this amazing block for items that you want to put in a bullet list layout.",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#707070"
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-icon-list-design-corporate-dark-01.jpg"
			attributes: 
{
    "iconShape": "circle",
    "iconColor": "#c4e558",
    "iconSize": 25,
    "columns": 3,
    "listTextColor": "#ffffff",
    "listTextFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#0e2448",
    "showBlockTitle": true,
    "blockTitle": "This is an Icon List",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#c5dfb4",
    "showBlockDescription": true,
    "blockDescription": "Use this amazing block for items that you want to put in a bullet list layout.",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-icon-list-design-corporate-dark-02.jpg"
			attributes: 
{
    "iconShape": "circle",
    "iconColor": "#06c19d",
    "iconSize": 25,
    "columns": 3,
    "listTextColor": "#ffffff",
    "listTextFontFamily": "Serif",
    "paddingTop": 130,
    "paddingBottom": 130,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#707070",
    "showBlockTitle": true,
    "blockTitle": "This is an Icon List",
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ffffff",
    "showBlockDescription": true,
    "blockDescription": "Use this amazing block for items that you want to put in a bullet list layout.",
    "blockDescriptionFontFamily": "Serif",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff"
},
		},
	}
} )
