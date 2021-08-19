/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AdvancedSelectControl,
	BlendModeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ControlSeparator,
	AdvancedToggleControl,
	AdvancedRangeControl,
	ImageControl2,
} from '~stackable/components'
import {
	useAttributeEditHandlers, useDeviceType,
} from '~stackable/hooks'
import { getAttributeName, urlIsVideo } from '~stackable/util'

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
		getAttributes,
		updateAttributes,
		getAttrName,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const hasBackgroundMedia = getAttribute( 'backgroundMediaUrl' ) || getAttribute( 'backgroundMediaUrlTablet' ) || getAttribute( 'backgroundMediaUrlMobile' )
	const isBackgroundVideo = useCallback( () => {
		return [ getAttribute( 'backgroundMediaUrl' ), getAttribute( 'backgroundMediaUrlTablet' ), getAttribute( 'backgroundMediaUrlMobile' ) ]
			.filter( value => value )
			.filter( urlIsVideo )
			.length > 0
	}, [ getAttribute( 'backgroundMediaUrl' ), getAttribute( 'backgroundMediaUrlTablet' ), getAttribute( 'backgroundMediaUrlMobile' ) ] )

	return (
		<Fragment>
			{ props.hasGradient &&
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
					attribute={ getAttrName( 'backgroundColorType' ) }
					fullwidth={ false }
					isSmall={ true }
				/>
			}
			<ColorPaletteControl
				label={
					getAttribute( 'backgroundColorType' ) === 'gradient'
						? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Background Color', i18n ), 1 )
						: __( 'Background Color', i18n )
				}
				attribute={ getAttrName( 'backgroundColor' ) }
				hasTransparent={ true }
				hover={ getAttribute( 'backgroundColorType' ) !== 'gradient' ? 'all' : false }
			/>
			{ getAttribute( 'backgroundColorType' ) !== 'gradient' &&
				( ! getAttribute( 'backgroundMediaUrl' ) && ! getAttribute( 'backgroundMediaUrlTablet' ) && ! getAttribute( 'backgroundMediaUrlMobile' ) ) && (
				<AdvancedRangeControl
					label={ __( 'Background Color Opacity', i18n ) }
					attribute={ getAttrName( 'backgroundColorOpacity' ) }
					hover="all"
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
					attribute={ getAttrName( 'backgroundColor2' ) }
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
						attribute={ getAttrName( 'backgroundGradientDirection' ) }
						min={ 0 }
						max={ 360 }
						step={ 10 }
						allowReset={ true }
						placeholder="90"
						className="ugb--help-tip-gradient-direction"
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 1 ) }
						attribute={ getAttrName( 'backgroundGradientLocation1' ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
						className="ugb--help-tip-gradient-location"
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 2 ) }
						attribute={ getAttrName( 'backgroundGradientLocation2' ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="100"
						className="ugb--help-tip-gradient-location"
					/>

					{ props.hasBackgroundGradientBlendMode &&
						<BlendModeControl
							label={ __( 'Background Gradient Blend Mode', i18n ) }
							attribute={ getAttrName( 'backgroundGradientBlendMode' ) }
							className="ugb--help-tip-background-blend-mode"
						/>
					}
				</ButtonIconPopoverControl>
			) }

			{ getAttribute( 'backgroundColorType' ) === 'gradient' &&
				<ControlSeparator />
			}

			{ props.hasBackgroundImage &&
				<ImageControl2
					label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
					help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
					allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
					attribute={ getAttrName( 'backgroundMedia' ) }
					responsive="all"
				/>
			}

			{ hasBackgroundMedia &&
				<AdvancedRangeControl
					label={ __( 'Background Media Tint Strength', i18n ) }
					attribute={ getAttrName( 'backgroundTintStrength' ) }
					hover="all"
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
					attribute={ getAttrName( 'fixedBackground' ) }
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

					<AdvancedSelectControl
						label={ __( 'Image Position', i18n ) }
						attribute={ getAttrName( 'backgroundPosition' ) }
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
						responsive="all"
					/>

					<AdvancedSelectControl
						label={ __( 'Image Repeat', i18n ) }
						attribute={ getAttrName( 'backgroundRepeat' ) }
						options={ [
							{ label: __( 'Default', i18n ), value: '' },
							{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
							{ label: __( 'Repeat', i18n ), value: 'repeat' },
							{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
							{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
						] }
						className="ugb--help-tip-background-image-repeat"
						responsive="all"
					/>

					<AdvancedSelectControl
						label={ __( 'Image Size', i18n ) }
						attribute={ getAttrName( 'backgroundSize' ) }
						options={ [
							{ label: __( 'Default', i18n ), value: '' },
							{ label: __( 'Auto', i18n ), value: 'auto' },
							{ label: __( 'Cover', i18n ), value: 'cover' },
							{ label: __( 'Contain', i18n ), value: 'contain' },
							{ label: __( 'Custom', i18n ), value: 'custom' },
						] }
						className="ugb--help-tip-background-image-size"
						responsive="all"
					/>

					{ getAttributes()[ getAttributeName( getAttrName( 'backgroundSize' ), deviceType ) ] === 'custom' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							attribute={ getAttrName( 'backgroundCustomSize' ) }
							responsive="all"
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
						/>
					}

					<BlendModeControl
						label={ __( 'Image Blend Mode', i18n ) }
						attribute={ getAttrName( 'backgroundImageBlendMode' ) }
					/>
				</ButtonIconPopoverControl>
			}
		</Fragment>
	)
}

BackgroundControls.defaultProps = {
	attrNameTemplate: '%s',
	backgroundMediaAllowVideo: true,
	hasGradient: true,
	hasBackgroundImage: true,
	hasBackgroundGradientBlendMode: true,
}
