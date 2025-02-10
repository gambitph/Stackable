/**
 * Internal dependencies
 */
import './editor-loader'
import './block-defaults'
import './icon-library'

/**
 * External dependencies
 */
import { SVGStackableIcon } from '~stackable/icons'
import {
	i18n,
	isContentOnlyMode,
	settings,
} from 'stackable'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { __ } from '@wordpress/i18n'
import { applyFilters, addAction } from '@wordpress/hooks'
import { dispatch, select } from '@wordpress/data'

// Action used to toggle the global settings panel.
addAction( 'stackable.global-settings.toggle-sidebar', 'toggle', () => {
	const stackableSidebar = 'stackable-global-settings/sidebar'
	const currentlyOpenedSidebar = select( 'core/edit-post' ).getActiveGeneralSidebarName()

	if ( currentlyOpenedSidebar === stackableSidebar ) {
		dispatch( 'core/edit-post' ).closeGeneralSidebar( stackableSidebar )
	} else {
		dispatch( 'core/edit-post' ).openGeneralSidebar( stackableSidebar )
	}
} )

const GlobalSettings = () => {
	// For older WP versions (<6.6), wp.editor.PluginSidebar is undefined,
	// use wp.editSite.PluginSidebar and wp.editPost.PluginSidebar as fallback
	const PluginSidebar = window.wp.editor.PluginSidebar || window.wp.editSite?.PluginSidebar || window.wp.editPost?.PluginSidebar

	return (
		<>
			{ PluginSidebar &&
				<PluginSidebar
					name="sidebar"
					title={ __( 'Stackable Settings', i18n ) }
					className="ugb-global-settings__inspector"
					icon={ <SVGStackableIcon /> } >
					{ applyFilters( 'stackable.global-settings.inspector', null ) }
				</PluginSidebar>
			}
		</>
	)
}

if ( ! isContentOnlyMode && settings.stackable_enable_global_settings ) {
	registerPlugin( 'stackable-global-settings', {
		render: GlobalSettings,
	} )
}
