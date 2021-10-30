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
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			icon: ImageDefault,
			attributes: { className: 'is-style-basic' },
			isDefault: true,
			innerBlocks: [
				[ 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
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
			title: __( 'Compact', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Compact', i18n ) ),
			icon: ImageCompact,
			attributes: { className: 'is-style-compact' },
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
							text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
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
			title: __( 'Banner', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Banner Layout', i18n ) ),
			icon: ImageBanner,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'colored',
			title: __( 'Colored', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Colored Layout', i18n ) ),
			icon: ImageColored,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'sectioned',
			title: __( 'Sectioned', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Sectioned Layout', i18n ) ),
			icon: ImageSectioned,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
