import {
	BaseControl,
	Button,
	ButtonGroup,
	RangeControl,
	ToggleControl,
} from '@wordpress/components'
import { ColorPaletteControl, PanelColorSettings } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import ImageControl from '../image-control'

function PanelBackgroundSettings( props ) {
	const {
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		onChangeBackgroundColorType,
		onChangeBackgroundColor, // = () => {},
		onChangeBackgroundColor2,
		onChangeBackgroundColorDirection,
		onChangeBackgroundType,
		onChangeBackgroundImage, // = ( { url, id } ) => {},
		onRemoveBackgroundImage, // = () => {},
		onChangeBackgroundOpacity, // = () => {},
		onChangeFixedBackground,
	} = props

	return (
		<Fragment>
			<PanelColorSettings
				initialOpen={ false }
				title={ __( 'Background Settings', i18n ) }
				className="editor-panel-color-settings"
				{ ...props }
			>
				{ applyFilters( 'stackable.panel-background-settings.before', null, props ) }
				{ onChangeBackgroundColorType && (
					<BaseControl
						label={ __( 'Background Color Type', i18n ) }
					>
						<ButtonGroup
							aria-label={ __( 'Image Size', i18n ) }
						>
							<Button
								isPrimary={ backgroundColorType === '' }
								isDefault={ backgroundColorType !== '' }
								onClick={ () => {
									onChangeBackgroundColorType( '' )
								} }
							>
								{ __( 'Single', i18n ) }
							</Button>
							<Button
								isPrimary={ backgroundColorType === 'gradient' }
								isDefault={ backgroundColorType !== 'gradient' }
								onClick={ () => {
									onChangeBackgroundColorType( 'gradient' )
								} }
							>
								{ __( 'Gradient', i18n ) }
							</Button>
						</ButtonGroup>
					</BaseControl>
				) }
				{ onChangeBackgroundColor && (
					<ColorPaletteControl
						label={
							onChangeBackgroundColor2 && backgroundColorType === 'gradient' ?
								__( 'Background Color #1', i18n ) :
								__( 'Background Color', i18n )
						}
						value={ backgroundColor }
						onChange={ onChangeBackgroundColor }
					/>
				) }
				{ onChangeBackgroundColor2 && backgroundColorType === 'gradient' && (
					<ColorPaletteControl
						label={ __( 'Background Color #2', i18n ) }
						value={ backgroundColor2 }
						onChange={ onChangeBackgroundColor2 }
					/>
				) }
				{ onChangeBackgroundColorDirection && backgroundColorType === 'gradient' && (
					<RangeControl
						label={ __( 'Gradient Direction (degrees)', i18n ) }
						value={ backgroundColorDirection }
						onChange={ onChangeBackgroundColorDirection }
						min={ 0 }
						max={ 360 }
						step={ 10 }
					/>
				) }
				{ onChangeBackgroundImage && (
					<ImageControl
						label={ __( 'Background Image or Video', i18n ) }
						help={ __( 'Use .mp4 format for videos', i18n ) }
						onRemove={ media => {
							if ( onChangeBackgroundType ) {
								onChangeBackgroundType( '' )
							}
							onRemoveBackgroundImage( media )
						} }
						onChange={ media => {
							if ( onChangeBackgroundType ) {
								onChangeBackgroundType( media.url.match( /(mp4|webm|ogg)/i ) ? 'video' : '' )
							}
							onChangeBackgroundImage( media )
						} }
						imageID={ backgroundImageID }
						imageURL={ backgroundImageURL }
						allowedTypes={ onChangeBackgroundType ? [ 'image', 'video' ] : [ 'image' ] }
					/>
				) }
				{ onChangeBackgroundOpacity && (
					<RangeControl
						label={ __( 'Background Media Tint Strength', i18n ) }
						value={ backgroundOpacity }
						onChange={ onChangeBackgroundOpacity }
						min={ 0 }
						max={ 10 }
						step={ 1 }
					/>
				) }
				{ onChangeFixedBackground && backgroundType !== 'video' && (
					<ToggleControl
						label={ __( 'Fixed Background', i18n ) }
						checked={ fixedBackground }
						onChange={ onChangeFixedBackground }
					/>
				) }
				{ applyFilters( 'stackable.panel-background-settings.after', null, props ) }
			</PanelColorSettings>
		</Fragment>
	)
}

export default PanelBackgroundSettings
