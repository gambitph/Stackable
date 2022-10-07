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
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToggleControl,
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
		sizeSelector = '.stk-container',
		borderSelector = '.stk-container',
	} = props

	const attributes = useBlockAttributesContext()
	const setAttributes = useBlockSetAttributesContext()
	const blockElSize = useBlockEl( sizeSelector )
	const blockElBorder = useBlockEl( borderSelector )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Container Background', i18n ) }
				id="container"
				checked={ attributes.hasContainer }
				onChange={ hasContainer => setAttributes( { hasContainer } ) }
			>
				<AdvancedToggleControl
					label={ __( 'Trigger hover state on nested blocks', i18n ) }
					attribute="triggerHoverState"
					defaultValue={ true }
				/>
				<BackgroundControls attrNameTemplate="container%s" />
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Container Size & Spacing', i18n ) }
				id="container-size"
			>
				<SizeControls
					attrNameTemplate="container%s"
					blockEl={ blockElSize }
					enableMargin={ false }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Container Borders & Shadow', i18n ) }
				id="container-size"
			>
				<BorderControls
					attrNameTemplate="container%s"
					blockEl={ blockElBorder }
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
