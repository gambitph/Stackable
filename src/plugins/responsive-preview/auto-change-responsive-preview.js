/**
 * Bind the responsive preview toggler with Stackable's responsive toggler so
 * that switching one would also switch the other. Enabling a live preview-like
 * experience.
 */

/**
 * External dependencies
 */
import {
	getSelectedScreen, setSelectedScreen, setIsScreenPickerOpen,
} from '~stackable/util'
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

// Scroll the editor to the selected element
const scrollToSelectedElement = ( query, offset = 0 ) => {
	setTimeout( () => {
		const selectedElement = document.querySelector( '.is-selected' )
		const visualEditor = document.querySelector( query )
		if ( selectedElement ) {
			const topPos = selectedElement.offsetTop
			visualEditor.scrollTop = topPos + offset
		}
	}, 300 )
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
			setIsScreenPickerOpen( true )
			doAction( 'stackable.responsive-toggle.screen.open' )
			scrollToSelectedElement( '.edit-post-visual-editor', 200 )
		} else {
			setIsScreenPickerOpen( false )
			doAction( 'stackable.responsive-toggle.screen.close' )
			scrollToSelectedElement( '.interface-interface-skeleton__content', 200 )
		}
	}, 0 )

	// We don't really render anything visible.
	return null
}

// Only do this for WP 5.5
if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	registerPlugin( 'stackable-responsive-toggle-change', { render: ResponsiveToggle } )
}

