/**
 * Creates all the attributes needed for the Button Controls component
 */
import { createAllCombinationAttributes, createTypographyAttributes } from '@stackable/util'

const createButtonAttributes = attrNameTemplate => {
	return {
		...createTypographyAttributes( attrNameTemplate ),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[
				'Text',
				'Design',
				'Url',
				'Size',
				'Icon',
				'IconPosition',
				'TextColor',
				'BackgroundColorType',
				'BackgroundColor',
				'BackgroundColor2',
				'HoverEffect',
				'HoverTextColor',
				'HoverBackgroundColor',
				'HoverBackgroundColor2',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'number',
				default: '',
			},
			[
				'Opacity',
				'HoverOpacity',
				// 'MarginTop',
				// 'MarginRight',
				// 'MarginBottom',
				// 'MarginLeft',
				'PaddingTop',
				'PaddingRight',
				'PaddingBottom',
				'PaddingLeft',
				'BorderRadius',
				'BorderWidth',
				'Shadow',
				'IconSpacing',
				'BackgroundGradientDirection',
				'HoverBackgroundGradientDirection',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: '',
			},
			[
				'NewWindow',
				'HoverGhostToNormal',
			]
		),
	}
}

export default createButtonAttributes

export const createButtonAttributeNames = attrNameTemplate => Object.keys( createButtonAttributes( attrNameTemplate ) )
