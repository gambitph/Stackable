/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageHorizontal from './images/horizontal.svg'
import ImageOverlapShape1 from './images/overlap-shape-1.svg'
import ImageOverlapShape2 from './images/overlap-shape-2.svg'
import ImageOverlapShape3 from './images/overlap-shape-3.svg'
import ImageOverlapShape4 from './images/overlap-shape-4.svg'
import ImageOverlapShape5 from './images/overlap-shape-5.svg'
import ImageOverlapBg1 from './images/overlap-bg-1.svg'
import ImageOverlapBg2 from './images/overlap-bg-2.svg'
import ImageOverlapBg3 from './images/overlap-bg-3.svg'
import ImageOverlapBg4 from './images/overlap-bg-4.svg'
import ImageOverlapBg5 from './images/overlap-bg-5.svg'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.feature.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-default' },
			icon: ImageDefault,
			isDefault: true,
			innerBlocks: [
				[ 'stackable/column', {}, [
					[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ) } ],
					[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
					] ],
				] ],
				[ 'stackable/column', { templateLock: 'insert', columnAlign: 'center' }, [
					[ 'stackable/image', {} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			icon: ImageHorizontal,
			attributes: {
				className: 'is-style-horizontal', align: 'full', innerBlockContentAlign: 'alignwide',
			},
			innerBlocks: [
				[ 'stackable/column', {}, [
					[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h2' } ],
					[ 'stackable/columns', {}, [
						[ 'stackable/column', { align: 'full' }, [
							[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3' } ],
							[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block.', 'Content placeholder', i18n ) } ],
						] ],
						[ 'stackable/column', {}, [
							[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3' } ],
							[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block.', 'Content placeholder', i18n ) } ],
						] ],
					] ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
					] ],
				] ],
				[ 'stackable/column', { templateLock: 'insert', columnAlign: 'center' }, [
					[ 'stackable/image', {} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-1',
			title: __( 'Overlap Shape 1', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 1', i18n ) ),
			icon: ImageOverlapShape1,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-2',
			title: __( 'Overlap Shape 2', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 2', i18n ) ),
			icon: ImageOverlapShape2,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-3',
			title: __( 'Overlap Shape 3', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 3', i18n ) ),
			icon: ImageOverlapShape3,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-4',
			title: __( 'Overlap Shape 4', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 4', i18n ) ),
			icon: ImageOverlapShape4,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-5',
			title: __( 'Overlap Shape 5', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 5', i18n ) ),
			icon: ImageOverlapShape5,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-1',
			title: __( 'Overlap Background 1', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 1', i18n ) ),
			icon: ImageOverlapBg1,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-2',
			title: __( 'Overlap Background 2', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 2', i18n ) ),
			icon: ImageOverlapBg2,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-3',
			title: __( 'Overlap Background 3', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 3', i18n ) ),
			icon: ImageOverlapBg3,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-4',
			title: __( 'Overlap Background 4', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 4', i18n ) ),
			icon: ImageOverlapBg4,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-5',
			title: __( 'Overlap Background 5', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 5', i18n ) ),
			icon: ImageOverlapBg5,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
