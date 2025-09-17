import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

export const designSystemPicker = {
	condition: () => { // If provided, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
		// Force show the tour if there is a GET parameter tour=design-system-picker
		return window?.location?.search?.includes( 'tour=design-system-picker' ) ? true : null
	},
	steps: [
		{
			title: '👋 ' + __( 'Welcome to The Design System Picker', i18n ),
			description: '', // Not yet available.
		},
	],
}
