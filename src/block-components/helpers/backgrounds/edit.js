/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	AdvancedSelectControl,
	BlendModeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ControlSeparator,
	ImageControl,
	ResponsiveControl2,
	AdvancedToggleControl,
} from '~stackable/components'
import {
	useAttributeEditHandlers, useDeviceType,
} from '~stackable/hooks'
import { urlIsVideo } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useCallback, Fragment } from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'

// TODO: Post v3, add option to select the image size for the background (full, large, medium)
export const BackgroundControls = props => {
	const deviceType = useDeviceType()

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const hasBackgroundMedia = getAttribute( 'backgroundMediaURL' ) || getAttribute( 'backgroundMediaURLTablet' ) || getAttribute( 'backgroundMediaURLMobile' )
	const isBackgroundVideo = useCallback( () => {
		return [ getAttribute( 'backgroundMediaURL' ), getAttribute( 'backgroundMediaURLTablet' ), getAttribute( 'backgroundMediaURLMobile' ) ]
			.filter( value => value )
			.filter( urlIsVideo )
			.length > 0
	}, [ getAttribute( 'backgroundMediaURL' ), getAttribute( 'backgroundMediaURLTablet' ), getAttribute( 'backgroundMediaURLMobile' ) ] )

	return (
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
				value={ getAttribute( 'backgroundColorType' ) }
				onChange={ updateAttributeHandler( 'backgroundColorType' ) }
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
				onChange={ updateAttributeHandler( 'backgroundColor' ) }
				hasTransparent={ true }
			/>
			{ getAttribute( 'backgroundColorType' ) !== 'gradient' &&
				( ! getAttribute( 'backgroundMediaURL' ) && ! getAttribute( 'backgroundMediaURLTablet' ) && ! getAttribute( 'backgroundMediaURLMobile' ) ) && (
				<AdvancedRangeControl
					label={ __( 'Background Color Opacity', i18n ) }
					value={ getAttribute( 'backgroundColorOpacity' ) }
					onChange={ updateAttributeHandler( 'backgroundColorOpacity' ) }
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
					onChange={ updateAttributeHandler( 'backgroundColor2' ) }
				/>
			) }
			{ getAttribute( 'backgroundColorType' ) === 'gradient' && (
				<ButtonIconPopoverControl
					label={ __( 'Adv. Gradient Color Settings', i18n ) }
					onReset={ () => {
						updateAttributes( {
							backgroundGradientDirection: '',
							backgroundGradientBlendMode: '',
							backgroundGradientLocation1: '',
							backgroundGradientLocation2: '',
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
						onChange={ updateAttributeHandler( 'backgroundGradientDirection' ) }
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
						onChange={ updateAttributeHandler( 'backgroundGradientLocation1' ) }
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
						onChange={ updateAttributeHandler( 'backgroundGradientLocation2' ) }
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
						onChange={ updateAttributeHandler( 'backgroundGradientBlendMode' ) }
						className="ugb--help-tip-background-blend-mode"
					/>
				</ButtonIconPopoverControl>
			) }

			{ getAttribute( 'backgroundColorType' ) === 'gradient' &&
				<ControlSeparator />
			}

			<ResponsiveControl2
				desktopProps={ {
					onRemove: () => {
						updateAttributes( {
							backgroundMediaId: '',
							backgroundMediaURL: '',
						} )
					},
					onChange: ( { url, id } ) => {
						updateAttributes( {
							backgroundMediaId: id,
							backgroundMediaURL: url,
						} )
					},
					imageID: getAttribute( 'backgroundMediaId' ),
					imageURL: getAttribute( 'backgroundMediaURL' ),
				} }
				tabletProps={ {
					onRemove: () => {
						updateAttributes( {
							backgroundMediaIdTablet: '',
							backgroundMediaURLTablet: '',
						} )
					},
					onChange: ( { url, id } ) => {
						updateAttributes( {
							backgroundMediaIdTablet: id,
							backgroundMediaURLTablet: url,
						} )
					},
					imageID: getAttribute( 'backgroundMediaIdTablet' ),
					imageURL: getAttribute( 'backgroundMediaURLTablet' ),
				} }
				mobileProps={ {
					onRemove: () => {
						updateAttributes( {
							backgroundMediaIdMobile: '',
							backgroundMediaURLMobile: '',
						} )
					},
					onChange: ( { url, id } ) => {
						updateAttributes( {
							backgroundMediaIdMobile: id,
							backgroundMediaURLMobile: url,
						} )
					},
					imageID: getAttribute( 'backgroundMediaIdMobile' ),
					imageURL: getAttribute( 'backgroundMediaURLMobile' ),
				} }
			>
				<ImageControl
					label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
					help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
					allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
				/>
			</ResponsiveControl2>

			{ hasBackgroundMedia &&
				<AdvancedRangeControl
					label={ __( 'Background Media Tint Strength', i18n ) }
					value={ getAttribute( 'backgroundTintStrength' ) }
					onChange={ value => {
						const noValue = typeof value === 'undefined' || value === ''
						// If the tint is changed, but on background color yet, make it black. Fixes #136.
						if ( getAttribute( 'backgroundColor' ) === '' && ! noValue ) {
							updateAttributes( {
								backgroundTintStrength: value,
								backgroundColor: '#000000',
							} )
						// If the tint is reset, and the background is black (was set earlier), remove it.
						} else if ( getAttribute( 'backgroundColor' ) === '#000000' && noValue ) {
							updateAttributes( {
								backgroundTintStrength: value,
								backgroundColor: '',
							} )
						} else {
							updateAttributes( {
								backgroundTintStrength: value,
								backgroundColor: getAttribute( 'backgroundColor' ),
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
				<AdvancedToggleControl
					label={ __( 'Fixed Background', i18n ) }
					checked={ getAttribute( 'fixedBackground' ) }
					onChange={ updateAttributeHandler( 'fixedBackground' ) }
					className="ugb--help-tip-background-fixed"
				/>
			}

			{ hasBackgroundMedia &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Background Image Settings', i18n ) }
					onReset={ () => {
						updateAttributes( {
							BackgroundPosition: '',
							BackgroundPositionTablet: '',
							BackgroundPositionMobile: '',
							BackgroundRepeat: '',
							BackgroundRepeatTablet: '',
							BackgroundRepeatMobile: '',
							BackgroundSize: '',
							BackgroundSizeTablet: '',
							BackgroundSizeMobile: '',
							BackgroundCustomSize: '',
							BackgroundCustomSizeTablet: '',
							BackgroundCustomSizeMobile: '',
							BackgroundCustomSizeUnit: '%',
							BackgroundCustomSizeUnitTablet: '%',
							BackgroundCustomSizeUnitMobile: '%',
							BackgroundImageBlendMode: '',
						} )
					} }
					allowReset={
						getAttribute( 'backgroundPosition' ) || getAttribute( 'BackgroundPositionTablet' ) || getAttribute( 'BackgroundPositionMobile' ) ||
						getAttribute( 'backgroundRepeat' ) || getAttribute( 'BackgroundRepeatTablet' ) || getAttribute( 'BackgroundRepeatMobile' ) ||
						getAttribute( 'backgroundSize' ) || getAttribute( 'BackgroundSizeTablet' ) || getAttribute( 'BackgroundSizeMobile' ) ||
						getAttribute( 'backgroundImageBlendMode' )
					}
				>

					<ResponsiveControl2
						desktopProps={ {
							value: getAttribute( 'backgroundPosition' ),
							onChange: updateAttributeHandler( 'BackgroundPosition' ),
						} }
						tabletProps={ {
							value: getAttribute( 'BackgroundPositionTablet' ),
							onChange: updateAttributeHandler( 'BackgroundPositionTablet' ),
						} }
						mobileProps={ {
							value: getAttribute( 'BackgroundPositionMobile' ),
							onChange: updateAttributeHandler( 'BackgroundPositionMobile' ),
						} }
					>
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
							className="ugb--help-tip-background-image-position"
						/>
					</ResponsiveControl2>

					<ResponsiveControl2
						desktopProps={ {
							value: getAttribute( 'backgroundRepeat' ),
							onChange: updateAttributeHandler( 'BackgroundRepeat' ),
						} }
						tabletProps={ {
							value: getAttribute( 'BackgroundRepeatTablet' ),
							onChange: updateAttributeHandler( 'BackgroundRepeatTablet' ),
						} }
						mobileProps={ {
							value: getAttribute( 'BackgroundRepeatMobile' ),
							onChange: updateAttributeHandler( 'BackgroundRepeatMobile' ),
						} }
					>
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
								{ label: __( 'Repeat', i18n ), value: 'repeat' },
								{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
							] }
							className="ugb--help-tip-background-image-repeat"
						/>
					</ResponsiveControl2>

					<ResponsiveControl2
						desktopProps={ {
							value: getAttribute( 'backgroundSize' ),
							onChange: updateAttributeHandler( 'BackgroundSize' ),
						} }
						tabletProps={ {
							value: getAttribute( 'BackgroundSizeTablet' ),
							onChange: updateAttributeHandler( 'BackgroundSizeTablet' ),
						} }
						mobileProps={ {
							value: getAttribute( 'BackgroundSizeMobile' ),
							onChange: updateAttributeHandler( 'BackgroundSizeMobile' ),
						} }
					>
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Auto', i18n ), value: 'auto' },
								{ label: __( 'Cover', i18n ), value: 'cover' },
								{ label: __( 'Contain', i18n ), value: 'contain' },
								{ label: __( 'Custom', i18n ), value: 'custom' },
							] }
							className="ugb--help-tip-background-image-size"
						/>
					</ResponsiveControl2>

					{ getAttribute( 'backgroundSize' ) === 'custom' && deviceType === 'Desktop' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							screens="all"
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
							unit={ getAttribute( 'backgroundCustomSizeUnit' ) }
							onChangeUnit={ updateAttributeHandler( 'BackgroundCustomSizeUnit' ) }
							value={ getAttribute( 'backgroundCustomSize' ) }
							onChange={ updateAttributeHandler( 'BackgroundCustomSize' ) }
							allowReset={ true }
						/>
					}
					{ getAttribute( 'BackgroundSizeTablet' ) === 'custom' && deviceType === 'Tablet' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							screens="all"
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
							unit={ getAttribute( 'BackgroundCustomSizeUnitTablet' ) }
							onChangeUnit={ updateAttributeHandler( 'BackgroundCustomSizeUnitTablet' ) }
							value={ getAttribute( 'BackgroundCustomSizeTablet' ) }
							onChange={ updateAttributeHandler( 'BackgroundCustomSizeTablet' ) }
							allowReset={ true }
						/>
					}
					{ getAttribute( 'BackgroundSizeMobile' ) === 'custom' && deviceType === 'Mobile' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							screens="all"
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
							unit={ getAttribute( 'BackgroundCustomSizeUnitMobile' ) }
							onChangeUnit={ updateAttributeHandler( 'BackgroundCustomSizeUnitMobile' ) }
							value={ getAttribute( 'BackgroundCustomSizeMobile' ) }
							onChange={ updateAttributeHandler( 'BackgroundCustomSizeMobile' ) }
							allowReset={ true }
						/>
					}

					{ updateAttributeHandler( 'BackgroundImageBlendMode' ) && (
						<BlendModeControl
							label={ __( 'Image Blend Mode', i18n ) }
							value={ getAttribute( 'backgroundImageBlendMode' ) }
							onChange={ updateAttributeHandler( 'BackgroundImageBlendMode' ) }
						/>
					) }
				</ButtonIconPopoverControl>
			}
		</Fragment>
	)
}

BackgroundControls.defaultProps = {
	attrNameTemplate: '%s',
	backgroundMediaAllowVideo: true,
}
