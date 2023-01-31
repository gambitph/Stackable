/**
 * Creates all the attributes needed for the Image Controls component
 */
/**
 * Internal dependencies
 */
import { omitAttributes, createAllCombinationAttributes } from '../attributes'

const createImageBackgroundAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		exclude = [],
	} = options

	return omitAttributes( {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[
				'Url',
				'BackgroundPosition',
				'BackgroundRepeat',
				'BackgroundSize',
				'Alt',
				'Title',
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
				'BackgroundCustomSize',
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
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: 'px',
			},
			[
				'BackgroundCustomSizeUnit',
			]
		),
	}, exclude, attrNameTemplate )
}

export default createImageBackgroundAttributes

export const createImageBackgroundAttributeNames = attrNameTemplate => Object.keys( createImageBackgroundAttributes( attrNameTemplate ) )