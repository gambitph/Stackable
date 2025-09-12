import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

export const siteKit = {
	condition: () => { // If provided, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
		// Force show the tour if there is a GET parameter tour=site-kit
		return window?.location?.search?.includes( 'tour=site-kit' ) ? true : null
	},
	steps: [
		{
			title: '👋 ' + __( 'Welcome to Site Kits', i18n ),
			description: '', // Not yet available.
		},
	],
}
