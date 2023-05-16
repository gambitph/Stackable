/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageCompact from './images/compact.svg'
import ImageBanner from './images/banner.svg'
import ImageColored from './images/colored.svg'
import ImageSectioned from './images/sectioned.svg'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.pricing-box.variations',
	[
		{
			name: 'default',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-basic' },
			isDefault: true,
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
			isActive: [ 'className' ],
			innerBlocks: [
				[ 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3',
				} ],
				[ 'stackable/price', {} ],
				[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
				[ 'stackable/icon-list', {
					text: sprintf( '<li>%s</li><li>%s</li><li>%s</li>', ...[ __( 'one', i18n ), __( 'two', i18n ), __( 'three', i18n ) ].map( v => sprintf( __( 'Package inclusion %s', i18n ), v ) ) ),
				} ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: _x( 'Button', 'Button placeholder', i18n ),
					} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'compact',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Compact', i18n ) ),
			attributes: { className: 'is-style-compact' },
			pickerTitle: __( 'Compact', i18n ),
			pickerIcon: ImageCompact,
			isActive: [ 'className' ],
			innerBlocks: [
				[ 'stackable/columns', {}, [
					[ 'stackable/column', {}, [
						[ 'stackable/image', {} ],
					] ],
					[ 'stackable/column', {
						contentAlign: 'left',
						columnAlign: 'center',
					}, [
						[ 'stackable/heading', {
							text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3',
						} ],
						[ 'stackable/price', {} ],
						[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
						[ 'stackable/button-group', {}, [
							[ 'stackable/button', {
								text: _x( 'Button', 'Button placeholder', i18n ),
							} ],
						] ],
					] ],
				] ],
				[ 'stackable/icon-list', {
					text: sprintf( '<li>%s</li><li>%s</li><li>%s</li>', ...[ __( 'one', i18n ), __( 'two', i18n ), __( 'three', i18n ) ].map( v => sprintf( __( 'Package inclusion %s', i18n ), v ) ) ),
				} ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'banner',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Banner Layout', i18n ) ),
			attributes: {
				className: 'is-style-banner',
			},
			pickerTitle: __( 'Banner', i18n ),
			pickerIcon: ImageBanner,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'colored',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Colored Layout', i18n ) ),
			attributes: {
				className: 'is-style-colored',
			},
			pickerTitle: __( 'Colored', i18n ),
			pickerIcon: ImageColored,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'sectioned',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Sectioned Layout', i18n ) ),
			attributes: {
				className: 'is-style-sectioned',
			},
			pickerTitle: __( 'Sectioned', i18n ),
			pickerIcon: ImageSectioned,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
