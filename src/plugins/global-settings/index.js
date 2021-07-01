/**
 * Internal dependencies
 */
import './colors'
import './typography'

/**
 * External dependencies
 */
import { SVGStackableIcon } from '~stackable/icons'
import { i18n, isContentOnlyMode } from 'stackable'

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { Fragment } from '@wordpress/element'
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import {
	applyFilters, addAction,
} from '@wordpress/hooks'
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
	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				target="sidebar"
				className="ugb-global-settings__button"
				icon={ <SVGStackableIcon /> }>
				{ __( 'Stackable Settings', i18n ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name="sidebar"
				title={ __( 'Stackable Settings', i18n ) }
				className="ugb-global-settings__inspector"
				icon={ <SVGStackableIcon /> } >
				{ applyFilters( 'stackable.global-settings.inspector', null ) }
			</PluginSidebar>
		</Fragment> )
}

if ( ! isContentOnlyMode ) {
	registerPlugin( 'stackable-global-settings', {
		render: GlobalSettings,
	} )
}

