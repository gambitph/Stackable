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
import { getPropsWithDefaults } from '../../util/props'

export const Edit = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, EDIT_DEFAULT_PROPS )
	if ( ! showProNotice && ! isPro ) {
		return null
	}

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Motion Effects', i18n ) }
					id="effects-animations"
					isPremiumPanel={ ! isPro }
					responsive={ false }
				>
					{ ! isPro && <ProControl type="motion-effects" /> }
					{ isPro &&
						applyFilters( 'stackable.block-component.effects-animations.control', null, {
							mainBlockClass: props.mainBlockClass,
						} )
					}
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}

const EDIT_DEFAULT_PROPS = {
	mainBlockClass: '',
}
