/**
 * Creates all the attributes needed for the Border Controls component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes } from '~stackable/util'

/**
 * Internal dependencies
 */
import { omitAttributes, pickAttributes } from '../attributes'

const createBorderAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		exclude = [],
		include = [],
	} = options

	return pickAttributes( omitAttributes( {
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				default: '',
			},
			[
				'BorderType',
				'BorderColor',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'number',
				default: '',
			},
			[
				'BorderWidthTop',
				'BorderWidthRight',
				'BorderWidthBottom',
				'BorderWidthLeft',
				'TabletBorderWidthTop',
				'TabletBorderWidthRight',
				'TabletBorderWidthBottom',
				'TabletBorderWidthLeft',
				'MobileBorderWidthTop',
				'MobileBorderWidthRight',
				'MobileBorderWidthBottom',
				'MobileBorderWidthLeft',
			]
		),
	}, exclude, attrNameTemplate ), include, attrNameTemplate )
}

export default createBorderAttributes

export const createBorderAttributeNames = attrNameTemplate => Object.keys( createBorderAttributes( attrNameTemplate ) )
