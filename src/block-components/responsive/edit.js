/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorAdvancedControls,
} from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { ToggleControl } from '@wordpress/components'

export const Edit = () => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const {
		hideDesktop,
		hideTablet,
		hideMobile,
	} = useBlockAttributes( clientId )

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Responsive', i18n ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Hide on Desktop', i18n ) }
						checked={ hideDesktop }
						onChange={ hideDesktop => updateBlockAttributes( clientId, { hideDesktop } ) }
					/>
					<ToggleControl
						label={ __( 'Hide on Tablet', i18n ) }
						checked={ hideTablet }
						onChange={ hideTablet => updateBlockAttributes( clientId, { hideTablet } ) }
					/>
					<ToggleControl
						label={ __( 'Hide on Mobile', i18n ) }
						checked={ hideMobile }
						onChange={ hideMobile => updateBlockAttributes( clientId, { hideMobile } ) }
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}
