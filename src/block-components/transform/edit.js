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
					title={ __( 'Transform & Transition', i18n ) }
					id="transform-transition"
					isPremiumPanel={ ! isPro }
				>
					{ ! isPro && <ProControl type="transforms" /> }
					{ isPro &&
						applyFilters( 'stackable.block-component.transform-transition.control', null )
					}
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}

Edit.defaultProps = {
}
