/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export { default as createSocialButtonAttributes } from './attributes'
export { createSocialButtonAttributeNames } from './attributes'
export { createSocialButtonStyleSet } from './styles'

export const SOCIAL_SITES = {
	facebook: {
		label: __( 'Facebook', i18n ),
		icon: 'fab-facebook-f',
	},
	twitter: {
		label: __( 'Twitter', i18n ),
		icon: 'fab-twitter',
	},
	instagram: {
		label: __( 'Instagram', i18n ),
		icon: 'fab-instagram',
	},
	pinterest: {
		label: __( 'Pinterest', i18n ),
		icon: 'fab-pinterest-p',
	},
	linkedin: {
		label: __( 'LinkedIn', i18n ),
		icon: 'fab-linkedin-in',
	},
	youtube: {
		label: __( 'YouTube', i18n ),
		icon: 'fab-youtube',
	},
	email: {
		label: __( 'Email', i18n ),
		icon: 'far-envelope',
	},
}
