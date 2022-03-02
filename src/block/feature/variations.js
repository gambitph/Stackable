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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-default' },
			isActive: [ 'className' ],
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
			isDefault: true,
			innerBlocks: [
				[ 'stackable/column', { columnAlign: 'center' }, [
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			attributes: {
				className: 'is-style-horizontal',
				align: 'full',
				innerBlockContentAlign: 'alignwide',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Horizontal', i18n ),
			pickerIcon: ImageHorizontal,
			innerBlocks: [
				[ 'stackable/column', { columnAlign: 'center' }, [
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 1', i18n ) ),
			attributes: {
				className: 'is-style-overlap-shape-1',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Shape 1', i18n ),
			pickerIcon: ImageOverlapShape1,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-2',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 2', i18n ) ),
			attributes: {
				className: 'is-style-overlap-shape-2',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Shape 2', i18n ),
			pickerIcon: ImageOverlapShape2,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-3',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 3', i18n ) ),
			attributes: {
				className: 'is-style-overlap-shape-3',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Shape 3', i18n ),
			pickerIcon: ImageOverlapShape3,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-4',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 4', i18n ) ),
			attributes: {
				className: 'is-style-overlap-shape-4',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Shape 4', i18n ),
			pickerIcon: ImageOverlapShape4,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-shape-5',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Shape 5', i18n ) ),
			attributes: {
				className: 'is-style-overlap-shape-5',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Shape 5', i18n ),
			pickerIcon: ImageOverlapShape5,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-1',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 1', i18n ) ),
			attributes: {
				className: 'is-style-overlap-background-1',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Background 1', i18n ),
			pickerIcon: ImageOverlapBg1,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-2',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 2', i18n ) ),
			attributes: {
				className: 'is-style-overlap-background-2',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Background 2', i18n ),
			pickerIcon: ImageOverlapBg2,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-3',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 3', i18n ) ),
			attributes: {
				className: 'is-style-overlap-background-3',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Background 3', i18n ),
			pickerIcon: ImageOverlapBg3,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-4',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 4', i18n ) ),
			attributes: {
				className: 'is-style-overlap-background-4',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Background 4', i18n ),
			pickerIcon: ImageOverlapBg4,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'overlap-background-5',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Overlap Background 5', i18n ) ),
			attributes: {
				className: 'is-style-overlap-background-5',
			},
			isActive: [ 'className' ],
			pickerTitle: __( 'Overlap Background 5', i18n ),
			pickerIcon: ImageOverlapBg5,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
