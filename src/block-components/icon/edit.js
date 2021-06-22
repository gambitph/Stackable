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
	AdvancedRangeControl2,
	FourRangeControl2,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useBlockAttributes,
	useBlockHoverState,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	ToggleControl,
} from '@wordpress/components'
import { useCallback, Fragment } from '@wordpress/element'
import { useDispatch } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

const IconControls = props => {
	const {
		enableGradient = true,
		enableShape = true,
		enableBackgroundShape = true,
	} = props

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const [ state ] = useBlockHoverState()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const setAttributes = useCallback( attrs => {
		updateBlockAttributes( clientId, attrs )
	}, [ clientId ] )

	return (
		<Fragment>
			<IconControl
				label={ __( 'Icon', i18n ) }
				value={ attributes[ getAttributeName( 'icon' ) ] }
				onChange={ value => setAttributes( { [ getAttributeName( 'icon' ) ]: value } ) }
			/>

			{ enableGradient && (
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
						hover="all"
					/>

					<ColorPaletteControl
						label={ attributes[ getAttributeName( 'iconColorType', 'desktop', state ) ] === 'gradient' ? sprintf( __( 'Icon Color #%s', i18n ), 1 )
							: __( 'Icon Color', i18n ) }
						attribute="iconColor1"
						hover="all"
					/>
					{ attributes[ getAttributeName( 'iconColorType', 'desktop', state ) ] === 'gradient' && (
						<Fragment>
							<ColorPaletteControl
								label={ sprintf( __( 'Icon Color #%s', i18n ), 2 ) }
								attribute="iconColor2"
								hover="all"
							/>

							<AdvancedRangeControl2
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

			{ ! enableGradient && (
				<ColorPaletteControl
					label={ __( 'Icon Color', i18n ) }
					attribute="iconColor1"
					hover="all"
				/>
			) }

			<AdvancedRangeControl2
				label={ __( 'Icon Size', i18n ) }
				attribute="iconSize"
				min={ 0 }
				max={ 100 }
				step={ 1 }
				allowReset={ true }
				hover="all"
			/>

			<AdvancedRangeControl2
				label={ __( 'Icon Opacity', i18n ) }
				attribute="iconOpacity"
				min={ 0 }
				max={ 1 }
				step={ 0.1 }
				allowReset={ true }
				placeholder="1.0"
				hover="all"
			/>

			<AdvancedRangeControl2
				label={ __( 'Icon Rotation', i18n ) }
				attribute="iconRotation"
				min={ 0 }
				max={ 360 }
				allowReset={ true }
				placeholder="0"
				hover="all"
			/>

			<AdvancedSelectControl
				label={ __( 'Icon Position', i18n ) }
				attribute="iconPosition"
				options={ [
					{ value: '', label: __( 'Left', i18n ) },
					{ value: 'right', label: __( 'Right', i18n ) },
				] }
			/>

			<AdvancedRangeControl2
				label={ __( 'Icon Gap', i18n ) }
				attribute="iconGap"
				min={ 0 }
				max={ 50 }
				allowReset={ true }
				placeholder="0"
				hover="all"
			/>

			{ enableShape && (
				<Fragment>
					<ToggleControl
						label={ __( 'Shaped', i18n ) }
						checked={ attributes[ getAttributeName( 'shaped' ) ] }
						onChange={ value => setAttributes( { [ getAttributeName( 'shaped' ) ]: value } ) }
					/>

					{ attributes[ getAttributeName( 'shaped' ) ] && (
						<Fragment>

							<ColorPaletteControl
								label={ __( 'Shape Color', i18n ) }
								attribute="shapeColor"
								hover="all"
								hasTransparent={ true }
							/>

							<AdvancedRangeControl2
								label={ __( 'Shape Border Radius', i18n ) }
								attribute="shapeBorderRadius"
								hover="all"
								min={ 0 }
								max={ 100 }
								step={ 1 }
								allowReset={ true }
								placeholder={ 50 }
							/>

							<AdvancedRangeControl2
								label={ __( 'Shape Padding', i18n ) }
								attribute="shapePadding"
								hover="all"
								min={ 0 }
								max={ 150 }
								step={ 1 }
								allowReset={ true }
								placeholder={ 20 }
							/>

							<ToggleControl
								label={ __( 'Shape Outline', i18n ) }
								checked={ attributes[ getAttributeName( 'shapeOutline', 'desktop', state ) ] }
								onChange={ value => setAttributes( { [ getAttributeName( 'shapeOutline', 'desktop', state ) ]: value } ) }
							/>

							{ attributes[ getAttributeName( 'shapeOutline', 'desktop', state ) ] && (
								<Fragment>

									<ColorPaletteControl
										label={ __( 'Shape Outline Color', i18n ) }
										attribute="shapeOutlineColor"
										hover="all"
									/>

									<FourRangeControl2
										label={ __( 'Shape Outline Width' ) }
										units={ [ 'px' ] }
										min={ 0 }
										max={ 99 }
										step={ 1 }
										sliderMax={ 5 }
										defaultLocked={ true }
										attribute={ 'shapeOutLineWidth' }
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

			{ enableBackgroundShape && (
				<Fragment>
					<ToggleControl
						label={ __( 'Background Shape', i18n ) }
						checked={ attributes[ getAttributeName( 'showBackgroundShape' ) ] }
						onChange={ value => setAttributes( { [ getAttributeName( 'showBackgroundShape' ) ]: value } ) }
					/>

					{ attributes[ getAttributeName( 'showBackgroundShape' ) ] && (
						<Fragment>

							<ImageShapeControl
								label={ __( 'Shape', i18n ) }
								selected={ attributes[ getAttributeName( 'backgroundShape' ) ] }
								onChange={ value => setAttributes( { [ getAttributeName( 'backgroundShape' ) ]: value } ) }
							/>

							<ColorPaletteControl
								label={ __( 'Shape Color', i18n ) }
								attribute="backgroundShapeColor"
								hover="all"
							/>

							<AdvancedRangeControl2
								label={ __( 'Shape Opacity', i18n ) }
								attribute="backgroundShapeOpacity"
								hover="all"
								min={ 0 }
								max={ 1 }
								step={ 0.1 }
								placeholder="1"
								allowReset={ true }
							/>

							<AdvancedRangeControl2
								label={ __( 'Shape Size', i18n ) }
								attribute="backgroundShapeSize"
								hover="all"
								min={ 0 }
								max={ 3 }
								step={ 0.1 }
								placeholder="1"
								allowReset={ true }
							/>

							<AdvancedRangeControl2
								label={ __( 'Horizontal Offset', i18n ) }
								attribute="backgroundShapeOffsetHorizontal"
								hover="all"
								min={ -30 }
								max={ 30 }
								step={ 1 }
								placeholder="0"
								allowReset={ true }
							/>

							<AdvancedRangeControl2
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
		</Fragment>
	)
}

IconControls.defaultProps = {
	label: __( 'Icon', i18n ),
}

export const Edit = props => {
	const {
		enableGradient = true,
		enableShape = true,
		enableBackgroundShape = true,
	} = props

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Icon', i18n ) }
				id="icon"
			>

				<IconControls
					enableGradient={ enableGradient }
					enableShape={ enableShape }
					enableBackgroundShape={ enableBackgroundShape }
				/>

			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
