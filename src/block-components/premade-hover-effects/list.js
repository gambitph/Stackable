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
		],
	},
	{
		effectsType: 'text',
		effects: [
			{
				value: 'shadow',
				label: __( 'Shadow', i18n ),
				attributes: {
					textShadow: 'none',
					textShadowHover: '12px 4px 2px rgba(0, 0, 0, 0.5)',
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
