/**
 * External dependencies
 */
import {
	i18n, showProNotice, isPro,
} from 'stackable'
import {
	PanelAdvancedSettings,
	ProControl,
} from '~stackable/components'

import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

if ( showProNotice || isPro ) {
	addFilter( 'stackable.global-settings.inspector', 'stackable/icon-library', output => {
		return (
			<Fragment>
				{ output }

				<PanelAdvancedSettings
					title={ __( 'Icon Library', i18n ) }
					id="icon-library-settings"
					isPremiumPanel={ ! isPro }
				>
					{ ! isPro && <ProControl type="icon-library" /> }
					{ isPro &&
							applyFilters( 'stackable.global-settings.inspector.icon-library.control', null )
					}

				</PanelAdvancedSettings>
			</Fragment>
		)
	} )
}
