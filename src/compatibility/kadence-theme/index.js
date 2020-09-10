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

// Support for Kadence Theme Global Palette.
addFilter( 'stackable.color-palette-control.change', 'stackable/compatibility/kadence', ( value, colorObject ) => {
	if ( currentTheme !== 'kadence' ) {
		return value
	}

	// Check if the color is part
	if ( colorObject && colorObject.slug.match( /^theme-palette\d+/ ) ) {
		return colorObject.slug.replace( /^[\w-]*(\d+)/, `var(--global-palette$1, ${ value })` )
	}

	return value
} )
