/**
 * Gutenberg can sometimes update the color list on its own, this file ensures
 * that the color picker always contains our global colors.
 *
 */

/**
 * WordPress dependencies
 */
import {
	dispatch, useSelect,
} from '@wordpress/data'
import { useEffect } from '@wordpress/element'
import { registerPlugin } from '@wordpress/plugins'

/**
 * External dependencies
 */
import { isEqual } from 'lodash'

/**
 * Dispatch the color palette from the settings when the preview mode
 * or the editor view mode has changed.
 */
const GlobalColorPaletteUpdater = () => {
	const {
		useStackableColorsOnly, stackableColors, defaultColors, isInitializing, colors,
	} = useSelect(
		select => ( {
			useStackableColorsOnly: select( 'stackable/global-colors' ).getSettings().useStackableColorsOnly,
			stackableColors: select( 'stackable/global-colors' ).getSettings().stackableColors,
			defaultColors: select( 'stackable/global-colors' ).getSettings().defaultColors,
			isInitializing: select( 'stackable/global-colors' ).getSettings().isInitializing,
			colors: select( 'core/block-editor' ).getSettings().colors,
		} ),
		[]
	)

	useEffect( () => {
		if ( isInitializing ) {
			return
		}

		const newColors = useStackableColorsOnly ? [ ...stackableColors ] : [ ...defaultColors, ...stackableColors ]

		// When the colors change, update the color picker.
		if ( ! isEqual( colors, newColors ) ) {
			dispatch( 'core/block-editor' ).updateSettings( {
				colors: newColors,

				/**
				 * withColorContext now gets the colors from features object.
				 *
				 * @since v2.7.2
				 */
				...(
					useStackableColorsOnly ?
						{ __experimentalFeatures: { colors: { theme: [ ...defaultColors ] } } } : {}
				),
			} )
		}
	}, [ JSON.stringify( colors ), JSON.stringify( defaultColors ), JSON.stringify( stackableColors ), useStackableColorsOnly, isInitializing ] )

	// We don't want to render anything here.
	return null
}

registerPlugin( 'stackable-update-global-color-palette', { render: GlobalColorPaletteUpdater } )

