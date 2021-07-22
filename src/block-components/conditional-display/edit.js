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
				>
					{ ! isPro &&
						<ProControl
							title={ __( 'Say Hello to Display Conditions 👋', i18n ) }
							description={ __( 'Show/hide this block based on one or more conditions. This feature is only available on Stackable Premium', i18n ) }
						/>
					}
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
