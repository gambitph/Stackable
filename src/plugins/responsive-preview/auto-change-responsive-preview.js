/**
 * Bind the responsive preview toggler with Stackable's responsive toggler so
 * that switching one would also switch the other. Enabling a live preview-like
 * experience.
 */

/**
 * External dependencies
 */
import { getSelectedScreen, setSelectedScreen } from '~stackable/util'
import { findKey } from 'lodash'

/**
 * WordPress dependencies
 */
import { addAction, doAction } from '@wordpress/hooks'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'

// Map of our responsive toggle to preview device type.
const PREVIEW_MODES_MAP = {
	desktop: 'Desktop',
	tablet: 'Tablet',
	mobile: 'Mobile',
}

// Change the preview mode in the editor when Stackable responsive toggles are
// changed.
addAction( 'stackable.responsive-toggle.screen.change', `stackable/responsive-preview`, mode => {
	const {
		__experimentalSetPreviewDeviceType: setPreviewDeviceType,
	} = dispatch( 'core/edit-post' )
	const {
		__experimentalGetPreviewDeviceType: getPreviewDeviceType,
	} = select( 'core/edit-post' )

	if ( ! setPreviewDeviceType ) {
		return
	}

	const value = PREVIEW_MODES_MAP[ mode ]
	if ( value !== getPreviewDeviceType() ) {
		setPreviewDeviceType( value )
	}
} )

// Change the Stackable responsive toggles when the preview mode in the editor
// is changed.
const ResponsiveToggle = () => {
	const { deviceType } = useSelect(
		select => ( {
			deviceType: select(
				'core/edit-post'
			).__experimentalGetPreviewDeviceType(),
		} ),
		[]
	)

	const value = findKey( PREVIEW_MODES_MAP, n => n === deviceType ) || 'desktop'
	setTimeout( () => {
		// Change the selected responsive toggle.
		if ( value !== getSelectedScreen() ) {
			setSelectedScreen( value )
			doAction( 'stackable.responsive-toggle.screen.change', value )
		}

		// Open the responsive toggle area.
		if ( value !== 'desktop' ) {
			doAction( 'stackable.responsive-toggle.screen.open' )
		} else {
			doAction( 'stackable.responsive-toggle.screen.close' )
		}
	}, 0 )

	// We don't really render anything visible.
	return null
}

registerPlugin( 'stackable-responsive-toggle-change', { render: ResponsiveToggle } )
