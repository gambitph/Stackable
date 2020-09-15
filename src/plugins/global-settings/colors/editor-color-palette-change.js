/**
 * Changing the preview mode or editor view mode resets the color palette in the editor.
 * With this, we are dispatching the color palette from the
 * stackable_global_colors everytime these data have been modified.
 *
 */

/**
 * Wordpress dependencies
 */
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { loadPromise, models } from '@wordpress/api'
import { useEffect } from '@wordpress/element'
import { registerPlugin } from '@wordpress/plugins'

/**
 * External dependencies
 */
import { uniqBy } from 'lodash'

/**
 * Dispatch the color palette from the settings when the preview mode
 * or the editor view mode has changed.
 */
const EditorColorPaletteChange = () => {
	const {
		deviceType, preferences, defaultColors, useStackableColorsOnly,
	} = useSelect(
		select => ( {
			deviceType: select(
				'core/edit-post'
			).__experimentalGetPreviewDeviceType(),
			preferences: select( 'core/edit-post' ).getPreferences(),
			defaultColors: select( 'core/block-editor' ).getSettings().defaultColors,
			useStackableColorsOnly: select( 'core/block-editor' ).getSettings().useStackableColorsOnly,
		} ),
		[]
	)

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( res => {
				const { stackable_global_colors: stackableGlobalColors } = res // eslint-disable-line camelcase
				const { colors } = select( 'core/block-editor' ).getSettings()

				if ( defaultColors && Array.isArray( defaultColors ) && defaultColors.length ) {
					dispatch( 'core/block-editor' ).updateSettings( {
						colors: useStackableColorsOnly ? [ ...stackableGlobalColors ] : uniqBy( [ ...colors, ...stackableGlobalColors ], 'slug' ),
					} )
				}
			} )
		} )
	}, [ deviceType, preferences, defaultColors ] )

	// We don't want to render anything here.
	return null
}

// Only do this for WP 5.5
if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	registerPlugin( 'stackable-editor-color-palette-change', { render: EditorColorPaletteChange } )
}

