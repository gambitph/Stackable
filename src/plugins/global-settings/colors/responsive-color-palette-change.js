/**
 * Changing the preview mode or editor view mode resets the color palette in the editor.
 * With this, we are dispatching the color palette from the
 * stackable_global_colors everytime these data have been modified.
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
 * Dispatch the color palette from the settings when the preview mode
 * or the editor view mode has changed.
 */
const ResponsiveColorPalette = () => {
	const { deviceType, preferences } = useSelect(
		select => ( {
			deviceType: select(
				'core/edit-post'
			).__experimentalGetPreviewDeviceType(),
			preferences: select( 'core/edit-post' ).getPreferences(),
		} ),
		[]
	)

	useEffect( () => {
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( res => {
				const { stackable_global_colors: stackableGlobalColors } = res // eslint-disable-line camelcase

				if ( stackableGlobalColors && Array.isArray( stackableGlobalColors ) && stackableGlobalColors.length !== 0 ) {
					// Update the color palette.
					dispatch( 'core/block-editor' ).updateSettings( {
						colors: stackableGlobalColors,
					} )
				}
			} )
		} )
	}, [ deviceType, preferences ] )

	return null
}

// Only do this for WP 5.5
if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	registerPlugin( 'stackable-responsive-color-palette-change', { render: ResponsiveColorPalette } )
}

