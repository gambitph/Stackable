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

export const Edit = props => {
	if ( ! showProNotice && ! isPro ) {
		return null
	}

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Motion Effects', i18n ) }
					id="effects-animations"
				>
					{ ! isPro &&
						<ProControl
							title={ __( 'Say Hello to Motion Effects 👋', i18n ) }
							description={ __( 'Add entrance fade ins and animations when you scroll. This feature is only available on Stackable Premium', i18n ) }
						/>
					}
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

Edit.defaultProps = {
	mainBlockClass: '',
}
