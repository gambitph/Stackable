/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImagePlain from './images/plain.svg'
import ImageShadow from './images/shadow.svg'
import ImageColored from './images/colored.svg'
import ImagePlus from './images/plus.svg'

/**
 * WorddPress dependencies
 */
import {
	__, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	at, set, get, pick,
} from 'lodash'

export const defaultIcon = '<svg data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>'

export const blockStyles = applyFilters(
	'stackable.accordion.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			onSelect: ( attributes, innerBlocks ) => {
				const [ iconLabelAttributes, contents ] = at( innerBlocks, [
					'[0].innerBlocks[0].attributes',
					'[1].innerBlocks',
				] )

				const headingAttributes = get( innerBlocks, '[0].innerBlocks[0].innerBlocks' ).find( b => b.name === 'stackable/heading' ).attributes
				const iconAttributes = get( innerBlocks, '[0].innerBlocks[0].innerBlocks' ).find( b => b.name === 'stackable/icon' ).attributes

				const defaultBlock = createBlock( 'stackable/accordion', {
					...pick( attributes, 'startOpen', 'onlyOnePanelOpen' ),
				}, createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/column', {
						templateLock: 'insert', hasContainer: true, htmlTag: 'summary',
						className: 'stk--container-small stk-block-accordion__heading',
					}, [
						[ 'stackable/icon-label', { ...iconLabelAttributes }, [
							[ 'stackable/heading', {
								text: _x( 'Title for This Block', 'Heading placeholder', i18n ), hasP: true, textTag: 'h4',
								...headingAttributes,
							} ],
							[ 'stackable/icon', {
								icon: defaultIcon,
								linkHasLink: false,
								...iconAttributes,
							} ],
						] ],
					] ],
					[ 'stackable/column', { templateLock: false, className: 'stk-block-accordion__content' }, [
						[ 'stackable/text', {
							text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
						} ],
					] ],
				] ) )

				set( defaultBlock, 'innerBlocks[1].innerBlocks', contents )

				return defaultBlock
			},
		},
		{
			name: 'plain',
			label: __( 'Plain', i18n ),
			icon: ImagePlain,
			onSelect: ( attributes, innerBlocks ) => {
				const [ iconLabelAttributes, contents ] = at( innerBlocks, [
					'[0].innerBlocks[0].attributes',
					'[1].innerBlocks',
				] )

				const headingAttributes = get( innerBlocks, '[0].innerBlocks[0].innerBlocks' ).find( b => b.name === 'stackable/heading' ).attributes
				const iconAttributes = get( innerBlocks, '[0].innerBlocks[0].innerBlocks' ).find( b => b.name === 'stackable/icon' ).attributes

				const plainBlock = createBlock( 'stackable/accordion', {
					blockBorderType: 'solid',
					blockBorderColor: '#dfdad1',
					blockBorderWidth: {
						top: 0, right: 0, bottom: 1, left: 0,
					},
					blockPadding: {
						top: '', right: '', bottom: 24, left: '',
					},
					...pick( attributes, 'startOpen', 'onlyOnePanelOpen' ),
				}, createBlocksFromInnerBlocksTemplate( [
					[ 'stackable/column', {
						templateLock: 'insert', htmlTag: 'summary',
						className: 'stk--container-small stk-block-accordion__heading',
					}, [
						[ 'stackable/icon-label', { ...iconLabelAttributes }, [
							[ 'stackable/heading', {
								text: _x( 'Title for This Block', 'Heading placeholder', i18n ), hasP: true, textTag: 'h4',
								...headingAttributes,
							} ],
							[ 'stackable/icon', {
								icon: defaultIcon,
								linkHasLink: false,
								...iconAttributes,
							} ],
						] ],
					] ],
					[ 'stackable/column', {
						templateLock: false,
						className: 'stk-block-accordion__content',
						containerPadding: {
							top: 0, right: 0, bottom: 0, left: 0,
						},
					}, [
						[ 'stackable/text', {
							text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
						} ],
					] ],
				] ) )

				set( plainBlock, 'innerBlocks[1].innerBlocks', contents )

				return plainBlock
			},
		},
		{
			name: 'shadow',
			label: __( 'Shadow', i18n ),
			icon: ImageShadow,
			isPremium: ! isPro,
		},
		{
			name: 'colored',
			label: __( 'Colored', i18n ),
			icon: ImageColored,
			isPremium: ! isPro,
		},
		{
			name: 'plus',
			label: __( 'Plus', i18n ),
			icon: ImagePlus,
			isPremium: ! isPro,
		},
	]
)
