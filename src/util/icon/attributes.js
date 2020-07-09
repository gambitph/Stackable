/**
 * Creates all the attributes needed for the Icon Controls component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes } from '~stackable/util'

/**
 * Internal dependencies
 */
import { omitAttributes, pickAttributes } from '../attributes'

const createIconAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		selector = '.ugb-icon',
		defaultIcon = 'fas-cogs',
		exclude = [],
		include = [],
	} = options

	return pickAttributes( omitAttributes( {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				source: 'html',
				selector: `${ selector }`,
				default: defaultIcon,
			},
			[
				'Icon',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[
				'Design',
				'ColorType',
				'Color',
				'Color2',
				'BackgroundColorType',
				'BackgroundColor',
				'BackgroundColor2',
				'BackgroundShape',
				'BackgroundShapeColor',
				// Multi-color (Color and Color2 are also used here).
				'Color3',
				'Color4',
				'Color5',
				'Color5',
				'Color6',
				'Color7',
				'Color8',
				'Color9',
				'Color10',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'number',
				default: '',
			},
			[
				'ColorGradientDirection',
				'OutlineWidth',
				'BackgroundColorGradientDirection',
				'Size',
				'TabletSize',
				'MobileSize',
				'BorderRadius',
				'Shadow',
				'Opacity',
				'Padding',
				'Rotation',
				'BackgroundShapeOpacity',
				'BackgroundShapeSize',
				'BackgroundShapeOffsetHorizontal',
				'BackgroundShapeOffsetVertical',
				// Multi-opacity.
				'MultiOpacity1',
				'MultiOpacity2',
				'MultiOpacity3',
				'MultiOpacity4',
				'MultiOpacity5',
				'MultiOpacity6',
				'MultiOpacity7',
				'MultiOpacity8',
				'MultiOpacity9',
				'MultiOpacity10',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: '',
			},
			[
				'ShowBackgroundShape',
			]
		),
	}, exclude, attrNameTemplate ), include, attrNameTemplate )
}

export default createIconAttributes

export const createIconAttributeNames = attrNameTemplate => Object.keys( createIconAttributes( attrNameTemplate ) )
