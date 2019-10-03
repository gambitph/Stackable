/**
 * Creates all the attributes needed for the Button Controls component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes, createTypographyAttributes } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { omitAttributes, pickAttributes } from '../attributes'

const createButtonAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		selector = '.ugb-button',
		defaultText = __( 'Button text', i18n ),
		exclude = [],
		include = [],
	} = options

	return pickAttributes( omitAttributes( {
		...createTypographyAttributes( attrNameTemplate ),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				source: 'html',
				selector: `${ selector } span`,
				default: defaultText,
			},
			[
				'Text',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'string',
				source: 'attribute',
				selector,
				attribute: 'href',
				default: '',
			},
			[
				'Url',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				source: 'attribute',
				selector,
				attribute: 'target',
				default: '',
			},
			[
				'NewTab',
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
				'PaddingTop',
				'PaddingRight',
				'PaddingBottom',
				'PaddingLeft',
				'BorderRadius',
				'BorderWidth',
				'Shadow',
				'IconSize',
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
				'HoverGhostToNormal',
				'NoFollow',
			]
		),
	}, exclude, attrNameTemplate ), include, attrNameTemplate )
}

export default createButtonAttributes

export const createButtonAttributeNames = attrNameTemplate => Object.keys( createButtonAttributes( attrNameTemplate ) )
