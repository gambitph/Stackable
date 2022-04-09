/**
 * Gutenberg can sometimes update the color list on its own, this file ensures
 * that the color picker always contains our global colors.
 *
 */

/**
 * WordPress dependencies
 */
import {
	dispatch, useSelect, select,
} from '@wordpress/data'
import { useEffect, useRef } from '@wordpress/element'
import { registerPlugin } from '@wordpress/plugins'

/**
 * External dependencies
 */
import { cloneDeep, isEqual } from 'lodash'

// Debounce useEffect.
const useDebounce = ( callback, timeout, deps ) => {
	const timeoutId = useRef()

	useEffect( () => {
		clearTimeout( timeoutId.current )
		timeoutId.current = setTimeout( callback, timeout )

		return () => clearTimeout( timeoutId.current )
	}, deps )
}

/**
 * Dispatch the color palette from the settings when the preview mode
 * or the editor view mode has changed.
 */
const GlobalColorPaletteUpdater = () => {
	const {
		useStackableColorsOnly,
		stackableColors,
		defaultColors,
		isInitializing,
		colors,
	} = useSelect( select => {
		const stkSettings = select( 'stackable/global-colors' ).getSettings()
		return {
			useStackableColorsOnly: stkSettings.useStackableColorsOnly,
			stackableColors: stkSettings.stackableColors,
			defaultColors: stkSettings.defaultColors,
			isInitializing: stkSettings.isInitializing,
			colors: select( 'core/block-editor' ).getSettings().colors,
		}
	} )

	// This should be debounced since the colors can be changed rapidly (e.g.
	// when dragging the custom color picker handle)
	useDebounce( () => {
		if ( isInitializing ) {
			return
		}

		const newColors = useStackableColorsOnly ? [ ...stackableColors ] : [ ...defaultColors, ...stackableColors ]

		// When the colors change, update the color picker.
		if ( ! isEqual( colors, newColors ) ) {
			/**
			 * withColorContext (our color picker uses this) now gets the colors
			 * from the __experimentalFeatures object
			 *
			 * We need to clone and add only the colors we need because the
			 * object may have other properties.
			 */
			const experimentalFeatures = cloneDeep( select( 'core/block-editor' ).getSettings().__experimentalFeatures || {} )
			if ( typeof experimentalFeatures.color === 'undefined' ) {
				experimentalFeatures.color = {}
			}
			if ( typeof experimentalFeatures.color.palette === 'undefined' ) {
				experimentalFeatures.color.palette = {}
			}
			experimentalFeatures.color.palette.theme = [ ...newColors ]

			// Update the colors.
			dispatch( 'core/block-editor' ).updateSettings( {
				colors: newColors,
				__experimentalFeatures: experimentalFeatures,
			} )
		}
	}, 200, [ colors, defaultColors, stackableColors, useStackableColorsOnly, isInitializing ] )

	// We don't want to render anything here.
	return null
}

registerPlugin( 'stackable-update-global-color-palette', { render: GlobalColorPaletteUpdater } )

