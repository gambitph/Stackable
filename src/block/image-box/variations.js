/**
 * Internal dependencies
 */
import { i18n } from 'stackable'
import SVGBasic from './images/basic.svg'
import SVGSide from './images/side.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'basic',
		title: __( 'Basic', i18n ),
		description: __( 'Basic Layout', i18n ),
		icon: <SVGBasic />,
		attributes: { className: 'is-style-basic' },
		innerBlocks: [
			[ 'stackable/image', { imageHeight: 350, imageFilterParentHover: 'brightness(0.3)' } ],
			[ 'stackable/column', { templateLock: false }, [
				[ 'stackable/subtitle', {
					text: __( 'Subtitle', i18n ),
					blockMargin: { bottom: 8 },
					opacity: 0,
					textColor1: '#FFFFFF',
					opacityParentHover: 1,
				} ],
				[ 'stackable/heading', { text: __( 'Title', i18n ), textTag: 'h4' } ],
				[ 'stackable/text', {
					text: __( 'Description', i18n ),
					opacity: 0,
					transform: 'translateY(-24px)',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
				[ 'stackable/icon', {
					blockMargin: { top: 56 },
					opacity: 0,
					transform: 'translateY(24px)',
					icon: '<svg data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'plain',
		title: __( 'Plain', i18n ),
		description: __( 'Plain Layout', i18n ),
		icon: <SVGSide />,
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
					text: __( 'Subtitle', i18n ),
					blockMargin: { bottom: 8 },
					transform: 'translateY(32px)',
					transformParentHover: 'translateY(0px)',
				} ],
				[ 'stackable/heading', {
					text: __( 'Title', i18n ),
					textTag: 'h4',
					transform: 'translateY(32px)',
					transformParentHover: 'translateY(0px)',
				} ],
				[ 'stackable/text', {
					text: __( 'Description', i18n ),
					opacity: 0,
					opacityParentHover: 1,
				} ],
				[ 'stackable/icon', {
					opacity: 0,
					transform: 'translateY(-32px)',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
					icon: '<svg data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'box',
		title: __( 'Box', i18n ),
		description: __( 'Box Layout', i18n ),
		attributes: { className: 'is-style-box' },
		innerBlocks: [
			[ 'stackable/image', {
				imageHeight: 350,
				imageFilterParentHover: 'brightness(0.3)',
			} ],
			[ 'stackable/column', {
				containerBorderType: 'solid',
				containerBorderWidth: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				containerPadding: {
					top: 32,
					right: 32,
					bottom: 32,
					left: 32,
				},
				innerBlockVerticalAlign: 'flex-end',
				containerBorderWidthParentHover: {
					top: 4,
					right: 4,
					bottom: 4,
					left: 4,
				},
				templateLock: false,
			}, [
				[ 'stackable/subtitle', {
					text: __( 'Subtitle', i18n ),
					blockMargin: {
						bottom: 8,
					},
					opacity: 0,
					transform: 'translateY(32px)',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
				[ 'stackable/heading', {
					text: __( 'Title', i18n ),
					textTag: 'h4',
					transform: 'translateY(32px)',
					transformParentHover: 'translateY(0px)',
				} ],
				[ 'stackable/text', {
					text: __( 'Description', i18n ),
					opacity: 0,
					transform: 'translateY(-24px)',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'captioned',
		title: __( 'Captioned', i18n ),
		description: __( 'Captioned Layout', i18n ),
		attributes: { className: 'is-style-captioned', overflow: 'hidden' },
		innerBlocks: [
			[ 'stackable/image', {
				imageHeight: 350,
				imageFilterParentHover: 'brightness(0.3)',
			} ],
			[ 'stackable/column', {
				hasContainer: true,
				containerBackgroundColor: '#000000',
				containerBackgroundColorOpacity: 0.3,
				positionNum: {
					top: 200,
				},
				containerVerticalAlign: 'flex-start',
				columnSpacing: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				positionNumParentHover: {
					top: 150,
				},
			}, [
				[ 'stackable/subtitle', {
					text: __( 'Subtitle', i18n ),
					blockMargin: {
						bottom: 8,
					},
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
				} ],
				[ 'stackable/heading', {
					text: __( 'Title', i18n ),
					textTag: 'h4',
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
				} ],
				[ 'stackable/text', {
					text: __( 'Description', i18n ),
					opacity: 0,
					transform: 'translateY(-24px)',
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'fade',
		title: __( 'Fade', i18n ),
		description: __( 'Fade Layout', i18n ),
		attributes: { className: 'is-style-fade' },
		innerBlocks: [
			[ 'stackable/image', {
				imageHeight: 350,
				imageFilterParentHover: 'brightness(0.3)',
			} ],
			[ 'stackable/column', {
				hasContainer: true,
				containerBackgroundColor: '#000000',
				containerBackgroundColorOpacity: 0.3,
				containerVerticalAlign: 'flex-end',
				columnSpacing: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				containerBackgroundColorOpacityParentHover: 0.6,
				positionNumParentHover: {
					top: 150,
				},
			}, [
				[ 'stackable/subtitle', {
					text: __( 'Subtitle', i18n ),
					blockMargin: {
						bottom: 8,
					},
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
					opacityParentHover: 0,
				} ],
				[ 'stackable/heading', {
					text: __( 'Title', i18n ),
					textTag: 'h4',
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
					blockMargin: {
						bottom: 88,
					},
					opacityParentHover: 0,
				} ],
				[ 'stackable/text', {
					text: __( 'Description', i18n ),
					opacity: 0,
					transform: 'translateY(24px)',
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'line',
		title: __( 'Line', i18n ),
		description: __( 'Line Layout', i18n ),
		attributes: { className: 'is-style-line' },
		innerBlocks: [
			[ 'stackable/image', {
				imageHeight: 350,
				imageFilterParentHover: 'brightness(0.3)',
			} ],
			[ 'stackable/column', {
				hasContainer: true,
				containerBackgroundColor: '#000000',
				containerBackgroundColorOpacity: 0.3,
				containerVerticalAlign: 'center',
				columnSpacing: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				containerBackgroundColorOpacityParentHover: 0.6,
				positionNumParentHover: {
					top: 150,
				},
			}, [
				[ 'stackable/subtitle', {
					text: __( 'Subtitle', i18n ),
					textColorClass: 'has-white-color',
					blockMargin: {
						bottom: 8,
					},
					opacity: 0,
					textColor1: '#FFFFFF',
					opacityParentHover: 1,
				} ],
				[ 'stackable/heading', {
					textColorClass: 'has-white-color',
					text: __( 'Title', i18n ),
					textTag: 'h4',
					showBottomLine: true,
					bottomLineWidth: 0,
					bottomLineHeight: 6,
					bottomLineColor: '#FFFFFF',
					bottomLineMargin: 16,
					bottomLineAlign: 'center',
					bottomLineWidthParentHover: 80,
					bottomLineWidthUnitParentHover: '%',
				} ],
				[ 'stackable/text', {
					text: __( 'Description', i18n ),
					textColorClass: 'has-white-color',
					opacity: 0,
					transform: 'translateY(-24px)',
					opacityParentHover: 1,
					transformParentHover: 'translateY(0px)',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
