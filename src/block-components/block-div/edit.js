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
	useBlockEl,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const {
		hasSizeSpacing,
		initialOpen,
	} = props
	const hasBackground = useBlockAttributesContext( attributes => attributes.hasBackground )
	const setAttributes = useBlockSetAttributesContext()
	const blockEl = useBlockEl()

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
							attrNameTemplate="block%s"
							blockEl={ blockEl }
							blockHighlight={ {
								highlight: 'outline',
							} }
						/>
						<SizeControls.Spacing
							attrNameTemplate="block%s"
							blockEl={ blockEl }
							blockHighlight={ {
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
					<BackgroundControls attrNameTemplate="block%s" />
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Borders & Shadows', i18n ) }
					id="borders"
					initialOpen={ initialOpen === 'borders' }
				>
					<BorderControls
						attrNameTemplate="block%s"
						blockEl={ blockEl }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</>
	)
}

Edit.defaultProps = {
	hasSizeSpacing: true,
	initialOpen: false,
}
