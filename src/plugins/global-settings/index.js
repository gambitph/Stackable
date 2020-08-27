/**
 * Internal dependencies
 */
import './global-colors'

/**
 * External dependencies
 */
import { SVGStackableIcon } from '~stackable/icons'
import { i18n } from 'stackable'

/**
 * Wordpress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { Fragment } from '@wordpress/element'
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import {
	applyFilters, addAction,
} from '@wordpress/hooks'

const GlobalSettings = () => {
	addAction( 'stackable.global-settings.inspector', 'toggle', () => {
		const buttonEl = document.querySelector( '.ugb-global-settings-button' )
		if ( buttonEl ) {
			buttonEl.click()
		}
	} )

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				className="ugb-global-settings-button"
				icon={ <SVGStackableIcon /> }>
				{ __( 'Stackable Global Settings', i18n ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				title={ __( 'Stackable Global Settings', i18n ) }
				icon={ SVGStackableIcon } >
				{ applyFilters( 'stackable.global-settings.inspector', null ) }
			</PluginSidebar>
		</Fragment> )
}

registerPlugin( 'stackable-global-settings', {
	render: GlobalSettings,
} )

