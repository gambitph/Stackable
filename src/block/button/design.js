/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.button.design.apply-block-attributes', 'stackable/button', attributes => {
	return omit( attributes, [
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

addFilter( 'stackable.button.edit.designs', 'stackable/button', designs => {
	return {
		...designs,
		// TODO: sample, remove this
	
		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-button-design-corporate-light-01.jpg"
			attributes: 
{
    "showButton2": true,
    "showButton3": true,
    "button1FontFamily": "Roboto Condensed",
    "button1FontWeight": "400",
    "button1LetterSpacing": 0.5,
    "button1Size": "small",
    "button1TextColor": "#ffffff",
    "button1BackgroundColor": "#ffb20b",
    "button1HoverEffect": "lift",
    "button1BorderRadius": 100,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2TextColor": "#3f4174",
    "button2BackgroundColor": "#ff550a",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button3FontFamily": "Roboto Condensed",
    "button3FontWeight": "400",
    "button3LetterSpacing": 0.5,
    "button3Design": "plain",
    "button3Size": "small",
    "button3TextColor": "#3f4174",
    "button3BackgroundColor": "#ff550a",
    "button3HoverEffect": "lift",
    "button3BorderRadius": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffd781"


			},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-button-design-corporate-light-02.jpg"
			attributes: 
{
    "showButton2": true,
    "showButton3": true,
    "button1FontFamily": "Roboto Condensed",
    "button1FontWeight": "400",
    "button1LetterSpacing": 0.5,
    "button1Size": "small",
    "button1TextColor": "#ffffff",
    "button1BackgroundColor": "#c49732",
    "button1HoverEffect": "lift",
    "button1BorderRadius": 100,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2TextColor": "#3f4174",
    "button2BackgroundColor": "#ffffff",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button3FontFamily": "Roboto Condensed",
    "button3FontWeight": "400",
    "button3LetterSpacing": 0.5,
    "button3Design": "plain",
    "button3Size": "small",
    "button3TextColor": "#3f4174",
    "button3BackgroundColor": "#c49732",
    "button3HoverEffect": "lift",
    "button3BorderRadius": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColor": "#1e55d3"


			},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-button-design-corporate-dark-01.jpg"
			attributes: 
{
    "showButton2": true,
    "showButton3": true,
    "button1FontFamily": "Roboto Condensed",
    "button1FontWeight": "400",
    "button1LetterSpacing": 0.5,
    "button1Size": "small",
    "button1TextColor": "#3f4174",
    "button1BackgroundColor": "#c4e558",
    "button1HoverEffect": "lift",
    "button1BorderRadius": 100,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2TextColor": "#3f4174",
    "button2BackgroundColor": "#c4e558",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button3FontFamily": "Roboto Condensed",
    "button3FontWeight": "400",
    "button3LetterSpacing": 0.5,
    "button3Design": "plain",
    "button3Size": "small",
    "button3TextColor": "#3f4174",
    "button3BackgroundColor": "#c4e558",
    "button3HoverEffect": "lift",
    "button3BorderRadius": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColor": "#062a65"


			},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-button-design-corporate-dark-02.jpg"
			attributes: 
{
    "showButton2": true,
    "showButton3": true,
    "button1FontFamily": "Roboto Condensed",
    "button1FontWeight": "400",
    "button1LetterSpacing": 0.5,
    "button1Size": "small",
    "button1TextColor": "#ffffff",
    "button1BackgroundColor": "#06c19d",
    "button1HoverEffect": "lift",
    "button1BorderRadius": 100,
    "button2FontFamily": "Roboto Condensed",
    "button2FontWeight": "400",
    "button2LetterSpacing": 0.5,
    "button2Design": "ghost",
    "button2Size": "small",
    "button2TextColor": "#3f4174",
    "button2BackgroundColor": "#06c19d",
    "button2HoverEffect": "lift",
    "button2BorderRadius": 100,
    "button3FontFamily": "Roboto Condensed",
    "button3FontWeight": "400",
    "button3LetterSpacing": 0.5,
    "button3Design": "plain",
    "button3Size": "small",
    "button3TextColor": "#3f4174",
    "button3BackgroundColor": "#ffffff",
    "button3HoverEffect": "lift",
    "button3BorderRadius": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "center",
    "align": "full",
    "blockBackgroundBackgroundColor": "#707070"


			},
		},
	}
} )
