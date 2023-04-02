/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	InspectorAdvancedControls,
	PanelAdvancedSettings,
	ProControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const Edit = () => {
	if ( ! showProNotice && ! isPro ) {
		return null
	}

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Conditional Display', i18n ) }
					id="conditional-display"
					isPremiumPanel={ ! isPro }
				>
					{ ! isPro && <ProControl type="conditional-display" /> }
					{ isPro &&
						applyFilters( 'stackable.block-component.conditional-display.control', null )
					}
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	mainBlockClass: '',
}
