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
} from '~stackable/components'
import {
	createVideoBackground, getVideoProviderFromURL, hasBackgroundOverlay, urlIsVideo,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import {
	getPlayButton, playButtonTypes, showOptions,
} from './util'
import {
	withBlockStyles, withGoogleFont, withSetAttributeHook, withTabbedInspector, withUniqueClass,
} from '~stackable/higher-order'
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'

import {
	PanelBody, RangeControl, SelectControl, TextControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'

addFilter( 'stackable.video-popup.edit.inspector.style.before', 'stackable/video-popup', ( output, props ) => {
	const { setAttributes } = props
	const {
		borderRadius = 12,
		shadow = 3,
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
			<PanelBody title={ __( 'General', i18n ) }>
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
			</PanelBody>

			<PanelBody title={ __( 'Container', i18n ) } initialOpen={ false }>
				{ show.containerWidth &&
					<Fragment>
						<WhenResponsiveScreen screen="desktop">
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) }
								value={ width }
								min="200"
								max="2000"
								allowReset={ true }
								onChange={ width => props.setAttributes( { width } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) }
								value={ tabletWidth }
								min="200"
								max="1000"
								allowReset={ true }
								onChange={ tabletWidth => props.setAttributes( { tabletWidth } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) }
								value={ mobileWidth }
								min="200"
								max="700"
								allowReset={ true }
								onChange={ mobileWidth => props.setAttributes( { mobileWidth } ) }
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
						min={ 100 }
						max={ 1000 }
						allowReset={ true }
					/>
				</ResponsiveControl>
				{ show.borderRadius &&
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ ( borderRadius = 12 ) => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
					/>
				}
				<RangeControl
					label={ __( 'Shadow / Outline', i18n ) }
					value={ shadow }
					onChange={ ( shadow = 3 ) => setAttributes( { shadow } ) }
					min={ 0 }
					max={ 9 }
					allowReset={ true }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Background', i18n ) } initialOpen={ false }>
				<BackgroundControlsHelper
					attrNameTemplate="preview%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Play Button', i18n ) } initialOpen={ false }>
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
					/>
				</ResponsiveControl>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					value={ playButtonColor }
					onChange={ playButtonColor => setAttributes( { playButtonColor } ) }
				/>
				<RangeControl
					label={ __( 'Opacity', i18n ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					value={ playButtonOpacity }
					onChange={ playButtonOpacity => setAttributes( { playButtonOpacity } ) }
					allowReset={ true }
				/>
			</PanelBody>

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
		shadow = 3,
		previewBackgroundTintStrength = 5,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup--v3',
	], applyFilters( 'stackable.video-popup.mainclasses', {
	}, props ) )

	const boxClasses = classnames( [
		'ugb-video-popup__wrapper',
		`ugb--shadow-${ shadow }`,
	], applyFilters( 'stackable.video-popup.boxclasses', {
		'ugb--has-background-overlay': hasBackgroundOverlay( 'preview%s', props.attributes ),
		[ `ugb--background-opacity-${ previewBackgroundTintStrength }` ]: hasBackgroundOverlay( 'preview%s', props.attributes ),
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className={ boxClasses }>
					<span className="ugb-video-popup__play-button">
						{ getPlayButton( playButtonType ) }
					</span>
					{ createVideoBackground( 'preview%s', props ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector( [ 'style', 'advanced' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
