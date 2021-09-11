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
				>
					{ ! isPro &&
						<ProControl
							title={ __( 'Say Hello to Transforms 👋', i18n ) }
							description={ __( 'Change the timing of your CSS transitions, change the X and Y position, scale or rotate your blocks, perfect for hover animations. This feature is only available on Stackable Premium', i18n ) }
						/>
					}
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
