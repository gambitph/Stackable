/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorStyleControls,
	AdvancedToggleControl,
	AdvancedRangeControl,
	AdvancedTextControl,
	ColorPaletteControl,
	AdvancedToolbarControl,
} from '~stackable/components'
import { Typography } from '~stackable/block-components'
import {
	useBlockAttributesContext, useBlockSetAttributesContext, useAttributeEditHandlers,
} from '~stackable/hooks'
import {
	DEFAULT_PERCENT, DEFAULT_THICKNESS, DEFAULT_SIZE,
} from './attributes'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

const GRADIENT_OPTIONS = [
	{
		value: '',
		title: __( 'Single', i18n ),
	},
	{
		value: 'gradient',
		title: __( 'Gradient', i18n ),
	},
]

export const Edit = ( { attrNameTemplate } ) => {
	const setAttributes = useBlockSetAttributesContext()
	const {
		progressAnimate,
		progressRounded,
	} = useBlockAttributesContext()

	const {
		getAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )

	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Progress Bar', i18n ) }
					initialOpen
				>
					<AdvancedRangeControl
						label={ __( 'Percentage', i18n ) }
						attribute="progressPercent"
						min="0"
						max="100"
						sliderMax="100"
						step="1"
						placeholder={ DEFAULT_PERCENT }
						isDynamic
					/>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						attribute="progressSize"
						min="0"
						sliderMin="50"
						sliderMax="300"
						step="1"
						placeholder={ DEFAULT_SIZE }
						allowReset={ false }
					/>
					<AdvancedRangeControl
						label={ __( 'Thickness', i18n ) }
						attribute="progressThickness"
						min="0"
						sliderMin="1"
						sliderMax="30"
						step="1"
						placeholder={ DEFAULT_THICKNESS }
						allowReset={ false }
					/>
					<>
						<AdvancedToolbarControl
							controls={ GRADIENT_OPTIONS }
							isSmall={ true }
							fullwidth={ false }
							attribute="progressColorType"
						/>
						<ColorPaletteControl
							label={ getAttribute( 'progressColorType' ) === 'gradient' ? sprintf( __( 'Bar Color #%s', i18n ), 1 )
								: __( 'Bar Color', i18n ) }
							attribute="progressColor1"
							hasTransparent={ getAttribute( 'progressColorType' ) === 'gradient' }
						/>
						{ getAttribute( 'progressColorType' ) === 'gradient' && (
							<>
								<ColorPaletteControl
									label={ sprintf( __( 'Bar Color #%s', i18n ), 2 ) }
									attribute="progressColor2"
									hasTransparent={ true }
								/>
							</>
						) }
					</>
					<ColorPaletteControl
						label={ __( 'Background Color', i18n ) }
						attribute="progressBackgroundColor"
						hasTransparent={ true }
					/>
					<AdvancedToggleControl
						label={ __( 'Rounded', i18n ) }
						checked={ progressRounded }
						onChange={ progressRounded => setAttributes( { progressRounded } ) }
					/>
					<AdvancedToggleControl
						label={ __( 'Animate', i18n ) }
						checked={ progressAnimate }
						onChange={ progressAnimate => setAttributes( { progressAnimate } ) }
					/>
					<AdvancedTextControl
						label={ __( 'Accessibility Label', i18n ) }
						attribute="progressAriaValueText"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Typography.InspectorControls
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
				hasTextShadow
				hasTextPrefix
				hasTextSuffix
				hasToggle
				label={ __( 'Label', i18n ) }
			/>
		</Fragment>
	)
}

Edit.defaulProps = {
	attrNameTemplate: '%s',
}
