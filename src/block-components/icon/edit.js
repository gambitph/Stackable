/*
 * External dependencies
 */
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	IconControl,
	AdvancedSelectControl,
	ImageShapeControl,
	AdvancedRangeControl,
	FourRangeControl,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useAttributeEditHandlers,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	ToggleControl,
} from '@wordpress/components'
import { Fragment } from '@wordpress/element'

export const Edit = props => {
	const {
		hasGradient,
		hasShape,
		hasIconGap,
		hasIconPosition,
		hasBackgroundShape,
		initialOpen,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Icon', i18n ) }
				id="icon"
				initialOpen={ initialOpen }
			>

				<IconControl
					label={ __( 'Icon', i18n ) }
					value={ getAttribute( 'icon' ) }
					onChange={ updateAttributeHandler( 'icon' ) }
				/>

				{ hasGradient && (
					<Fragment>
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
							attribute="iconColorType"
						/>

						<ColorPaletteControl
							label={ getAttribute( 'iconColorType' ) === 'gradient' && hasGradient ? sprintf( __( 'Icon Color #%s', i18n ), 1 )
								: __( 'Icon Color', i18n ) }
							attribute="iconColor1"
							hover="all"
						/>
						{ getAttribute( 'iconColorType' ) === 'gradient' && hasGradient && (
							<Fragment>
								<ColorPaletteControl
									label={ sprintf( __( 'Icon Color #%s', i18n ), 2 ) }
									attribute="iconColor2"
									hover="all"
								/>

								<AdvancedRangeControl
									label={ __( 'Gradient Direction (degrees)', i18n ) }
									attribute="iconColorGradientDirection"
									hover="all"
									min={ 0 }
									max={ 360 }
									step={ 10 }
									allowReset={ true }
								/>
							</Fragment>
						) }
					</Fragment>
				) }

				{ ! hasGradient && (
					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						attribute="iconColor1"
						hover="all"
					/>
				) }

				<AdvancedRangeControl
					label={ __( 'Icon Size', i18n ) }
					attribute="iconSize"
					sliderMin={ 0 }
					sliderMax={ 100 }
					step={ 1 }
					allowReset={ true }
					hover="all"
				/>

				<AdvancedRangeControl
					label={ __( 'Icon Opacity', i18n ) }
					attribute="iconOpacity"
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1.0"
					hover="all"
				/>

				<AdvancedRangeControl
					label={ __( 'Icon Rotation', i18n ) }
					attribute="iconRotation"
					min={ 0 }
					max={ 360 }
					allowReset={ true }
					placeholder="0"
					hover="all"
				/>

				{ hasIconPosition && (
					<AdvancedSelectControl
						label={ __( 'Icon Position', i18n ) }
						attribute="iconPosition"
						options={ [
							{ value: '', label: __( 'Left', i18n ) },
							{ value: 'right', label: __( 'Right', i18n ) },
						] }
					/>
				) }

				{ hasIconGap && (
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						attribute="iconGap"
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="0"
					/>
				) }

				{ hasShape && (
					<Fragment>
						<ToggleControl
							label={ __( 'Shaped', i18n ) }
							checked={ getAttribute( 'shaped' ) }
							onChange={ updateAttributeHandler( 'shaped' ) }
						/>

						{ getAttribute( 'shaped' ) && (
							<Fragment>

								<ColorPaletteControl
									label={ __( 'Shape Color', i18n ) }
									attribute="shapeColor"
									hover="all"
									hasTransparent={ true }
								/>

								<AdvancedRangeControl
									label={ __( 'Shape Border Radius', i18n ) }
									attribute="shapeBorderRadius"
									hover="all"
									min={ 0 }
									max={ 100 }
									step={ 1 }
									allowReset={ true }
									placeholder={ 50 }
								/>

								<AdvancedRangeControl
									label={ __( 'Shape Padding', i18n ) }
									attribute="shapePadding"
									hover="all"
									sliderMin={ 0 }
									sliderMax={ 150 }
									step={ 1 }
									allowReset={ true }
									placeholder={ 20 }
								/>

								<ToggleControl
									label={ __( 'Shape Outline', i18n ) }
									checked={ getAttribute( 'shapeOutline' ) }
									onChange={ updateAttributeHandler( 'shapeOutline' ) }
								/>

								{ getAttribute( 'shapeOutline' ) && (
									<Fragment>

										<ColorPaletteControl
											label={ __( 'Shape Outline Color', i18n ) }
											attribute="shapeOutlineColor"
											hover="all"
										/>

										<FourRangeControl
											label={ __( 'Shape Outline Width' ) }
											units={ [ 'px' ] }
											min={ 0 }
											max={ 99 }
											step={ 1 }
											sliderMax={ 20 }
											defaultLocked={ true }
											attribute="shapeOutlineWidth"
											responsive="all"
											hover="all"
											default="1"
										/>

									</Fragment>
								) }

							</Fragment>
						) }
					</Fragment>
				) }

				{ hasBackgroundShape && (
					<Fragment>
						<ToggleControl
							label={ __( 'Background Shape', i18n ) }
							checked={ getAttribute( 'showBackgroundShape' ) }
							onChange={ updateAttributeHandler( 'showBackgroundShape' ) }
						/>

						{ getAttribute( 'showBackgroundShape' ) && (
							<Fragment>

								<ImageShapeControl
									label={ __( 'Shape', i18n ) }
									selected={ getAttribute( 'backgroundShape' ) }
									onChange={ updateAttributeHandler( 'backgroundShape' ) }
								/>

								<ColorPaletteControl
									label={ __( 'Shape Color', i18n ) }
									attribute="backgroundShapeColor"
									hover="all"
								/>

								<AdvancedRangeControl
									label={ __( 'Shape Opacity', i18n ) }
									attribute="backgroundShapeOpacity"
									hover="all"
									min={ 0 }
									max={ 1 }
									step={ 0.1 }
									placeholder="1"
									allowReset={ true }
								/>

								<AdvancedRangeControl
									label={ __( 'Shape Size', i18n ) }
									attribute="backgroundShapeSize"
									hover="all"
									min={ 0 }
									max={ 3 }
									step={ 0.1 }
									placeholder="1"
									allowReset={ true }
								/>

								<AdvancedRangeControl
									label={ __( 'Horizontal Offset', i18n ) }
									attribute="backgroundShapeOffsetHorizontal"
									hover="all"
									min={ -30 }
									max={ 30 }
									step={ 1 }
									placeholder="0"
									allowReset={ true }
								/>

								<AdvancedRangeControl
									label={ __( 'Vertical Offset', i18n ) }
									attribute="backgroundShapeOffsetVertical"
									hover="all"
									min={ -30 }
									max={ 30 }
									step={ 1 }
									placeholder="0"
									allowReset={ true }
								/>

							</Fragment>
						) }
					</Fragment>
				) }

			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	label: __( 'Icon', i18n ),
	hasGradient: true,
	hasShape: true,
	hasBackgroundShape: true,
	initialOpen: false,
	hasIconGap: false,
	hasIconPosition: false,
}
