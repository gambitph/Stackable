/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImagePlain from './images/plain.svg'
import ImageBox from './images/box.svg'
import ImageCaptioned from './images/captioned.svg'
import ImageFade from './images/fade.svg'
import ImageLine from './images/line.svg'

/**
 * WordPress dependencies
 */
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.image-box.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			icon: ImageDefault,
			attributes: { className: 'is-style-default' },
			innerBlocks: [
				[ 'stackable/image', { imageHeight: 350, imageFilterParentHover: 'brightness(0.3)' } ],
				[ 'stackable/column', { templateLock: false }, [
					[ 'stackable/subtitle', {
						text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ),
						blockMargin: { bottom: 8 },
						opacity: 0,
						textColorClass: 'has-white-color',
						textColor1: '#FFFFFF',
						opacityParentHover: 1,
					} ],
					[ 'stackable/heading', {
						text: _x( 'Title for This Block', 'Heading placeholder', i18n ),
						textTag: 'h4',
						textColorClass: 'has-white-color',
						textColor1: '#FFFFFF',
					} ],
					[ 'stackable/text', {
						text: _x( 'Text for This Block', 'Text placeholder', i18n ),
						opacity: 0,
						transform: 'translateY(-24px)',
						opacityParentHover: 1,
						transformParentHover: 'translateY(0px)',
						textColorClass: 'has-white-color',
						textColor1: '#FFFFFF',
					} ],
					[ 'stackable/icon', {
						blockMargin: { top: 56 },
						opacity: 0,
						transform: 'translateY(24px)',
						icon: '<svg data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>',
						opacityParentHover: 1,
						transformParentHover: 'translateY(0px)',
						iconColor1: '#FFFFFF',
					} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Plain', i18n ) ),
			icon: ImagePlain,
			attributes: { contentAlign: 'left', className: 'is-style-plain' },
			innerBlocks: [
				[ 'stackable/image', {
					imageHeight: 350,
					imageFilterParentHover: 'brightness(0.3)',
				} ],
				[ 'stackable/column', {
					containerPadding: {
						top: 32, right: 32, bottom: 32, left: 32,
					},
					innerBlockVerticalAlign: 'flex-end',
					templateLock: false,
				}, [
					[ 'stackable/subtitle', {
						text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ),
						blockMargin: { bottom: 8 },
						transform: 'translateY(32px)',
						transformParentHover: 'translateY(0px)',
						textColorClass: 'has-white-color',
						textColor1: '#FFFFFF',
					} ],
					[ 'stackable/heading', {
						text: _x( 'Title for This Block', 'Heading placeholder', i18n ),
						textTag: 'h4',
						transform: 'translateY(32px)',
						transformParentHover: 'translateY(0px)',
						textColorClass: 'has-white-color',
						textColor1: '#FFFFFF',
					} ],
					[ 'stackable/text', {
						text: _x( 'Text for This Block', 'Text placeholder', i18n ),
						opacity: 0,
						opacityParentHover: 1,
						textColorClass: 'has-white-color',
						textColor1: '#FFFFFF',
					} ],
					[ 'stackable/icon', {
						opacity: 0,
						transform: 'translateY(-32px)',
						opacityParentHover: 1,
						transformParentHover: 'translateY(0px)',
						icon: '<svg data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>',
						iconColor1: '#FFFFFF',
					} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'box',
			title: __( 'Box', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Box', i18n ) ),
			icon: ImageBox,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'captioned',
			title: __( 'Captioned', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Captioned', i18n ) ),
			icon: ImageCaptioned,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'fade',
			title: __( 'Fade', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Fade', i18n ) ),
			icon: ImageFade,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'line',
			title: __( 'Line', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Line', i18n ) ),
			icon: ImageLine,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
