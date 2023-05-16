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
	InspectorBlockControls,
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
		hasContentVerticalAlign = false,
	} = props

	const hasContainer = useBlockAttributesContext( attributes => attributes.hasContainer )
	const setAttributes = useBlockSetAttributesContext()
	const blockElSize = useBlockEl( sizeSelector )
	const blockElBorder = useBlockEl( borderSelector )

	return (
		<>
			<InspectorBlockControls>
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="container-size"
					hasToggle={ true }
					checked={ hasContainer }
					onChange={ hasContainer => setAttributes( { hasContainer } ) }

				>
					<SizeControls.Layout
						attrNameTemplate="container%s"
						blockEl={ blockElSize }
						enableMargin={ false }
						labels={ {
							labelHeight: __( 'Container Min. Height', i18n ),
							labelContentWidth: __( 'Max Container Width', i18n ),
							labelHorizontalAlign: __( 'Container Horizontal Align', i18n ),
							labelVerticalAlign: __( 'Container Vertical Align', i18n ),
						} }
						hasContentVerticalAlign={ hasContentVerticalAlign }
						visualGuide={ {
							selector: '.stk-%s-container',
							highlight: 'outline',
						} }
					/>
					<SizeControls.Spacing
						attrNameTemplate="container%s"
						blockEl={ blockElSize }
						enableMargin={ false }
						paddingPlaceholder="32"
						visualGuide={ {
							selector: '.stk-%s-container',
						} }
					/>
				</PanelAdvancedSettings>
			</InspectorBlockControls>

			{ hasContainer && (
				<InspectorStyleControls>
					<PanelAdvancedSettings
						title={ __( 'Container Background', i18n ) }
						id="container"
					>
						<AdvancedToggleControl
							label={ __( 'Trigger hover state on nested blocks', i18n ) }
							attribute="triggerHoverState"
							defaultValue={ true }
						/>
						<BackgroundControls attrNameTemplate="container%s" />
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
			) }
		</>
	)
}
