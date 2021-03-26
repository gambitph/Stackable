/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { camelCase, upperFirst } from 'lodash'
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	AdvancedSelectControl,
	BlendModeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ControlSeparator,
	ImageControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { BaseControl, ToggleControl } from '@wordpress/components'
import { useBlockAttributes, useDeviceType } from '~stackable/hooks'
import { urlIsVideo } from '~stackable/util'

// TODO: Post v3, add option to select the image size for the background (full, large, medium)
export const Edit = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const deviceType = useDeviceType()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, upperFirst( attrName ) ) )
	const getAttribute = attrName => attributes[ getAttrName( attrName ) ]
	const updateAttributes = attrName => value => updateBlockAttributes( clientId, { [ getAttrName( attrName ) ]: value } )

	const hasBackgroundMedia = getAttribute( 'backgroundMediaURL' ) || getAttribute( 'backgroundMediaURLTablet' ) || getAttribute( 'backgroundMediaURLMobile' )
	const isBackgroundVideo = useCallback( () => {
		return [ getAttribute( 'backgroundMediaURL' ), getAttribute( 'backgroundMediaURLTablet' ), getAttribute( 'backgroundMediaURLMobile' ) ]
			.filter( value => value )
			.filter( urlIsVideo )
			.length > 0
	}, [ getAttribute( 'backgroundMediaURL' ), getAttribute( 'backgroundMediaURLTablet' ), getAttribute( 'backgroundMediaURLMobile' ) ] )

	return (
		<BaseControl
			id="ugb-background-color-type"
			className="ugb--help-tip-background-color-type"
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
				value={ getAttribute( 'backgroundColorType' ) }
				onChange={ updateAttributes( 'backgroundColorType' ) }
				fullwidth={ false }
				isSmall={ true }
			/>
			<ColorPaletteControl
				label={
					getAttribute( 'backgroundColorType' ) === 'gradient'
						? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Background Color', i18n ), 1 )
						: __( 'Background Color', i18n )
				}
				value={ getAttribute( 'backgroundColor' ) }
				onChange={ updateAttributes( 'backgroundColor' ) }
			/>
			{ getAttribute( 'backgroundColorType' ) !== 'gradient' &&
				( ! getAttribute( 'backgroundMediaURL' ) && ! getAttribute( 'backgroundMediaURLTablet' ) && ! getAttribute( 'backgroundMediaURLMobile' ) ) && (
				<AdvancedRangeControl
					label={ __( 'Background Color Opacity', i18n ) }
					value={ getAttribute( 'backgroundColorOpacity' ) }
					onChange={ updateAttributes( 'onChangeBackgroundColorOpacity' ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1.0"
					className="ugb--help-tip-background-color-opacity"
				/>
			) }
			{ getAttribute( 'backgroundColorType' ) === 'gradient' && (
				<ColorPaletteControl
					label={ sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Background Color', i18n ), 2 ) }
					value={ getAttribute( 'backgroundColor2' ) }
					onChange={ updateAttributes( 'backgroundColor2' ) }
				/>
			) }
			{ getAttribute( 'backgroundColorType' ) === 'gradient' && (
				<ButtonIconPopoverControl
					label={ __( 'Adv. Gradient Color Settings', i18n ) }
					onReset={ () => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundGradientDirection' ) ]: '',
							[ getAttrName( 'backgroundGradientBlendMode' ) ]: '',
							[ getAttrName( 'backgroundGradientLocation1' ) ]: '',
							[ getAttrName( 'backgroundGradientLocation2' ) ]: '',
						} )
					} }
					allowReset={
						( getAttribute( 'backgroundGradientDirection' ) !== '' && getAttribute( 'backgroundGradientDirection' ) !== 90 ) ||
						( getAttribute( 'backgroundGradientLocation1' ) !== '' && getAttribute( 'backgroundGradientLocation1' ) !== 0 ) ||
						( getAttribute( 'backgroundGradientLocation2' ) !== '' && getAttribute( 'backgroundGradientLocation2' ) !== 100 ) ||
						getAttribute( 'backgroundGradientBlendMode' )
					}
				>
					<AdvancedRangeControl
						label={ __( 'Gradient Direction (degrees)', i18n ) }
						value={ getAttribute( 'backgroundGradientDirection' ) }
						onChange={ updateAttributes( 'backgroundGradientDirection' ) }
						min={ 0 }
						max={ 360 }
						step={ 10 }
						allowReset={ true }
						placeholder="90"
						className="ugb--help-tip-gradient-direction"
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 1 ) }
						value={ getAttribute( 'backgroundGradientLocation1' ) }
						onChange={ updateAttributes( 'backgroundGradientLocation1' ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
						className="ugb--help-tip-gradient-location"
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 2 ) }
						value={ getAttribute( 'backgroundGradientLocation2' ) }
						onChange={ updateAttributes( 'backgroundGradientLocation2' ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="100"
						className="ugb--help-tip-gradient-location"
					/>

					<BlendModeControl
						label={ __( 'Background Gradient Blend Mode', i18n ) }
						value={ getAttribute( 'backgroundGradientBlendMode' ) }
						onChange={ updateAttributes( 'backgroundGradientBlendMode' ) }
						className="ugb--help-tip-background-blend-mode"
					/>
				</ButtonIconPopoverControl>
			) }

			{ getAttribute( 'backgroundColorType' ) === 'gradient' &&
				<ControlSeparator />
			}

			{ deviceType === 'Desktop' &&
				<ImageControl
					label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
					help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
					onRemove={ () => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundMediaId' ) ]: '',
							[ getAttrName( 'backgroundMediaURL' ) ]: '',
						} )
					} }
					onChange={ ( { url, id } ) => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundMediaId' ) ]: id,
							[ getAttrName( 'backgroundMediaURL' ) ]: url,
						} )
					} }
					imageID={ getAttribute( 'backgroundMediaId' ) }
					imageURL={ getAttribute( 'backgroundMediaURL' ) }
					allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
				/>
			}
			{ deviceType === 'Tablet' &&
				<ImageControl
					label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
					help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
					onRemove={ () => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundMediaIdTablet' ) ]: '',
							[ getAttrName( 'backgroundMediaURLTablet' ) ]: '',
						} )
					} }
					onChange={ ( { url, id } ) => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundMediaIdTablet' ) ]: id,
							[ getAttrName( 'backgroundMediaURLTablet' ) ]: url,
						} )
					} }
					imageID={ getAttribute( 'backgroundMediaIdTablet' ) }
					imageURL={ getAttribute( 'backgroundMediaURLTablet' ) }
					allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
				/>
			}
			{ deviceType === 'Mobile' &&
				<ImageControl
					label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
					help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
					onRemove={ () => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundMediaIdMobile' ) ]: '',
							[ getAttrName( 'backgroundMediaURLMobile' ) ]: '',
						} )
					} }
					onChange={ ( { url, id } ) => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'backgroundMediaIdMobile' ) ]: id,
							[ getAttrName( 'backgroundMediaURLMobile' ) ]: url,
						} )
					} }
					imageID={ getAttribute( 'backgroundMediaIdMobile' ) }
					imageURL={ getAttribute( 'backgroundMediaURLMobile' ) }
					allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
				/>
			}

			{ hasBackgroundMedia &&
				<AdvancedRangeControl
					label={ __( 'Background Media Tint Strength', i18n ) }
					value={ getAttribute( 'backgroundTintStrength' ) }
					onChange={ value => {
						const noValue = typeof value === 'undefined' || value === ''
						// If the tint is changed, but on background color yet, make it black. Fixes #136.
						if ( getAttribute( 'backgroundColor' ) === '' && ! noValue ) {
							updateBlockAttributes( clientId, {
								[ getAttrName( 'backgroundTintStrength' ) ]: value,
								[ getAttrName( 'backgroundColor' ) ]: '#000000',
							} )
						// If the tint is reset, and the background is black (was set earlier), remove it.
						} else if ( getAttribute( 'backgroundColor' ) === '#000000' && noValue ) {
							updateBlockAttributes( clientId, {
								[ getAttrName( 'backgroundTintStrength' ) ]: value,
								[ getAttrName( 'backgroundColor' ) ]: '',
							} )
						} else {
							updateBlockAttributes( clientId, {
								[ getAttrName( 'backgroundTintStrength' ) ]: value,
								[ getAttrName( 'backgroundColor' ) ]: getAttribute( 'backgroundColor' ),
							} )
						}
					} }
					min={ 0 }
					max={ 10 }
					step={ 1 }
					allowReset={ true }
					placeholder={ getAttribute( 'backgroundColor' ) ? '5' : '0' }
					className="ugb--help-tip-background-tint"
				/>
			}

			{ hasBackgroundMedia && ! isBackgroundVideo() &&
				<ToggleControl
					label={ __( 'Fixed Background', i18n ) }
					checked={ getAttribute( 'fixedBackground' ) }
					onChange={ updateAttributes( 'fixedBackground' ) }
					className="ugb--help-tip-background-fixed"
				/>
			}

			{ hasBackgroundMedia &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Background Image Settings', i18n ) }
					onReset={ () => {
						updateBlockAttributes( clientId, {
							[ getAttrName( 'BackgroundPosition' ) ]: '',
							[ getAttrName( 'BackgroundPositionTablet' ) ]: '',
							[ getAttrName( 'BackgroundPositionMobile' ) ]: '',
							[ getAttrName( 'BackgroundRepeat' ) ]: '',
							[ getAttrName( 'BackgroundRepeatTablet' ) ]: '',
							[ getAttrName( 'BackgroundRepeatMobile' ) ]: '',
							[ getAttrName( 'BackgroundSize' ) ]: '',
							[ getAttrName( 'BackgroundSizeTablet' ) ]: '',
							[ getAttrName( 'BackgroundSizeMobile' ) ]: '',
							[ getAttrName( 'BackgroundCustomSize' ) ]: '',
							[ getAttrName( 'BackgroundCustomSizeTablet' ) ]: '',
							[ getAttrName( 'BackgroundCustomSizeMobile' ) ]: '',
							[ getAttrName( 'BackgroundCustomSizeUnit' ) ]: '%',
							[ getAttrName( 'BackgroundCustomSizeUnitTablet' ) ]: '%',
							[ getAttrName( 'BackgroundCustomSizeUnitMobile' ) ]: '%',
							[ getAttrName( 'BackgroundImageBlendMode' ) ]: '',
						} )
					} }
					allowReset={
						getAttribute( 'backgroundPosition' ) || getAttribute( 'BackgroundPositionTablet' ) || getAttribute( 'BackgroundPositionMobile' ) ||
						getAttribute( 'backgroundRepeat' ) || getAttribute( 'BackgroundRepeatTablet' ) || getAttribute( 'BackgroundRepeatMobile' ) ||
						getAttribute( 'backgroundSize' ) || getAttribute( 'BackgroundSizeTablet' ) || getAttribute( 'BackgroundSizeMobile' ) ||
						getAttribute( 'backgroundImageBlendMode' )
					}
				>

					{ deviceType === 'Desktop' &&
						<AdvancedSelectControl
							label={ __( 'Image Position', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Top Left', i18n ), value: 'top left' },
								{ label: __( 'Top Center', i18n ), value: 'top center' },
								{ label: __( 'Top Right', i18n ), value: 'top right' },
								{ label: __( 'Center Left', i18n ), value: 'center left' },
								{ label: __( 'Center Center', i18n ), value: 'center center' },
								{ label: __( 'Center Right', i18n ), value: 'center right' },
								{ label: __( 'Bottom Left', i18n ), value: 'bottom left' },
								{ label: __( 'Bottom Center', i18n ), value: 'bottom center' },
								{ label: __( 'Bottom Right', i18n ), value: 'bottom right' },
							] }
							value={ getAttribute( 'backgroundPosition' ) }
							onChange={ updateAttributes( 'BackgroundPosition' ) }
							className="ugb--help-tip-background-image-position"
						/>
					}
					{ deviceType === 'Tablet' &&
						<AdvancedSelectControl
							label={ __( 'Image Position', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Top Left', i18n ), value: 'top left' },
								{ label: __( 'Top Center', i18n ), value: 'top center' },
								{ label: __( 'Top Right', i18n ), value: 'top right' },
								{ label: __( 'Center Left', i18n ), value: 'center left' },
								{ label: __( 'Center Center', i18n ), value: 'center center' },
								{ label: __( 'Center Right', i18n ), value: 'center right' },
								{ label: __( 'Bottom Left', i18n ), value: 'bottom left' },
								{ label: __( 'Bottom Center', i18n ), value: 'bottom center' },
								{ label: __( 'Bottom Right', i18n ), value: 'bottom right' },
							] }
							value={ getAttribute( 'BackgroundPositionTablet' ) }
							onChange={ updateAttributes( 'BackgroundPositionTablet' ) }
							className="ugb--help-tip-background-image-position"
						/>
					}
					{ deviceType === 'Mobile' &&
						<AdvancedSelectControl
							label={ __( 'Image Position', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Top Left', i18n ), value: 'top left' },
								{ label: __( 'Top Center', i18n ), value: 'top center' },
								{ label: __( 'Top Right', i18n ), value: 'top right' },
								{ label: __( 'Center Left', i18n ), value: 'center left' },
								{ label: __( 'Center Center', i18n ), value: 'center center' },
								{ label: __( 'Center Right', i18n ), value: 'center right' },
								{ label: __( 'Bottom Left', i18n ), value: 'bottom left' },
								{ label: __( 'Bottom Center', i18n ), value: 'bottom center' },
								{ label: __( 'Bottom Right', i18n ), value: 'bottom right' },
							] }
							value={ getAttribute( 'BackgroundPositionMobile' ) }
							onChange={ updateAttributes( 'BackgroundPositionMobile' ) }
							className="ugb--help-tip-background-image-position"
						/>
					}

					{ deviceType === 'Desktop' &&
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
								{ label: __( 'Repeat', i18n ), value: 'repeat' },
								{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
							] }
							value={ getAttribute( 'backgroundRepeat' ) }
							onChange={ updateAttributes( 'BackgroundRepeat' ) }
							className="ugb--help-tip-background-image-repeat"
						/>
					}
					{ deviceType === 'Tablet' &&
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
								{ label: __( 'Repeat', i18n ), value: 'repeat' },
								{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
							] }
							value={ getAttribute( 'BackgroundRepeatTablet' ) }
							onChange={ updateAttributes( 'BackgroundRepeatTablet' ) }
							className="ugb--help-tip-background-image-repeat"
						/>
					}
					{ deviceType === 'Mobile' &&
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
								{ label: __( 'Repeat', i18n ), value: 'repeat' },
								{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
							] }
							value={ getAttribute( 'BackgroundRepeatMobile' ) }
							onChange={ updateAttributes( 'BackgroundRepeatMobile' ) }
							className="ugb--help-tip-background-image-repeat"
						/>
					}

					{ deviceType === 'Desktop' &&
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Auto', i18n ), value: 'auto' },
								{ label: __( 'Cover', i18n ), value: 'cover' },
								{ label: __( 'Contain', i18n ), value: 'contain' },
								{ label: __( 'Custom', i18n ), value: 'custom' },
							] }
							value={ getAttribute( 'backgroundSize' ) }
							onChange={ updateAttributes( 'BackgroundSize' ) }
							className="ugb--help-tip-background-image-size"
						/>
					}
					{ deviceType === 'Tablet' &&
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Auto', i18n ), value: 'auto' },
								{ label: __( 'Cover', i18n ), value: 'cover' },
								{ label: __( 'Contain', i18n ), value: 'contain' },
								{ label: __( 'Custom', i18n ), value: 'custom' },
							] }
							value={ getAttribute( 'BackgroundSizeTablet' ) }
							onChange={ updateAttributes( 'BackgroundSizeTablet' ) }
							className="ugb--help-tip-background-image-size"
						/>
					}
					{ deviceType === 'Mobile' &&
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Auto', i18n ), value: 'auto' },
								{ label: __( 'Cover', i18n ), value: 'cover' },
								{ label: __( 'Contain', i18n ), value: 'contain' },
								{ label: __( 'Custom', i18n ), value: 'custom' },
							] }
							value={ getAttribute( 'BackgroundSizeMobile' ) }
							onChange={ updateAttributes( 'BackgroundSizeMobile' ) }
							className="ugb--help-tip-background-image-size"
						/>
					}

					{ getAttribute( 'backgroundSize' ) === 'custom' && deviceType === 'Desktop' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
							unit={ getAttribute( 'backgroundCustomSizeUnit' ) }
							onChangeUnit={ updateAttributes( 'BackgroundCustomSizeUnit' ) }
							value={ getAttribute( 'backgroundCustomSize' ) }
							onChange={ updateAttributes( 'BackgroundCustomSize' ) }
							allowReset={ true }
						/>
					}
					{ getAttribute( 'BackgroundSizeTablet' ) === 'custom' && deviceType === 'Tablet' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
							unit={ getAttribute( 'BackgroundCustomSizeUnitTablet' ) }
							onChangeUnit={ updateAttributes( 'BackgroundCustomSizeUnitTablet' ) }
							value={ getAttribute( 'BackgroundCustomSizeTablet' ) }
							onChange={ updateAttributes( 'BackgroundCustomSizeTablet' ) }
							allowReset={ true }
						/>
					}
					{ getAttribute( 'BackgroundSizeMobile' ) === 'custom' && deviceType === 'Mobile' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
							unit={ getAttribute( 'BackgroundCustomSizeUnitMobile' ) }
							onChangeUnit={ updateAttributes( 'BackgroundCustomSizeUnitMobile' ) }
							value={ getAttribute( 'BackgroundCustomSizeMobile' ) }
							onChange={ updateAttributes( 'BackgroundCustomSizeMobile' ) }
							allowReset={ true }
						/>
					}

					{ updateAttributes( 'BackgroundImageBlendMode' ) && (
						<BlendModeControl
							label={ __( 'Image Blend Mode', i18n ) }
							value={ getAttribute( 'backgroundImageBlendMode' ) }
							onChange={ updateAttributes( 'BackgroundImageBlendMode' ) }
						/>
					) }
				</ButtonIconPopoverControl>
			}
		</BaseControl>
	)
}

Edit.defaultProps = {
	attrNameTemplate: '%s',
	backgroundMediaAllowVideo: true,
}
