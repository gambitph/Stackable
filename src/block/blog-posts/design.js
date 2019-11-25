/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.blog-posts.design.apply-block-attributes', 'stackable/blog-posts', attributes => {
	return omit( attributes, [
		'text',
	] )
} )

addFilter( 'stackable.blog-posts.edit.designs', 'stackable/blog-posts', designs => {
	return {
		...designs,
		// TODO: sample, remove this
		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-posts-design-corporate-light-01.jpg"
			attributes: 
				{
    "borderRadius": 0,
    "showCategory": false,
    "categoryFontFamily": "Roboto",
    "categoryColor": "#ff550a",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#ffb20b",
    "excerptFontFamily": "Serif",
    "excerptColor": "#707070",
    "showMeta": false,
    "metaFontFamily": "Roboto",
    "metaColor": "#6d6d6d",
    "readmoreFontFamily": "Roboto Condensed",
    "readmoreFontWeight": "100",
    "readmoreLetterSpacing": 0.5,
    "readmoreFontSize": 20,
    "readmoreColor": "#ff550a",
    "excerptBottomMargin": 55,
    "columnGap": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#ffffff",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ffb20b",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#707070",
    "contentAlign": "center"
},
			
			},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-posts-design-corporate-light-02.jpg"
			attributes: 
    {
    "borderRadius": 0,
    "showCategory": false,
    "categoryFontFamily": "Roboto",
    "categoryColor": "#ffffff",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#c49732",
    "excerptFontFamily": "Serif",
    "excerptColor": "#ffffff",
    "showMeta": false,
    "metaFontFamily": "Roboto",
    "metaColor": "#ffffff",
    "readmoreFontFamily": "Roboto Condensed",
    "readmoreFontWeight": "100",
    "readmoreLetterSpacing": 0.5,
    "readmoreFontSize": 20,
    "readmoreColor": "#c49732",
    "excerptBottomMargin": 55,
    "columnGap": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColorType": "gradient",
    "blockBackgroundBackgroundColor": "#4571d5",
    "blockBackgroundBackgroundColor2": "#86abff",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#ffffff",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff",
    "contentAlign": "center"
},
			
			},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-posts-design-corporate-dark-01.jpg"
			attributes: 
    {
    "borderRadius": 0,
    "showCategory": false,
    "categoryFontFamily": "Roboto",
    "categoryColor": "#ffffff",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#c5dfb4",
    "excerptFontFamily": "Serif",
    "excerptColor": "#ffffff",
    "showMeta": false,
    "metaFontFamily": "Roboto",
    "metaColor": "#ffffff",
    "readmoreFontFamily": "Roboto Condensed",
    "readmoreFontWeight": "100",
    "readmoreLetterSpacing": 0.5,
    "readmoreFontSize": 20,
    "readmoreColor": "#c4e558",
    "excerptBottomMargin": 55,
    "columnGap": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundMediaUrl": "https://gambitph.github.io/Stackable/assets/block-design-assets/stack-header-corporate-dark-01-01.jpg",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#c5dfb4",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff",
    "contentAlign": "center"
},
			
			},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: "https://gambitph.github.io/Stackable/assets/block-design-previews/stack-posts-design-corporate-dark-02.jpg"
			attributes: 
    {
    "borderRadius": 0,
    "showCategory": false,
    "categoryFontFamily": "Roboto",
    "categoryColor": "#ffffff",
    "titleFontFamily": "Roboto Condensed",
    "titleFontWeight": "100",
    "titleLetterSpacing": 0.5,
    "titleColor": "#06c19d",
    "excerptFontFamily": "Serif",
    "excerptColor": "#ffffff",
    "showMeta": false,
    "metaFontFamily": "Roboto",
    "metaColor": "#ffffff",
    "readmoreFontFamily": "Roboto Condensed",
    "readmoreFontWeight": "100",
    "readmoreLetterSpacing": 0.5,
    "readmoreFontSize": 20,
    "readmoreColor": "#06c19d",
    "excerptBottomMargin": 55,
    "columnGap": 100,
    "showBlockBackground": true,
    "blockInnerWidth": "wide",
    "align": "full",
    "blockBackgroundBackgroundColor": "#2f2f2f",
    "blockBackgroundFixedBackground": true,
    "showTopSeparator": false,
    "showBottomSeparator": false,
    "blockTitleFontFamily": "Roboto Condensed",
    "blockTitleFontWeight": "100",
    "blockTitleLetterSpacing": 0.5,
    "blockTitleAlign": "center",
    "blockTitleColor": "#06c19d",
    "blockDescriptionAlign": "center",
    "blockDescriptionColor": "#ffffff",
    "contentAlign": "center"
},
		},
	},
	}
} )
