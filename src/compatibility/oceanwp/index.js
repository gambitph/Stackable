/**
 * Kadence Theme compatibility.
 */

/**
 * External dependencies
 */
import { currentTheme } from 'stackable'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.heading.edit.useThemeTextMargins', 'stackable/compatibility/oceanwp', value => {
	if ( currentTheme !== 'oceanwp' ) {
		return value
	}

	// If no value has been set, default to true to use OceanWP margins
	if ( value === '' ) {
		return true
	}

	return value
} )
