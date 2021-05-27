/*
 * External dependencies
 */
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	AdvancedRangeControl,
	TabbedLayout,
	IconControl,
	ResponsiveControl2,
	AdvancedSelectControl,
	ImageShapeControl,
	SpacingControl,
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
import { useState, Fragment } from '@wordpress/element'

const IconControls = props => {
	const {
		label,
		enableIcon = true,
		enableBackgroundShapeIcon = true,
		attrNameTemplate = '%s',
		normalAttrNameTemplate = '%s',
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
	} = useAttributeEditHandlers( attrNameTemplate )

	const {
		getAttribute: getNormalAttribute,
		updateAttributeHandler: updateNormalAttributeHandler,
	} = useAttributeEditHandlers( normalAttrNameTemplate )

	return (
		<Fragment>
			{ enableIcon && (
				<IconControl
					label={ label }
					value={ getAttribute( 'icon' ) }
					onChange={ updateAttributeHandler( 'icon' ) }
				/>
			) }

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
				value={ getAttribute( 'iconColorType' ) }
				onChange={ updateAttributeHandler( 'iconColorType' ) }
			/>

			<ColorPaletteControl
				label={ getAttribute( 'iconColorType' ) === 'gradient' ? sprintf( __( '%s Color #%s', i18n ), label, 1 )
					: sprintf( __( '%s Color', i18n ), label ) }
				value={ getAttribute( 'iconColor1' ) }
				onChange={ updateAttributeHandler( 'iconColor1' ) }
			/>
			{ getAttribute( 'iconColorType' ) === 'gradient' && (
				<Fragment>
					<ColorPaletteControl
						label={ sprintf( __( '%s Color #2', i18n ), label ) }
						value={ getAttribute( 'iconColor2' ) }
						onChange={ updateAttributeHandler( 'iconColor2' ) }
					/>

					<AdvancedRangeControl
						label={ __( 'Gradient Direction (degrees)', i18n ) }
						value={ getAttribute( 'iconColorGradientDirection' ) }
						onChange={ updateAttributeHandler( 'iconColorGradientDirection' ) }
						min={ 0 }
						max={ 360 }
						step={ 10 }
						allowReset={ true }
					/>
				</Fragment>
			) }

			<ResponsiveControl2
				desktopProps={ {
					value: getAttribute( 'iconSize' ),
					onChange: updateAttributeHandler( 'iconSize' ),
				} }
				tabletProps={ {
					value: getAttribute( 'iconSizeTablet' ),
					onChange: updateAttributeHandler( 'iconSizeTablet' ),
				} }
				mobileProps={ {
					value: getAttribute( 'iconSizeMobile' ),
					onChange: updateAttributeHandler( 'iconSizeMobile' ),
				} }
			>
				<AdvancedRangeControl
					label={ sprintf( __( '%s Size', i18n ), label ) }
					min={ 0 }
					max={ 100 }
					step={ 1 }
					allowReset={ true }
				/>
			</ResponsiveControl2>

			<AdvancedRangeControl
				label={ sprintf( __( '%s Opacity', i18n ), label ) }
				value={ getAttribute( 'iconOpacity' ) }
				min={ 0 }
				max={ 1 }
				step={ 0.1 }
				onChange={ updateAttributeHandler( 'iconOpacity' ) }
				allowReset={ true }
				placeholder="1.0"
			/>

			<AdvancedRangeControl
				label={ sprintf( __( '%s Rotation', i18n ), label ) }
				value={ getAttribute( 'iconRotation' ) }
				min={ 0 }
				max={ 360 }
				onChange={ updateAttributeHandler( 'iconRotation' ) }
				allowReset={ true }
				placeholder="0"
			/>

			<AdvancedSelectControl
				label={ sprintf( __( '%s Position', i18n ), label ) }
				value={ getAttribute( 'iconPosition' ) }
				options={ [
					{ value: '', label: __( 'Left', i18n ) },
					{ value: 'right', label: __( 'Right', i18n ) },
				] }
				onChange={ updateAttributeHandler( 'iconPosition' ) }
			/>

			<AdvancedRangeControl
				label={ sprintf( __( '%s Gap', i18n ), label ) }
				value={ getAttribute( 'iconGap' ) }
				min={ 0 }
				max={ 50 }
				onChange={ updateAttributeHandler( 'iconGap' ) }
				allowReset={ true }
				placeholder="0"
			/>

			<ToggleControl
				label={ __( 'Shaped', i18n ) }
				checked={ getNormalAttribute( 'shaped' ) }
				onChange={ updateNormalAttributeHandler( 'shaped' ) }
			/>

			{ getNormalAttribute( 'shaped' ) && (
				<Fragment>

					<ToggleControl
						label={ __( 'No Shape Color', i18n ) }
						checked={ getAttribute( 'noShapeColor' ) }
						onChange={ updateAttributeHandler( 'noShapeColor' ) }
					/>

					{ ! getAttribute( 'noShapeColor' ) && (
						<ColorPaletteControl
							label={ __( 'Shape Color', i18n ) }
							value={ getAttribute( 'shapeColor' ) }
							onChange={ updateAttributeHandler( 'shapeColor' ) }
						/>
					) }

					<AdvancedRangeControl
						label={ __( 'Shape Border Radius', i18n ) }
						value={ getAttribute( 'shapeBorderRadius' ) }
						onChange={ updateAttributeHandler( 'shapeBorderRadius' ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder={ 50 }
					/>

					<AdvancedRangeControl
						label={ __( 'Shape Padding', i18n ) }
						value={ getAttribute( 'shapePadding' ) }
						onChange={ updateAttributeHandler( 'shapePadding' ) }
						min={ 0 }
						max={ 150 }
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
								value={ getAttribute( 'shapeOutlineColor' ) }
								onChange={ updateAttributeHandler( 'shapeOutlineColor' ) }
							/>

							<SpacingControl
								label={ __( 'Shape Outline Width' ) }
								units={ [ 'px' ] }
								min={ 0 }
								max={ 99 }
								step={ 1 }
								sliderMax={ 5 }
								defaultLocked={ true }

								valueDesktop={ {
									top: getAttribute( 'shapeOutlineWidthTop' ),
									right: getAttribute( 'shapeOutlineWidthRight' ),
									bottom: getAttribute( 'shapeOutlineWidthBottom' ),
									left: getAttribute( 'shapeOutlineWidthLeft' ),
								} }
								onChangeDesktop={
									( {
										top, right, bottom, left,
									} ) => {
										const attributes = {
											ShapeOutlineWidthTop: ! top && top !== 0 ? '' : parseInt( top, 10 ),
											ShapeOutlineWidthRight: ! right && right !== 0 ? '' : parseInt( right, 10 ),
											ShapeOutlineWidthBottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
											ShapeOutlineWidthLeft: ! left && left !== 0 ? '' : parseInt( left, 10 ),
										}
										updateAttributes( attributes )
									}
								}

								valueTablet={ {
									top: getAttribute( 'shapeOutlineWidthTopTablet' ),
									right: getAttribute( 'shapeOutlineWidthRightTablet' ),
									bottom: getAttribute( 'shapeOutlineWidthBottomTablet' ),
									left: getAttribute( 'shapeOutlineWidthLeftTablet' ),
								} }
								onChangeTablet={
									( {
										top, right, bottom, left,
									} ) => {
										updateAttributes( {
											ShapeOutlineWidthTopTablet: ! top && top !== 0 ? '' : parseInt( top, 10 ),
											ShapeOutlineWidthRightTablet: ! right && right !== 0 ? '' : parseInt( right, 10 ),
											ShapeOutlineWidthBottomTablet: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
											ShapeOutlineWidthLeftTablet: ! left && left !== 0 ? '' : parseInt( left, 10 ),
										} )
									}
								}

								valueMobile={ {
									top: getAttribute( 'shapeOutlineWidthTopMobile' ),
									right: getAttribute( 'shapeOutlineWidthRightMobile' ),
									bottom: getAttribute( 'shapeOutlineWidthBottomMobile' ),
									left: getAttribute( 'shapeOutlineWidthLeftMobile' ),
								} }
								onChangeMobile={
									( {
										top, right, bottom, left,
									} ) => {
										updateAttributes( {
											ShapeOutlineWidthTopMobile: ! top && top !== 0 ? '' : parseInt( top, 10 ),
											ShapeOutlineWidthRightMobile: ! right && right !== 0 ? '' : parseInt( right, 10 ),
											ShapeOutlineWidthBottomMobile: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
											ShapeOutlineWidthLeftMobile: ! left && left !== 0 ? '' : parseInt( left, 10 ),
										} )
									}
								}

								placeholder="1"
								placeholderTop="1"
								placeholderLeft="1"
								placeholderBottom="1"
								placeholderRight="1"
							/>
						</Fragment>
					) }

				</Fragment>
			) }

			<ToggleControl
				label={ __( 'Background Shape', i18n ) }
				checked={ getNormalAttribute( 'showBackgroundShape' ) }
				onChange={ updateNormalAttributeHandler( 'showBackgroundShape' ) }
			/>

			{ getNormalAttribute( 'showBackgroundShape' ) && (
				<Fragment>

					{ enableBackgroundShapeIcon && (
						<ImageShapeControl
							label={ __( 'Shape', i18n ) }
							selected={ getAttribute( 'backgroundShape' ) }
							onChange={ updateAttributeHandler( 'backgroundShape' ) }
						/>
					) }

					<ColorPaletteControl
						label={ __( 'Shape Color', i18n ) }
						value={ getAttribute( 'backgroundShapeColor' ) }
						onChange={ updateAttributeHandler( 'backgroundShapeColor' ) }
					/>

					<AdvancedRangeControl
						label={ __( 'Shape Opacity', i18n ) }
						value={ getAttribute( 'backgroundShapeOpacity' ) }
						onChange={ updateAttributeHandler( 'backgroundShapeOpacity' ) }
						min={ 0 }
						max={ 1 }
						step={ 0.1 }
						placeholder="1"
						allowReset={ true }
					/>

					<AdvancedRangeControl
						label={ __( 'Shape Size', i18n ) }
						value={ getAttribute( 'backgroundShapeSize' ) }
						onChange={ updateAttributeHandler( 'backgroundShapeSize' ) }
						min={ 0 }
						max={ 3 }
						step={ 0.1 }
						placeholder="1"
						allowReset={ true }
					/>

					<AdvancedRangeControl
						label={ __( 'Horizontal Offset', i18n ) }
						value={ getAttribute( 'backgroundShapeOffsetHorizontal' ) }
						onChange={ updateAttributeHandler( 'backgroundShapeOffsetHorizontal' ) }
						min={ -30 }
						max={ 30 }
						step={ 1 }
						placeholder="0"
						allowReset={ true }
					/>

					<AdvancedRangeControl
						label={ __( 'Vertical Offset', i18n ) }
						value={ getAttribute( 'backgroundShapeOffsetVertical' ) }
						onChange={ updateAttributeHandler( 'backgroundShapeOffsetVertical' ) }
						min={ -30 }
						max={ 30 }
						step={ 1 }
						placeholder="0"
						allowReset={ true }
					/>

				</Fragment>
			) }

		</Fragment>
	)
}

IconControls.defaultProps = {
	label: __( 'Icon', i18n ),
}

export const Edit = props => {
	const {
		attrNameTemplate = '%s',
		withHoverTab = false,
		hoverAttrNameTemplate = '%s',
		hasToggle = true,
		checked,
		onChange,
	} = props

	const [ selectedTab, setSelectedTab ] = useState( 'normal' )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Icon', i18n ) }
				id="icon"
				hasToggle={ hasToggle }
				checked={ checked }
				onChange={ onChange }
			>
				{ withHoverTab && (
					<TabbedLayout
						options={ [
							{
								label: __( 'Normal', i18n ),
								value: 'normal',
							},
							{
								label: __( 'Hover', i18n ),
								value: 'hover',
							},
						] }
						value={ selectedTab }
						onChange={ setSelectedTab }
					/>
				) }

				{ selectedTab === 'normal' && (
					<IconControls
						attrNameTemplate={ attrNameTemplate }
					/>
				) }

				{ selectedTab === 'hover' && (
					<IconControls
						enableIcon={ false }
						enableBackgroundShapeIcon={ false }
						attrNameTemplate={ hoverAttrNameTemplate }
						normalAttrNameTemplate={ attrNameTemplate }
					/>
				) }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
