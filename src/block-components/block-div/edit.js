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
	AdvancedSelectControl,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockColorSchemes,
	useBlockLayoutDefaults,
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

	const {
		COLOR_SCHEME_OPTIONS, getScheme, backgroundModeColorScheme,
	} = useBlockColorSchemes()

	const backgroundColorScheme = useBlockAttributesContext( attributes => attributes.backgroundColorScheme )
	const hasBackground = useBlockAttributesContext( attributes => attributes.hasBackground )
	const setAttributes = useBlockSetAttributesContext()
	const { getPlaceholder } = useBlockLayoutDefaults()

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
							paddingPlaceholder={ hasBackground ? getPlaceholder( 'block-background-padding' ) : '' }
							visualGuide={ {
								highlight: 'padding',
							} }
							{ ...props.sizeControlSpacingProps }
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
					<AdvancedSelectControl
						label={ __( 'Color Scheme', i18n ) }
						value={ getScheme( backgroundColorScheme, 'background' ) || backgroundModeColorScheme }
						options={ COLOR_SCHEME_OPTIONS }
						onChange={ backgroundColorScheme => setAttributes( { backgroundColorScheme: backgroundColorScheme === backgroundModeColorScheme ? '' : backgroundColorScheme } ) }
						default={ backgroundModeColorScheme }
					/>
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
						placeholderTemplate="block-background"
						borderTypeValue={ getPlaceholder( 'block-background-border-style' ) }
						borderRadiusPlaceholder={ getPlaceholder( 'block-background-border-radius' ) }
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
