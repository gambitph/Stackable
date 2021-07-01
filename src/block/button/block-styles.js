/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		onSelect: attributes => {
			let willSetAttributes = {}

			// Normal button style
			willSetAttributes = {
				...willSetAttributes,
				buttonBorderType: '',
				buttonBackgroundColor: attributes.buttonBackgroundColor !== 'transparent'
					? attributes.buttonBackgroundColor
					: attributes.textColor1,
				textColor1: attributes.buttonBackgroundColor === 'transparent'
					? '#fff'
					: attributes.buttonBackgroundColor,
			}

			// Hover button style
			willSetAttributes = {
				...willSetAttributes,
				buttonHoverBorderType: '',
				buttonHoverBackgroundColor: attributes.buttonHoverBackgroundColor !== 'transparent'
					? attributes.buttonHoverBackgroundColor
					: attributes.hoverTextColor1,
				hoverTextColor1: attributes.buttonHoverBackgroundColor === 'transparent'
					? '#fff'
					: attributes.buttonHoverBackgroundColor,
			}

			return willSetAttributes
		},
	},
	{
		name: 'ghost',
		label: __( 'Ghost', i18n ),
		onSelect: attributes => {
			let willSetAttributes = {}

			// Normal button style.
			willSetAttributes = {
				...willSetAttributes,
				buttonBackgroundColorType: '',
				buttonBorderType: 'solid',
				buttonBorderColor: attributes.buttonBackgroundColor === 'transparent'
					? attributes.textColor1
					: attributes.buttonBackgroundColor,
				buttonBackgroundColor: 'transparent',
				textColorType: '',
				textColor1: attributes.buttonBackgroundColor === 'transparent'
					? attributes.textColor1
					: attributes.buttonBackgroundColor,
			}

			// Hover button style.
			willSetAttributes = {
				...willSetAttributes,
				buttonHoverBackgroundColorType: '',
				buttonHoverBorderType: 'solid',
				buttonHoverBorderColor: attributes.buttonHoverBackgroundColor === 'transparent'
					? attributes.hoverTextColor1
					: attributes.buttonHoverBackgroundColor,
				buttonHoverBackgroundColor: 'transparent',
				hoverTextColorType: '',
				hoverTextColor1: attributes.buttonHoverBackgroundColor === 'transparent'
					? attributes.hoverTextColor1
					: attributes.buttonHoverBackgroundColor,
			}

			return willSetAttributes
		},
	},
	{
		name: 'plain',
		label: __( 'Plain', i18n ),
		onSelect: attributes => {
			let willSetAttributes = {}

			// Normal button style.
			willSetAttributes = {
				...willSetAttributes,
				buttonBackgroundColorType: '',
				buttonBorderType: '',
				buttonBackgroundColor: 'transparent',
				textColorType: '',
				textColor1: attributes.buttonBackgroundColor === 'transparent'
					? attributes.textColor1
					: attributes.buttonBackgroundColor,
			}

			// Hover button style.
			willSetAttributes = {
				...willSetAttributes,
				buttonHoverBackgroundColorType: '',
				buttonHoverBorderType: '',
				buttonHoverBackgroundColor: 'transparent',
				hoverTextColorType: '',
				hoverTextColor1: attributes.buttonHoverBackgroundColor === 'transparent'
					? attributes.hoverTextColor1
					: attributes.buttonHoverBackgroundColor,
			}

			return willSetAttributes
		},
	},
]
