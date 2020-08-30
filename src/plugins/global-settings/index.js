/**
 * Internal dependencies
 */
import './colors'
import './typography'
import './typography-styles'

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
	applyFilters, addAction, addFilter,
} from '@wordpress/hooks'

const GlobalSettings = () => {
	addAction( 'stackable.global-settings.open-sidebar', 'toggle', () => {
		const buttonEl = document.querySelector( `button[aria-label="${ __( 'Stackable Global Settings', i18n ) }"]` )

		// Open the global settings sidebar
		if ( buttonEl ) {
			buttonEl.click()
		}
	} )

	/**
	 * Used in ColorPaletteControl component.
	 * Changing the Global Colors inside the Stackable Global Settings updates its fallback value ( e.g.
	 * var(--stk-global-color-ugb12, #000000) to var(--stk-global-color-ugb12, #34aa6b) ), resulting to
	 * unmatched fallback values between the block attribute and the global color. With this, we are
	 * forcing the passed value to match its corresponding global color.
	 */
	addFilter( 'stackable.global-settings.update-color-value', 'update-value', ( value, colors ) => {
		// If the value is an empty string or undefined, return the value.
		if ( ! value ) {
			return value
		}

		// If the value does not contain any global color variable, return the value.
		if ( value && typeof value === 'string' && ! value.match( /--stk-global-color-/ ) ) {
			return value
		}

		let newValue = value

		if ( colors && Array.isArray( colors ) && colors.length !== 0 ) {
			colors.forEach( color => {
				const colorVarID = value.match( /--stk-global-color-(\S*),/ )[ 1 ]
				if ( colorVarID ) {
					const colorVarRegex = new RegExp( `--stk-global-color-${ colorVarID }` )
					if ( color.color.match( colorVarRegex ) ) {
						newValue = color.color
					}
				}
			} )
		}

		return newValue
	} )

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				className="ugb-global-settings__button"
				icon={ <SVGStackableIcon /> }>
				{ __( 'Stackable Settings', i18n ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				title={ __( 'Stackable Settings', i18n ) }
				className="ugb-global-settings__inspector"
				icon={ <SVGStackableIcon /> } >
				{ applyFilters( 'stackable.global-settings.inspector', null ) }
			</PluginSidebar>
		</Fragment> )
}

registerPlugin( 'stackable-global-settings', {
	render: GlobalSettings,
} )

