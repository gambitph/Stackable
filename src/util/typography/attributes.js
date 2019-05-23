import { createAllCombinationAttributes } from '@stackable/util'

export const createTypographyAttributes = attrNameTemplate => {
	return {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[ 'FontFamily', 'FontWeight', 'TextTransform' ]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'number',
				default: '',
			},
			[
				'LetterSpacing',
				'FontSize',
				'TabletFontSize',
				'MobileFontSize',
				'LineHeight',
				'TabletLineHeight',
				'MobileLineHeight',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: 'px',
			},
			[ 'FontSizeUnit', 'TabletFontSizeUnit', 'MobileFontSizeUnit' ]
		),
		...createAllCombinationAttributes(
			'title%sLineHeightUnit',
			{
				type: 'string',
				default: 'em',
			},
			[ 'LineHeightUnit', 'TabletLineHeightUnit', 'MobileLineHeightUnit' ]
		),
	}
}
