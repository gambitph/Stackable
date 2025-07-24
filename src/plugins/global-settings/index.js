/**
 * Internal dependencies
 */
import './editor-loader'
import './color-schemes'
import './buttons-and-icons'
import './spacing-and-borders'
import './icon-library'
import './preset-controls'

/**
 * External dependencies
 */
import { SVGStackableIcon } from '~stackable/icons'
import {
	i18n,
	isContentOnlyMode,
	settings,
} from 'stackable'
import { currentUserHasCapability } from '~stackable/util'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { __ } from '@wordpress/i18n'
import { applyFilters, addAction } from '@wordpress/hooks'
import { useEffect, useState } from '@wordpress/element'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { PanelBody } from '@wordpress/components'

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
	const [ userCanManageOptions, setUserCanManageOptions ] = useState( false )
	const id = useSelect( select => select( 'core' ).getCurrentUser()?.id )

	useEffect( () => {
		const checkCapabilities = async () => {
			const capabilities = await currentUserHasCapability( 'manage_options' )
			setUserCanManageOptions( capabilities )
		}

		checkCapabilities()
	}, [ id ] )
	// For older WP versions (<6.6), wp.editor.PluginSidebar is undefined,
	// use wp.editSite.PluginSidebar and wp.editPost.PluginSidebar as fallback
	const PluginSidebar = window.wp.editor.PluginSidebar || window.wp.editSite?.PluginSidebar || window.wp.editPost?.PluginSidebar

	const globalSettingsInspector = applyFilters( 'stackable.global-settings.inspector', null )

	return (
		<>
			{ PluginSidebar && userCanManageOptions &&
				<PluginSidebar
					name="sidebar"
					title={ __( 'Stackable Settings', i18n ) }
					className="ugb-global-settings__inspector"
					icon={ <SVGStackableIcon /> }
				>
					<PanelBody>
						<p>
							{ __( 'Set global styles and settings for your Stackable blocks to create a consistent design across your site. All the settings below will apply globally.', i18n ) }
							{ /* &nbsp;
							<a href="https://docs.wpstackable.com/article/465-how-to-style-the-different-block-hover-states?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">{ __( 'Learn more', i18n ) }</a> */ }
						</p>
					</PanelBody>
					{ globalSettingsInspector }
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
