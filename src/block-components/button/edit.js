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

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

/**
 * Internal dependencies
 */
import { BorderControls } from '../helpers/borders'
import { Link } from '../link'
import { Icon } from '../icon'

export const Edit = props => {
	const {
		hasTextColor,
		hasIconGap,
		hasIconPosition,
	} = props

	const [ state ] = useBlockHoverState()

	const {
		getAttribute,
	} = useAttributeEditHandlers()

	return (
		<Fragment>
			<Link.InspectorControls />
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
						<ColorPaletteControl
							label={ __( 'Text Color', i18n ) }
							attribute="buttonTextColor"
							hover="all"
						/>
					) }
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Button Size & Spacing', i18n ) }
					id="button"
				>

					<Fragment>
						<AdvancedRangeControl
							label={ __( 'Min. Button Height', i18n ) }
							responsive="all"
							attribute="buttonMinHeight"
							min={ 0 }
							max={ 100 }
						/>
						<FourRangeControl
							label={ __( 'Vertical Padding', i18n ) }
							units={ [ 'px', '%' ] }
							responsive="all"
							defaultLocked={ true }
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
							defaultLocked={ true }
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
						hasBorderRadiusHover={ false }
					/>
				</PanelAdvancedSettings>

			</InspectorStyleControls>
			<Icon.InspectorControls
				hasGradient={ false }
				hasShape={ false }
				hasBackgroundShape={ false }
				hasIconGap={ hasIconGap }
				hasIconPosition={ hasIconPosition }
			/>
		</Fragment>
	)
}

Edit.defaultProps = {
	hasTextColor: true,
	hasIconGap: true,
	hasIconPosition: true,
}
