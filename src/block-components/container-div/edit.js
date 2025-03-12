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
	AdvancedSelectControl,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockLayoutDefaults,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'

export const Edit = props => {
	const {
		hasContentVerticalAlign = false,
	} = props

	const { COLOR_SCHEME_OPTIONS, containerModeColorScheme } = useSelect( select => {
		const { colorSchemes, containerModeColorScheme } = select( 'stackable/global-color-schemes' ).getSettings()
		const COLOR_SCHEME_OPTIONS = colorSchemes?.map( scheme => ( {
			label: scheme.name,
			value: scheme.key,
		} ) )

		return {
			COLOR_SCHEME_OPTIONS,
			containerModeColorScheme,
		}
	} )

	const hasContainer = useBlockAttributesContext( attributes => attributes.hasContainer )
	const containerColorScheme = useBlockAttributesContext( attributes => attributes.containerColorScheme )
	const setAttributes = useBlockSetAttributesContext()
	const { getPlaceholder } = useBlockLayoutDefaults()

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
					<AdvancedSelectControl
						label={ __( 'Color Scheme', i18n ) }
						value={ containerColorScheme || containerModeColorScheme }
						// TODO: get options from color schemes
						options={ COLOR_SCHEME_OPTIONS }
						onChange={ containerColorScheme => ( { containerColorScheme } ) }
						default={ containerModeColorScheme }
					/>
					<SizeControls.Layout
						attrNameTemplate="container%s"
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
						enableMargin={ false }
						paddingPlaceholder={ getPlaceholder( 'container-padding' ) }
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
							placeholderTemplate="container"
							borderTypeValue={ getPlaceholder( 'container-border-style' ) }
							borderRadiusPlaceholder={ getPlaceholder( 'container-border-radius' ) }
						/>
					</PanelAdvancedSettings>
				</InspectorStyleControls>
			) }
		</>
	)
}
