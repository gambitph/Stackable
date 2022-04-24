/**
 * This adds support for the margin bottom resizer. The margin bottom resizer
 * should use the value if specified in the design system.
 */

/**
 * Internal dependencies
 */
import { useAttributeName, useDeviceType } from '~stackable/hooks'
import { dispatchUpdateEvent } from '~stackable/hooks/use-update-event'

/**
 * WordPress dependencies
 */
import { addAction, addFilter } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

// Trigger an update to all resizable bottom margin components when first
// loading the design system. Do this only if there's a margin bottom used.
addAction( 'stackable.design_system.loaded', 'stackable/margin-bottom', designSystem => {
	if ( typeof designSystem.styles.marginBottom !== 'undefined' ) {
		dispatchUpdateEvent( 'stackable.resizable-bottom-margin' )
	}
} )

// Update the default values of the bottom margin resizers.
addFilter( 'stackable.resizable-bottom-margin.default', 'stackable/design-system', value => {
	const { getStyle } = useSelect( 'stackable/design-system' )
	const deviceType = useDeviceType()
	const marginBottomName = useAttributeName( 'marginBottom', 'all', false )
	let style = getStyle( marginBottomName )

	// If no value for the current device, check inherited value from a larger screen.
	if ( style === '' && deviceType === 'Mobile' ) {
		style = getStyle( 'marginBottomTablet' )
	}
	if ( style === '' && ( deviceType === 'Tablet' || deviceType === 'Mobile' ) ) {
		style = getStyle( 'marginBottom' )
	}

	return style === 0 ? style : ( style || value )
} )
