/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	BackgroundControlsHelper,
	BlockContainer,
	ColorPaletteControl,
	ImageControl,
	PanelSpacingBody,
	ResponsiveControl,
	WhenResponsiveScreen,
	DivBackground,
	PanelAdvancedSettings,
	ButtonIconPopoverControl,
} from '~stackable/components'
import {
	getVideoProviderFromURL,
	urlIsVideo,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import {
	getPlayButton, playButtonTypes, showOptions,
} from './util'
import {
	withBlockStyles,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
	withClickOpenInspector,
} from '~stackable/higher-order'
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'

import {
	SelectControl, TextControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'

addFilter( 'stackable.video-popup.edit.inspector.style.before', 'stackable/video-popup', ( output, props ) => {
	const { setAttributes } = props
	const {
		borderRadius = '',
		shadow = '',
		videoLink = '',
		videoID = '',
		playButtonType,
		playButtonColor = '#ffffff',
		playButtonOpacity = '',
		width = '',
		tabletWidth = '',
		mobileWidth = '',
		showBlockTitle = false,
		showBlockDescription = false,
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<ImageControl
					label={ __( 'Popup Option #1: Upload Video', i18n ) }
					help={ __( 'Use .mp4 format for videos', i18n ) }
					onRemove={ () => setAttributes( {
						videoLink: '',
						videoID: '',
					} ) }
					onChange={ media => {
						setAttributes( {
							videoLink: media.url,
							videoID: media.url,
						} )
					} }
					imageID={ urlIsVideo( videoLink ) ? videoID : '' }
					imageURL={ urlIsVideo( videoLink ) ? videoLink : '' }
					allowedTypes={ [ 'video' ] }
				/>
				<TextControl
					label={ __( 'Popup Option #2: Video URL', i18n ) }
					help={ __( 'Paste a Youtube / Vimeo URL', i18n ) }
					placeholder="https://"
					value={ ! urlIsVideo( videoLink ) ? videoLink : '' }
					onChange={ videoLink => setAttributes( {
						videoLink,
						videoID: getVideoProviderFromURL( videoLink ).id,
					} ) }
					min={ 1 }
					max={ 4 }
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Container', i18n ) }
				initialOpen={ false }
			>
				<ButtonIconPopoverControl
					label={ __( 'Background', i18n ) }
					popoverLabel={ __( 'Background', i18n ) }
					onReset={ () => {
						setAttributes( {
							previewBackgroundColorType: '',
							previewBackgroundColor: '',
							previewBackgroundColor2: '',
							previewBackgroundColorOpacity: '',
							previewBackgroundMediaID: '',
							previewBackgroundMediaUrl: '',
							previewBackgroundTintStrength: '',
							previewFixedBackground: '',
						} )
					} }
					allowReset={ props.attributes.previewBackgroundColor || props.attributes.previewBackgroundMediaUrl }
					hasColorPreview={ props.attributes.previewBackgroundColor }
					hasImagePreview={ props.attributes.previewBackgroundMediaUrl }
					colorPreview={ props.attributes.previewBackgroundColorType === 'gradient' ? [ props.attributes.previewBackgroundColor, props.attributes.previewBackgroundColor2 ] : props.attributes.previewBackgroundColor }
					imageUrlPreview={ props.attributes.previewBackgroundMediaUrl }
				>
					<BackgroundControlsHelper
						attrNameTemplate="preview%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</ButtonIconPopoverControl>
				{ show.containerWidth &&
					<Fragment>
						<WhenResponsiveScreen screen="desktop">
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) }
								value={ width }
								min="200"
								max="2000"
								placeholder="2000"
								allowReset={ true }
								onChange={ width => props.setAttributes( { width } ) }
								className="ugb--help-tip-video-popup-width"
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) }
								value={ tabletWidth }
								min="200"
								max="1000"
								placeholder="1000"
								allowReset={ true }
								onChange={ tabletWidth => props.setAttributes( { tabletWidth } ) }
								className="ugb--help-tip-video-popup-width"
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) }
								value={ mobileWidth }
								min="200"
								max="700"
								placeholder="700"
								allowReset={ true }
								onChange={ mobileWidth => props.setAttributes( { mobileWidth } ) }
								className="ugb--help-tip-video-popup-width"
							/>
						</WhenResponsiveScreen>
					</Fragment>
				}
				<ResponsiveControl
					attrNameTemplate="%sHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						min={ 0 }
						max={ 1000 }
						allowReset={ true }
						placeholder="400"
						className="ugb--help-tip-video-popup-height"
					/>
				</ResponsiveControl>
				{ show.borderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
				}
				<AdvancedRangeControl
					label={ __( 'Shadow / Outline', i18n ) }
					value={ shadow }
					onChange={ shadow => setAttributes( { shadow } ) }
					min={ 0 }
					max={ 9 }
					allowReset={ true }
					placeholder="3"
					className="ugb--help-tip-general-shadow"
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Play Button', i18n ) }
				id="play-button"
				initialOpen={ false }
			>
				<SelectControl
					label={ __( 'Button Style', i18n ) }
					value={ playButtonType }
					options={ playButtonTypes.map( ( { value, label } ) => ( {
						value,
						label,
					} ) ) }
					onChange={ newSize => {
						setAttributes( { playButtonType: newSize } )
					} }
				/>
				<ResponsiveControl
					attrNameTemplate="%sPlayButtonSize"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						min={ 10 }
						max={ 200 }
						allowReset={ true }
						placeholder="40"
					/>
				</ResponsiveControl>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					value={ playButtonColor }
					onChange={ playButtonColor => setAttributes( { playButtonColor } ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Opacity', i18n ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					value={ playButtonOpacity }
					onChange={ playButtonOpacity => setAttributes( { playButtonOpacity } ) }
					allowReset={ true }
					placeholder="1.0"
				/>
			</PanelAdvancedSettings>

			{ ( showBlockTitle || showBlockDescription ) &&
				<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				</PanelSpacingBody>
			}
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
	} = props
	const {
		playButtonType,
		shadow = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup--v3',
	], applyFilters( 'stackable.video-popup.mainclasses', {
	}, props ) )

	const boxClasses = classnames( [
		'ugb-video-popup__wrapper',
	], applyFilters( 'stackable.video-popup.boxclasses', {
		[ `ugb--shadow-${ shadow }` ]: shadow !== '',
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ boxClasses }
					backgroundAttrName="preview%s"
					blockProps={ props }
				>
					<span className="ugb-video-popup__play-button">
						{ getPlayButton( playButtonType ) }
					</span>
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-video-popup__wrapper', 'background' ],
		[ '.ugb-video-popup__play-button svg', 'play-button' ],
	] ),
)( edit )
