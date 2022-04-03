import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const EFFECTS = [
	{
		effectsType: 'container',
		effects: [
			{
				value: 'shadow',
				label: __( 'Shadow', i18n ),
				attributes: {
					containerShadow: 'none',
					containerShadowHover: '0px 10px 60px rgba(0, 0, 0, 0.1)',
				},
				onApplyEffect: block => {},
				removeEffect: block => {},
				isPremium: false,
			},
			{
				value: 'background-color',
				label: __( 'Background Color', i18n ),
				attributes: {

				},
				onApplyEffect: block => {},
				removeEffect: block => {},
				isPremium: false,
			},
			{
				value: 'border',
				label: __( 'Border', i18n ),
				attributes: {
					containerBorderColorHover: 'var(--stk-global-color-20226, #008de4)',
				},
				onApplyEffect: block => {},
				removeEffect: block => {},
				isPremium: false,
			},
		],
	},
	{
		effectsType: 'image',
		effects: [
			{
				value: 'image-zoom',
				label: __( 'Image Zoom', i18n ),
				attributes: {
					imageZoomHover: '1.25',
				},
			},
			{
				value: 'image-greyscale',
				label: __( 'Greyscale Image', i18n ),
				attributes: {
					imageFilter: 'grayscale(1)',
					imageFilterHover: 'grayscale(0)',
				},
			},
		],
	},
]
