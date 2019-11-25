/**
 * Creates all the attributes needed for the Typography Control component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes } from '~stackable/util'

const createTypographyAttributes = attrNameTemplate => {
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
			attrNameTemplate,
			{
				type: 'string',
				default: 'em',
			},
			[ 'LineHeightUnit', 'TabletLineHeightUnit', 'MobileLineHeightUnit' ]
		),
	}
}

export default createTypographyAttributes

export const createTypographyAttributeNames = attrNameTemplate => Object.keys( createTypographyAttributes( attrNameTemplate ) )
