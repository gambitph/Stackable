/**
 * WordPress dependencies
 */
import {
	__, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageSimple from './images/simple.svg'
import ImageHighlighted from './images/highlighted.svg'
import ImageHuge from './images/huge.svg'
import ImageCenteredQuote from './images/centered-quote.svg'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { at } from 'lodash'
import striptags from 'striptags'

export const blockStyles = applyFilters(
	'stackable.blockquote.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, innerBlocks ) => {
				const [ textAttributes, icon ] = at( innerBlocks, [
					'[1].attributes',
					'[0].attributes.icon',
				] )

				textAttributes.text = textAttributes.text.replace( /<span[^\>]*stk-highlight[^\>]*>[^\<]*<\/span>/g, value => {
					return striptags( value )
				} )

				const defaultBlock = createBlock( 'stackable/blockquote', {
					...attributes,
					hasContainer: true,
				}, createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/icon', { icon, linkHasLink: false } ],
					[ 'stackable/text', {
						text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
						...textAttributes,
					} ],
				] ) )

				return defaultBlock
			},
		},
		{
			name: 'simple',
			label: __( 'Simple', i18n ),
			icon: ImageSimple,
			onSelect: ( attributes, innerBlocks ) => {
				const [ textAttributes, icon ] = at( innerBlocks, [
					'[1].attributes',
					'[0].attributes.icon',
				] )

				textAttributes.text = textAttributes.text.replace( /<span[^\>]*stk-highlight[^\>]*>[^\<]*<\/span>/g, value => {
					return striptags( value )
				} )

				const simpleBlock = createBlock( 'stackable/blockquote', {
					...attributes,
					hasContainer: false,
				}, createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/icon', {
						icon,
						opacity: 0.2,
						position: 'absolute',
						positionNum: {
							top: -50, right: '', bottom: '', left: -50,
						},
						iconSize: 200,
						linkHasLink: false,
					} ],
					[ 'stackable/text', {
						text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
						...textAttributes,
					} ],
				] ) )

				return simpleBlock
			},
		},
		{
			name: 'highlighted',
			label: __( 'Highlighted', i18n ),
			icon: ImageHighlighted,
			isPremium: ! isPro,
		},
		{
			name: 'huge',
			label: __( 'Huge', i18n ),
			icon: ImageHuge,
			isPremium: ! isPro,
		},
		{
			name: 'centered-quote',
			label: __( 'Centered Quote', i18n ),
			icon: ImageCenteredQuote,
			isPremium: ! isPro,
		},
	]
)
