/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'
import { defaultsDeep, remove } from 'lodash'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageCompact from './images/compact.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageBubble from './images/bubble.svg'
import ImageVertical from './images/vertical.svg'
import ImageInvertedVertical from './images/inverted-vertical.svg'
import { extractInnerBlocksFromColumnsBlock } from '~stackable/util'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.testimonial.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, _innerBlocks ) => {
				const innerBlocks = [ ..._innerBlocks ]
				const textBlocks = remove( innerBlocks, ( { name } ) => name === 'stackable/text' )
				const imageBlocks = remove( innerBlocks, ( { name } ) => name === 'stackable/image' )

				return createBlock( 'stackable/testimonial', attributes, [
					...textBlocks,
					...imageBlocks,
					...innerBlocks,
				] )
			},
		},
		{
			name: 'compact',
			label: __( 'Compact', i18n ),
			icon: ImageCompact,
			migrate: ( attributes, innerBlocks, options ) => {
				const newInnerBlocks = []
				innerBlocks.forEach( innerBlock => {
					const columnsInnerBlocks = extractInnerBlocksFromColumnsBlock( innerBlock )
					if ( columnsInnerBlocks ) {
						newInnerBlocks.push( ...columnsInnerBlocks )
					} else {
						newInnerBlocks.push( innerBlock )
					}
				} )

				const textBlocks = remove( newInnerBlocks, ( { name } ) => name === 'stackable/text' )
				const imageBlocks = remove( newInnerBlocks, ( { name } ) => name === 'stackable/image' )

				return withDefault( {
					attributes: {
						...attributes,
						hasContainer: true,
					},
					innerBlocks: [
						...textBlocks,
						...imageBlocks,
						...newInnerBlocks,
					],
					options,
				} )
			},
			onSelect: ( attributes, _innerBlocks ) => {
				const innerBlocks = [ ..._innerBlocks ]
				const textBlocks = remove( innerBlocks, ( { name } ) => name === 'stackable/text' )
				const imageBlocks = remove( innerBlocks, ( { name } ) => name === 'stackable/image' )

				const newColumnsBlock = createBlock( 'stackable/columns', { columnFit: true }, [
					createBlock( 'stackable/column', {}, imageBlocks ),
					createBlock( 'stackable/column', { contentAlign: 'left' }, innerBlocks ),
				] )

				newColumnsBlock.attributes.uniqueId = createUniqueClass( newColumnsBlock.clientId )

				return createBlock( 'stackable/testimonial', {
					...attributes, hasContainer: false, contentAlign: '',
				}, [
					...textBlocks,
					newColumnsBlock,
				] )
			},
		},
		{
			name: 'horizontal',
			label: __( 'Horizontal', i18n ),
			icon: ImageHorizontal,
			isPremium: ! isPro,
		},
		{
			name: 'bubble',
			label: __( 'Bubble', i18n ),
			icon: ImageBubble,
			isPremium: ! isPro,
		},
		{
			name: 'vertical',
			label: __( 'Vertical', i18n ),
			icon: ImageVertical,
			isPremium: ! isPro,
		},
		{
			name: 'inverted-vertical',
			label: __( 'Inverted Vertical', i18n ),
			icon: ImageInvertedVertical,
			isPremium: ! isPro,
		},
	],
	withDefault
)
