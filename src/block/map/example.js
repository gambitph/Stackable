/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	attributes: {
		example: `<iframe title="${ __( 'Map Example', 'Map Example Text', i18n ) }" src="https://maps.google.com/maps?q=14.633600461871746, 121.04300214414138&t=&z=12&ie=UTF8&iwloc=&output=embed" class="stk-map" height="300" frameborder="0" style="border:0;width: 100%; max-width: none;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
	},
}
