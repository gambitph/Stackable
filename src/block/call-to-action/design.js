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

// Remove text from block designs being applied.
addFilter( 'stackable.cta.design.no-text-attributes', 'stackable/cta', attributes => {
	return omit( attributes, [
		'title',
		'description',
		'buttonText',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.cta.design.filtered-block-attributes', 'stackable/cta', attributes => {
	return omit( attributes, [
		'buttonUrl',
		'buttonNewTab',
		'buttonNoFollow',
	] )
} )

addFilter( 'stackable.cta.edit.designs', 'stackable/cta', designs => {
	return {
		...designs,
		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-cta-design-corporate-light-01.jpg',
			attributes: {
				design: 'plain',
				titleFontFamily: 'Roboto Condensed',
				titleFontWeight: '100',
				titleLetterSpacing: 0.5,
				titleColor: '#ffffff',
				descriptionFontFamily: 'Serif',
				descriptionColor: '#ffffff',
				buttonFontFamily: 'Roboto Condensed',
				buttonFontWeight: '400',
				buttonLetterSpacing: 0.5,
				buttonSize: 'small',
				buttonTextColor: '#ff550a',
				buttonBackgroundColor: '#ffffff',
				buttonHoverEffect: 'lift',
				buttonBorderRadius: 100,
				columnFixedBackground: true,
				descriptionBottomMargin: 45,
				columnPaddingTop: 130,
				columnPaddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'full',
				align: 'full',
				blockBackgroundBackgroundColorType: 'gradient',
				blockBackgroundBackgroundColor: '#ff550a',
				blockBackgroundBackgroundColor2: '#ffb20b',
				blockBackgroundBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-cta-corporate-light-01-01.jpg',
				blockBackgroundBackgroundTintStrength: 8,
				blockBackgroundBackgroundGradientDirection: 40,
				blockBackgroundFixedBackground: true,
				showTopSeparator: false,
			},
		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-cta-design-corporate-light-02.jpg',
			attributes: {
				design: 'plain',
				titleFontFamily: 'Roboto Condensed',
				titleFontWeight: '100',
				titleLetterSpacing: 0.5,
				titleColor: '#ffffff',
				descriptionFontFamily: 'Serif',
				descriptionColor: '#ffffff',
				buttonFontFamily: 'Roboto Condensed',
				buttonFontWeight: '400',
				buttonLetterSpacing: 0.5,
				buttonSize: 'small',
				buttonTextColor: '#ffffff',
				buttonBackgroundColor: '#c49732',
				buttonHoverEffect: 'lift',
				buttonBorderRadius: 100,
				columnFixedBackground: true,
				descriptionBottomMargin: 45,
				columnPaddingTop: 130,
				columnPaddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'full',
				align: 'full',
				blockBackgroundBackgroundColorType: 'gradient',
				blockBackgroundBackgroundColor: '#4571d5',
				blockBackgroundBackgroundColor2: '#86abff',
				blockBackgroundBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-cta-corporate-light-02-01.jpg',
				blockBackgroundBackgroundTintStrength: 6,
				blockBackgroundBackgroundGradientDirection: 40,
				blockBackgroundFixedBackground: true,
				showTopSeparator: false,
			},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-cta-design-corporate-dark-01.jpg',
			attributes: {
				design: 'plain',
				titleFontFamily: 'Roboto Condensed',
				titleFontWeight: '100',
				titleLetterSpacing: 0.5,
				titleColor: '#c5dfb4',
				descriptionFontFamily: 'Serif',
				descriptionColor: '#ffffff',
				buttonFontFamily: 'Roboto Condensed',
				buttonFontWeight: '400',
				buttonLetterSpacing: 0.5,
				buttonSize: 'small',
				buttonTextColor: '#3f4174',
				buttonBackgroundColor: '#c4e558',
				buttonHoverEffect: 'lift',
				buttonBorderRadius: 100,
				columnFixedBackground: true,
				descriptionBottomMargin: 45,
				columnPaddingTop: 130,
				columnPaddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'full',
				align: 'full',
				blockBackgroundBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-cta-corporate-dark-01-01.jpg',
				blockBackgroundFixedBackground: true,
				showTopSeparator: false,
			},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-cta-design-corporate-dark-02.jpg',
			attributes: {
				design: 'plain',
				titleFontFamily: 'Roboto Condensed',
				titleFontWeight: '100',
				titleLetterSpacing: 0.5,
				titleColor: '#06c19d',
				descriptionFontFamily: 'Serif',
				descriptionColor: '#ffffff',
				buttonFontFamily: 'Roboto Condensed',
				buttonFontWeight: '400',
				buttonLetterSpacing: 0.5,
				buttonDesign: 'ghost',
				buttonSize: 'small',
				buttonTextColor: '#ffffff',
				buttonBackgroundColor: '#06c19d',
				buttonHoverEffect: 'lift',
				buttonBorderRadius: 100,
				columnFixedBackground: true,
				descriptionBottomMargin: 45,
				columnPaddingTop: 130,
				columnPaddingBottom: 130,
				showBlockBackground: true,
				blockInnerWidth: 'full',
				align: 'full',
				blockBackgroundBackgroundColor: '#000000',
				blockBackgroundBackgroundColor2: '#86abff',
				blockBackgroundBackgroundMediaUrl: 'https://gambitph.github.io/Stackable/assets/block-design-assets/stack-cta-corporate-dark-02-01.jpg',
				blockBackgroundBackgroundTintStrength: 7,
				blockBackgroundBackgroundGradientDirection: 40,
				blockBackgroundFixedBackground: true,
				showTopSeparator: false,
			},
		},
	}
} )
