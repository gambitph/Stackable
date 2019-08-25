/**
 * Creates all the attributes needed for the Background Controls component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes } from '~stackable/util'

const createBackgroundAttributes = attrNameTemplate => {
	return {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[
				'BackgroundColorType',
				'BackgroundColor',
				'BackgroundColor2',
				'BackgroundMediaId',
				'BackgroundMediaUrl',
				'TabletBackgroundMediaId',
				'TabletBackgroundMediaUrl',
				'MobileBackgroundMediaId',
				'MobileBackgroundMediaUrl',
				'BackgroundGradientBlendMode',
				'BackgroundPosition',
				'TabletBackgroundPosition',
				'MobileBackgroundPosition',
				'BackgroundRepeat',
				'TabletBackgroundRepeat',
				'MobileBackgroundRepeat',
				'BackgroundSize',
				'TabletBackgroundSize',
				'MobileBackgroundSize',
				'BackgroundImageBlendMode',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'number',
				default: '',
			},
			[
				'BackgroundColorOpacity',
				'BackgroundTintStrength',
				'BackgroundGradientDirection',
				'BackgroundCustomSize',
				'TabletBackgroundCustomSize',
				'MobileBackgroundCustomSize',
				'BackgroundGradientLocation1',
				'BackgroundGradientLocation2',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: '',
			},
			[
				'FixedBackground',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '%',
			},
			[
				'BackgroundCustomSizeUnit',
				'TabletBackgroundCustomSizeUnit',
				'MobileBackgroundCustomSizeUnit',
			]
		),
	}
}

export default createBackgroundAttributes

export const createBackgroundAttributeNames = attrNameTemplate => Object.keys( createBackgroundAttributes( attrNameTemplate ) )
