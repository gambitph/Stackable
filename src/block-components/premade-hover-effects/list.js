import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const EFFECTS = [
	{
		effectsType: 'container',
		effects: [
			{
				value: '',
				label: __( 'None', i18n ),
			},
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
				value: 'lift',
				label: __( 'Lift', i18n ),
				attributes: {
					transformHover: 'translateY(-20px)',
				},
			},
			{
				value: 'lift-more',
				label: __( 'Lift More', i18n ),
				attributes: {
					transformHover: 'translateY(-50px)',
				},
			},
			{
				value: 'background-disappear',
				label: __( 'Transparent Background', i18n ),
				attributes: {
					containerBackgroundColorOpacityHover: '0',
				},
			},
		],
	},
	{
		effectsType: 'text',
		effects: [
			{
				value: 'shadow',
				label: __( 'Shadow', i18n ),
				attributes: {
					typographyShadow: 'none',
					typographyShadowHover: '0px 10px 60px rgba(0, 0, 0, 0.1)',
				},
			},
		],
	},
	{
		effectsType: 'button',
		effects: [
			{},
		],
	},
]
