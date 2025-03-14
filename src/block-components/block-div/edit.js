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
		hasBackground,
		backgroundColorScheme,
	} = useBlockAttributesContext( attributes => ( {
		hasBackground: attributes.hasBackground,
		backgroundColorScheme: attributes.backgroundColorScheme,
	} ) )
	const setAttributes = useBlockSetAttributesContext()
	const { getPlaceholder } = useBlockLayoutDefaults()

	const {
		COLOR_SCHEME_OPTIONS, backgroundModeColorScheme,
		getScheme, updateColorSchemesInUse,
	} = useBlockColorSchemes()

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
						value={ getScheme( backgroundColorScheme || backgroundModeColorScheme, { mode: 'background', returnFallback: false } ) }
						options={ COLOR_SCHEME_OPTIONS }
						attribute="backgroundColorScheme"
						changeCallback={ ( newScheme, oldScheme ) => {
							const colorScheme = newScheme === backgroundModeColorScheme ? '' : newScheme
							updateColorSchemesInUse( colorScheme, oldScheme, 'background' )
							return colorScheme
						} }
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
