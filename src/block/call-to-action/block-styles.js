/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { defaultsDeep } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	__, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageHorizontal2 from './images/horizontal-2.svg'
import ImageHorizontal3 from './images/horizontal-3.svg'
import ImageSplitCentered from './images/split-centered.svg'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {
		column1Attributes: {},
		column2Attributes: {},
	},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.call-to-action.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			isDefault: true,
			icon: ImageDefault,
			migrate: ( attributes, innerBlocks, options ) => {
				return withDefault( {
					attributes, innerBlocks, options,
				} )
			},
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock( 'stackable/call-to-action', {
					...attributes,
					innerBlockOrientation: 'vertical',
				}, innerBlocks )
			},
		},
		{
			name: 'horizontal',
			label: __( 'Horizontal', i18n ),
			icon: ImageHorizontal,
			migrate: ( attributes, innerBlocks, options ) => {
				return withDefault( {
					attributes, innerBlocks, options,
				} )
			},
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock( 'stackable/call-to-action', {
					...attributes,
					hasContainer: true,
					innerBlockOrientation: 'horizontal',
					innerBlockContentAlign: 'alignwide',
					innerBlockVerticalAlign: 'center',
				}, innerBlocks )
			},
		},
		{
			name: 'horizontal-2',
			label: __( 'Horizontal 2', i18n ),
			icon: ImageHorizontal2,
			isPremium: ! isPro,
		},
		{
			name: 'horizontal-3',
			label: __( 'Horizontal 3', i18n ),
			icon: ImageHorizontal3,
			isPremium: ! isPro,
		},
		{
			name: 'split-centered',
			label: __( 'Split Centered', i18n ),
			icon: ImageSplitCentered,
			isPremium: ! isPro,
		},
	],
	withDefault
)
