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
	addAction( 'stackable.global-settings.open-sidebar', 'toggle', () => {
		const buttonEl = document.querySelector( `button[aria-label="${ __( 'Stackable Global Settings', i18n ) }"]` )

		// Open the global settings sidebar
		if ( buttonEl ) {
			buttonEl.click()
		}
	} )

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				className="ugb-global-settings__button"
				icon={ <SVGStackableIcon /> }>
				{ __( 'Stackable Global Settings', i18n ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				title={ __( 'Global Settings', i18n ) }
				className="ugb-global-settings__inspector"
				icon={ <SVGStackableIcon /> } >
				{ applyFilters( 'stackable.global-settings.inspector', null ) }
			</PluginSidebar>
		</Fragment> )
}

registerPlugin( 'stackable-global-settings', {
	render: GlobalSettings,
} )

