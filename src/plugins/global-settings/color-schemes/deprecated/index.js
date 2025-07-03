/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'

// This makes the color scheme inheritance broken
addFilter( 'stackable.global-settings.global-color-schemes.default-container-scheme', 'stackable.global-settings.global-color-schemes.use-v3_16_0-color-scheme-inheritance', styles => {
	const {
		useV3_16_0_ColorSchemeInheritance,
	} = select( 'stackable/global-color-schemes' ).getSettings()

	if ( useV3_16_0_ColorSchemeInheritance ) {
		return ''
	}

	return styles
} )

