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
		title: __( 'Basic' ),
		description: __( 'Basic' ),
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
		name: 'side',
		title: __( 'Side' ),
		description: __( 'Side' ),
		icon: <SVGSide />,
		attributes: { contentAlign: 'left', className: 'is-style-side' },
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
]

export default variations
