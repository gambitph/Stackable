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
	ButtonIconPopoverControl,
	BlendModeControl,
} from '~stackable/components'
import { Typography } from '~stackable/block-components'
import { useAttributeEditHandlers } from '~stackable/hooks'
import {
	DEFAULT_PERCENT, DEFAULT_THICKNESS, DEFAULT_SIZE, DEFAULT_HEIGHT,
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

export const Edit = ( { attrNameTemplate, isCircle } ) => {
	const {
		getAttribute,
		updateAttributes,
	} = useAttributeEditHandlers( attrNameTemplate )

	const isColorGradient = getAttribute( 'progressColorType' ) === 'gradient'

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
						label={ isCircle ? __( 'Size', i18n ) : __( 'Height', i18n ) }
						attribute="progressSize"
						min="0"
						sliderMin={ isCircle ? 50 : 32 }
						sliderMax={ isCircle ? 300 : 100 }
						step="1"
						placeholder={ isCircle ? DEFAULT_SIZE : DEFAULT_HEIGHT }
					/>
					{ ! isCircle && (
						<AdvancedRangeControl
							label={ __( 'Border Radius', i18n ) }
							attribute="progressBorderRadius"
							allowReset={ true }
							min="0"
							units={ [ 'px', '%', 'rem' ] }
							step="1"
							sliderMax="100"
						/>
					) }
					{ isCircle && (
						<AdvancedRangeControl
							label={ __( 'Thickness', i18n ) }
							attribute="progressThickness"
							min="0"
							sliderMin="1"
							sliderMax="30"
							step="1"
							placeholder={ DEFAULT_THICKNESS }
						/>
					) }
					<>
						<AdvancedToolbarControl
							controls={ GRADIENT_OPTIONS }
							isSmall={ true }
							fullwidth={ false }
							attribute="progressColorType"
						/>
						<ColorPaletteControl
							label={ isColorGradient ? sprintf( __( 'Bar Color #%s', i18n ), 1 )
								: __( 'Bar Color', i18n ) }
							attribute="progressColor1"
							hasTransparent={ isColorGradient }
						/>
						{ isColorGradient && (
							<>
								<ColorPaletteControl
									label={ sprintf( __( 'Bar Color #%s', i18n ), 2 ) }
									attribute="progressColor2"
									hasTransparent={ true }
								/>
							</>
						) }
						{ ( isColorGradient && ! isCircle ) && (
							<ButtonIconPopoverControl
								label={ __( 'Adv. Gradient Color Settings', i18n ) }
								onReset={ () => {
									updateAttributes( {
										progressColorGradientDirection: '',
										progressColorGradientBlendMode: '',
										progressColorGradientLocation1: '',
										progressColorGradientLocation2: '',
									} )
								} }
								allowReset={
									( getAttribute( 'progressColorGradientDirection' ) !== '' && getAttribute( 'progressColorGradientDirection' ) !== 90 ) ||
									( getAttribute( 'progressColorGradientLocation1' ) !== '' && getAttribute( 'progressColorGradientLocation1' ) !== 0 ) ||
									( getAttribute( 'progressColorGradientLocation2' ) !== '' && getAttribute( 'progressColorGradientLocation2' ) !== 100 ) ||
									getAttribute( 'progressColorGradientBlendMode' )
								}
							>
								<AdvancedRangeControl
									label={ __( 'Gradient Direction (degrees)', i18n ) }
									attribute="progressColorGradientDirection"
									min={ 0 }
									max={ 360 }
									step={ 10 }
									allowReset={ true }
									placeholder="90"
									className="ugb--help-tip-gradient-direction"
								/>
								<AdvancedRangeControl
									label={ sprintf( __( 'Color %d Location', i18n ), 1 ) }
									attribute="progressColorGradientLocation1"
									sliderMin={ 0 }
									max={ 100 }
									step={ 1 }
									allowReset={ true }
									placeholder="0"
									className="ugb--help-tip-gradient-location"
								/>
								<AdvancedRangeControl
									label={ sprintf( __( 'Color %d Location', i18n ), 2 ) }
									attribute="progressColorGradientLocation2"
									sliderMin={ 0 }
									max={ 100 }
									step={ 1 }
									allowReset={ true }
									placeholder="100"
									className="ugb--help-tip-gradient-location"
								/>
								<BlendModeControl
									label={ __( 'Background Gradient Blend Mode', i18n ) }
									attribute="progressColorGradientBlendMode"
									className="ugb--help-tip-background-blend-mode"
								/>
							</ButtonIconPopoverControl>
						) }
					</>
					<ColorPaletteControl
						label={ __( 'Background Color', i18n ) }
						attribute="progressBackgroundColor"
						hasTransparent={ true }
					/>
					{ isCircle && (
						<AdvancedToggleControl
							label={ __( 'Rounded', i18n ) }
							attribute="progressRounded"
						/>
					) }
					<AdvancedToggleControl
						label={ __( 'Animate', i18n ) }
						attribute="progressAnimate"
						defaultValue={ true }
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
	isCircle: false,
	attrNameTemplate: '%s',
}
