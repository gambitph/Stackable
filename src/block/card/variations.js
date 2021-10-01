/**
 * Internal dependencies
 */
import ImageStyleDefault from './images/default.svg'
import ImageStyleHorizontal from './images/horizontal.svg'

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
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.card.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			isDefault: true,
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: {
				className: 'is-style-default',
			},
			icon: ImageStyleDefault,
			innerBlocks: [
				[ 'stackable/heading', {} ],
				[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'default-2',
			title: __( 'Default 2', i18n ),
			isDefault: true,
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default 2', i18n ) ),
			attributes: {
				className: 'is-style-default-2',
			},
			icon: ImageStyleDefault,
			innerBlocks: [
				[ 'stackable/heading', {} ],
				[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/columns', {
					rowAlign: 'center',
					innerBlockContentAlign: 'alignfull',
					align: 'full',
				}, [
					[ 'stackable/column', {
						columnSpacing: {
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
						},
					}, [
						[ 'stackable/button-group', {}, [
							[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
						] ],
					] ],
					[ 'stackable/column', {
						columnSpacing: {
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
						},
					}, [
						[ 'stackable/button-group', {
							columnSpacing: {
								top: 0,
								right: 0,
								bottom: 0,
								left: 0,
							},
							contentAlign: 'right',
						}, [
							[ 'stackable/icon-button', {
								buttonBackgroundColor: 'transparent',
								icon: '<svg data-prefix="fas" data-icon="share-alt" class="svg-inline--fa fa-share-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"></path></svg>',
								iconColor1: '#D3D3D3',
								buttonBackgroundColorHover: 'transparent',
								buttonBackgroundColorParentHover: 'transparent',
								className: 'is-style-plain',
							} ],
							[ 'stackable/icon-button', {
								buttonBackgroundColor: 'transparent',
								icon: '<svg data-prefix="fab" data-icon="facebook-f" class="svg-inline--fa fa-facebook-f fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>',
								iconColor1: '#D3D3D3',
								buttonBackgroundColorHover: 'transparent',
								buttonBackgroundColorParentHover: 'transparent',
								className: 'is-style-plain',
							} ],
						] ],
					] ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			icon: ImageStyleHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'full',
			title: __( 'Full', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Full', i18n ) ),
			icon: ImageStyleHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'faded',
			title: __( 'Faded', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Faded', i18n ) ),
			icon: ImageStyleHorizontal,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
