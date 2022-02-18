/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedSelectControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
// import { useBlockAttributes } from '~stackable/hooks'
// import { useDeviceEditorClasses } from '~stackable/components/resizable-column/use-device-editor-classes'

/**
 * WordPress dependencies
 */
import {
	__, //_x, sprintf,
} from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

export const Edit = () => {
	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Effects', i18n ) }
					id="effects"
				>
					<AdvancedSelectControl
						label={ __( 'Hover Effect', i18n ) }
						attribute="premadeHoverEffect"
						responsive="all"
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'shadow', label: __( 'Shadow', i18n ) },
							{ value: 'scaleY(1.5px)', label: __( 'Lift', i18n ) },
							{ value: 'liftMore', label: __( 'Lift More', i18n ) },
							{ value: 'liftShadow', label: __( 'Lift w/ Shadow', i18n ) },
							{ value: 'scale', label: __( 'Scale', i18n ) },
							{ value: 'scaleMore', label: __( 'Scale More', i18n ) },
							{ value: 'scaleShadow', label: __( 'Scale w/ Shadow', i18n ) },
							{ value: 'lower', label: __( 'Lower', i18n ) },
							{ value: 'lowerMore', label: __( 'Lower More', i18n ) },
						] }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}
