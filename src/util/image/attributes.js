/**
 * Creates all the attributes needed for the Image Controls component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes } from '~stackable/util'

/**
 * Internal dependencies
 */
import { omitAttributes } from '../attributes'

const createImageAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		selector = '.ugb-img',
		exclude = [],
	} = options

	return omitAttributes( {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
				source: 'attribute',
				selector,
				attribute: 'src',
			},
			[
				'Url',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
				source: 'attribute',
				selector,
				attribute: 'alt',
			},
			[
				'Alt',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[
				'Shape',
				'Size',
				'BlendMode',
				'BackgroundPosition',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'number',
				default: '',
			},
			[
				'Id',
				'Width',
				'Height',
				'TabletWidth',
				'MobileWidth',
				'BorderRadius',
				'Shadow',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: '',
			},
			[
				'ShapeStretch',
				'ShapeFlipX',
				'ShapeFlipY',
				'Square',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: 'large',
			},
			[
				'Size',
			]
		),
	}, exclude, attrNameTemplate )
}

export default createImageAttributes

export const createImageAttributeNames = attrNameTemplate => Object.keys( createImageAttributes( attrNameTemplate ) )
