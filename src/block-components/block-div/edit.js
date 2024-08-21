/**
 * Internal dependencies
 */
import {
	BackgroundControls,
	BorderControls,
	SizeControls,
} from '../helpers'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorBlockControls,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

export const Edit = memo( props => {
	const {
		hasSizeSpacing,
		initialOpen,
		backgroundMediaAllowVideo,
	} = props
	const hasBackground = useBlockAttributesContext( attributes => attributes.hasBackground )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<>
			<InspectorBlockControls>
				{ hasSizeSpacing && (
					<PanelAdvancedSettings
						title={ __( 'Block Size & Spacing', i18n ) }
						id="spacing"
						initialOpen={ initialOpen === 'spacing' }
					>
						<SizeControls.Layout
							{ ...props }
							attrNameTemplate="block%s"
							visualGuide={ {
								highlight: 'outline',
							} }
							{ ...props.sizeControlLayoutProps }
						/>
						<SizeControls.Spacing
							attrNameTemplate="block%s"
							visualGuide={ {
								highlight: 'padding',
							} }
						/>
					</PanelAdvancedSettings>
				) }
			</InspectorBlockControls>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Background', i18n ) }
					id="background"
					hasToggle={ true }
					checked={ hasBackground }
					onChange={ hasBackground => setAttributes( { hasBackground } ) }
					initialOpen={ initialOpen === 'background' }
				>
					<BackgroundControls
						attrNameTemplate="block%s"
						onBackgroundEnableAttribute="hasBackground"
						backgroundMediaAllowVideo={ backgroundMediaAllowVideo } />
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Borders & Shadows', i18n ) }
					id="borders"
					initialOpen={ initialOpen === 'borders' }
				>
					<BorderControls
						attrNameTemplate="block%s"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</>
	)
} )

Edit.defaultProps = {
	hasSizeSpacing: true,
	initialOpen: false,
	sizeControlLayoutProps: {},
}
