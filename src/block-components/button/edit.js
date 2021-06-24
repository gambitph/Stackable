/*
 * External dependencies
 */
import {
	AdvancedRangeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	FourRangeControl,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers, useBlockHoverState,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

/**
 * Internal dependencies
 */
import { BorderControls } from '../helpers/borders'

export const Edit = props => {
	const {
		hasTextColor,
		hasTextGradient,
	} = props

	const [ state ] = useBlockHoverState()

	const {
		getAttribute,
		updateAttributes,
	} = useAttributeEditHandlers()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Button Colors' ) }
				id="button-colors"
			>
				<AdvancedToolbarControl
					controls={ [
						{
							value: '',
							title: __( 'Single', i18n ),
						},
						{
							value: 'gradient',
							title: __( 'Gradient', i18n ),
						},
					] }
					attribute="buttonBackgroundColorType"
					isSmall={ true }
					fullwidth={ false }
				/>
				<ColorPaletteControl
					label={ getAttribute( 'buttonBackgroundColorType' ) === 'gradient'
						? sprintf( __( 'Button Color #%s', i18n ), 1 )
						: __( 'Button Color', i18n )
					}
					attribute="buttonBackgroundColor"
					hasTransparent={ state === 'normal' && getAttribute( 'buttonBackgroundColorType' ) !== 'gradient' }
					hover="all"
				/>
				{ getAttribute( 'buttonBackgroundColorType' ) === 'gradient' && (
					<Fragment>
						<ColorPaletteControl
							label={ __( 'Button Color #2', i18n ) }
							attribute="buttonBackgroundColor2"
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Gradient Direction (degrees)', i18n ) }
							attribute="buttonBackgroundGradientDirection"
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
							hover="all"
						/>
					</Fragment>
				) }

				{ hasTextColor && (
					<Fragment>
						{ hasTextGradient && (
							<AdvancedToolbarControl
								controls={ [
									{
										value: '',
										title: __( 'Single', i18n ),
									},
									{
										value: 'gradient',
										title: __( 'Gradient', i18n ),
									},
								] }
								isSmall={ true }
								fullwidth={ false }
								attribute="buttonTextColorType"
								onReset={ () => {
									updateAttributes( {
										[ getAttributeName( 'buttonTextColor1' ) ]: '',
										[ getAttributeName( 'buttonTextColor2' ) ]: '',
									} )
								} }
							/>
						) }
						<ColorPaletteControl
							label={ getAttribute( 'buttonTextColorType' ) === 'gradient' && hasTextGradient ? sprintf( __( 'Text Color #%s', i18n ), 1 )
								: __( 'Text Color', i18n ) }
							attribute="buttonTextColor1"
							hover={ getAttribute( 'buttonTextColorType' ) === 'gradient' && hasTextGradient ? false : 'all' }
						/>
						{ getAttribute( 'buttonTextColorType' ) === 'gradient' && hasTextGradient && (
							<Fragment>
								<ColorPaletteControl
									label={ sprintf( __( 'Text Color #%s', i18n ), 1 ) }
									attribute="buttonTextColor2"
								/>

								<AdvancedRangeControl
									label={ __( 'Gradient Direction (degrees)', i18n ) }
									attribute="buttonTextGradientDirection"
									min={ 0 }
									max={ 360 }
									step={ 10 }
									allowReset={ true }
								/>
							</Fragment>
						) }
					</Fragment>
				) }
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Button Size & Spacing', i18n ) }
				id="button"
			>

				<Fragment>
					<FourRangeControl
						label={ __( 'Vertical Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						defaultLocked={ false }
						attribute="buttonPadding"
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						enableLeft={ false }
						enableRight={ false }
					/>
					<FourRangeControl
						label={ __( 'Horizontal Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						defaultLocked={ false }
						attribute="buttonPadding"
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						enableTop={ false }
						enableBottom={ false }
					/>
				</Fragment>

			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Button Borders & Shadows', i18n ) }
				id="button-borders"
			>
				<BorderControls
					attrNameTemplate="button%s"
				/>
			</PanelAdvancedSettings>

		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasTextColor: true,
	hasTextGradient: true,
}
