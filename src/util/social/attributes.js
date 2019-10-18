/**
 * Creates all the attributes needed for the Social Buttons Controls component
 */
/**
 * External dependencies
 */
import { createAllCombinationAttributes, createButtonAttributes } from '~stackable/util'
import { upperFirst } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import {
	omitAttributes,
	pickAttributes,
} from '../attributes'
import { SOCIAL_SITES } from './'

const createSocialButtonAttributes = ( attrNameTemplate, options = {} ) => {
	const {
		selector = '.ugb-button-%s',
		exclude = [],
		include = [],
	} = options

	const socialProps = Object.keys( SOCIAL_SITES ).reduce( ( propsToPass, socialId ) => {
		return {
			...propsToPass,
			...createAllCombinationAttributes(
				attrNameTemplate,
				{
					type: 'string',
					source: 'attribute',
					selector: sprintf( selector, socialId ),
					attribute: 'href',
					default: options[ `${ socialId }Default` ] ? options[ `${ socialId }Default` ] : '',
				},
				[
					`${ upperFirst( socialId ) }Url`,
				]
			),
		}
	}, {} )

	return pickAttributes( omitAttributes( {
		...createButtonAttributes( attrNameTemplate, {
			exclude: [
				'Text',
				'Url',
				'NoFollow',
				'Icon',
				'IconPosition',
				'NewTab',
			],
		} ),
		// New tab isn't tied up to an HTML attribute.
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: '',
			},
			[
				'NewTab',
			]
		),
		...createAllCombinationAttributes(
			attrNameTemplate,
			{
				type: 'boolean',
				default: true,
			},
			[
				'UseSocialColors',
			]
		),
		...socialProps,
	}, exclude, attrNameTemplate ), include, attrNameTemplate )
}

export default createSocialButtonAttributes

export const createSocialButtonAttributeNames = attrNameTemplate => Object.keys( createSocialButtonAttributes( attrNameTemplate ) )
