/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.header.design.apply-block-attributes', 'stackable/header', attributes => {
	return omit( attributes, [
		'title',
		'subtitle',
		'buttonText',
		'buttonUrl',
		'buttonNewTab',
		'buttonNoFollow',
		'button2Text',
		'button2Url',
		'button2NewTab',
		'button2NoFollow',
	] )
} )

addFilter( 'stackable.header.edit.designs', 'stackable/header', designs => {
	return {
		...designs,
		// TODO: sample, remove this

		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-header-design-corporate-light-01.jpg"
			attributes: 
{
    "design": "plain",
    "shadow": 0,
    "columnBackgroundColorOpacity": 0,
    "columnBackgroundTintStrength": 1,
    "titleColor": "#fefffc",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "subtitleFontFamily": "Serif",
    "subtitleColor": "#ffffff",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonFontSize": 18,
    "buttonSize": "small",
    "buttonTextColor": "#ff550a",
    "buttonBackgroundColor": "#ffffff",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "showButton2": true,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2FontSize": 18,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2BackgroundColor": "#ffffff",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button2HoverGhostToNormal": false,
    "subtitleBottomMargin": 55,
    "paddingRight": 28,
    "blockWidth": 650,
    "blockHorizontalAlign": "flex-start",
    "columnPaddingRight": 28,
    "columnPaddingUnit": "em",
    "columnHeight": 650,
    "columnContentVerticalAlign": "center",
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#ff550a",
    "blockBackgroundBackgroundColor2": "#ffb20b",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-header-corporate-light-01-01.jpg",
    "blockBackgroundBackgroundTintStrength": 8,
    "blockBackgroundBackgroundGradientDirection": 40,
    "contentAlign": "left"
},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-header-design-corporate-light-02.jpg"
			attributes: 
{
    "design": "plain",
    "shadow": 0,
    "columnBackgroundColorOpacity": 0,
    "columnBackgroundTintStrength": 1,
    "titleColor": "#fefffc",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "subtitleFontFamily": "Serif",
    "subtitleColor": "#ffffff",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonFontSize": 18,
    "buttonSize": "small",
    "buttonTextColor": "#1e55d3",
    "buttonBackgroundColor": "#ffffff",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "showButton2": true,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2FontSize": 18,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2BackgroundColor": "#ffffff",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button2HoverGhostToNormal": false,
    "subtitleBottomMargin": 55,
    "paddingRight": 28,
    "blockWidth": 650,
    "blockHorizontalAlign": "flex-start",
    "columnPaddingRight": 28,
    "columnPaddingUnit": "em",
    "columnHeight": 650,
    "columnContentVerticalAlign": "center",
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColor": "#1e55d3",
    "blockBackgroundBackgroundColor2": "#ffb20b",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-header-corporate-light-02-01.jpg",
    "blockBackgroundBackgroundTintStrength": 5,
    "blockBackgroundBackgroundGradientDirection": 40,
    "contentAlign": "left"
},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-header-design-corporate-dark-01.jpg"
			attributes: 
{
    "design": "plain",
    "shadow": 0,
    "columnBackgroundColorOpacity": 0,
    "columnBackgroundTintStrength": 1,
    "titleColor": "#eeffb5",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "subtitleFontFamily": "Serif",
    "subtitleColor": "#ffffff",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonFontSize": 18,
    "buttonSize": "small",
    "buttonTextColor": "#3f4174",
    "buttonBackgroundColor": "#c4e558",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "showButton2": true,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2FontSize": 18,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2BackgroundColor": "#c4e558",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button2HoverGhostToNormal": false,
    "subtitleBottomMargin": 55,
    "paddingRight": 28,
    "blockWidth": 650,
    "blockHorizontalAlign": "flex-start",
    "columnPaddingRight": 28,
    "columnPaddingUnit": "em",
    "columnHeight": 650,
    "columnContentVerticalAlign": "center",
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-header-corporate-dark-01-01.jpg",
    "contentAlign": "left"
},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-header-design-corporate-dark-02.jpg"
			attributes: 
{
    "design": "plain",
    "shadow": 0,
    "columnBackgroundColorOpacity": 0,
    "columnBackgroundTintStrength": 1,
    "titleColor": "#06c19d",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "subtitleFontFamily": "Serif",
    "subtitleColor": "#ffffff",
    "buttonFontFamily": "Roboto Condensed",
    "buttonFontWeight": "400",
    "buttonLetterSpacing": 0.5,
    "buttonFontSize": 18,
    "buttonSize": "small",
    "buttonTextColor": "#ffffff",
    "buttonBackgroundColor": "#06c19d",
    "buttonHoverEffect": "lift",
    "buttonBorderRadius": 100,
    "showButton2": true,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2FontSize": 18,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2BackgroundColor": "#06c19d",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button2HoverGhostToNormal": false,
    "subtitleBottomMargin": 55,
    "paddingRight": 28,
    "blockWidth": 650,
    "blockHorizontalAlign": "flex-start",
    "columnPaddingRight": 28,
    "columnPaddingUnit": "em",
    "columnHeight": 650,
    "columnContentVerticalAlign": "center",
    "showBlockBackground": true,
    "blockInnerWidth": "full",
    "align": "full",
    "blockBackgroundBackgroundColor": "#000000",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-header-corporate-dark-02-01-1.jpg",
    "blockBackgroundBackgroundTintStrength": 7,
    "contentAlign": "left"
},
		},
	}
} )
