import {
	ColorPaletteControl, DesignPanelBody, PanelBackgroundSettings, ProControl, ProControlButton, URLInputControl,
} from '@stackable/components'
import { getPlayButton, playButtonTypes } from './util'
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import { getVideoProviderFromURL } from '@stackable/util'
import { InspectorControls } from '@wordpress/block-editor'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		className,
		setAttributes,
		isSelected,
	} = props
	const {
		videoLink,
		backgroundImageID,
		backgroundImageURL,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		playButtonType,
		playButtonColor = '#ffffff',
		backgroundOpacity,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup',
		'ugb-video-popup--v2',
		`ugb-video-popup--design-${ design }`,
		`ugb-video-popup--button-${ playButtonType }`,
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.video-popup.mainclasses', {
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<Fragment>
			<InspectorControls>
				<DesignPanelBody
					initialOpen={ true }
					selected={ design }
					options={ [ ...applyFilters( 'stackable.video-popup.edit.designs', [] ) ] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.video-popup.edit.designs.before', null, props ) }
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
					{ applyFilters( 'stackable.video-popup.edit.designs.after', null, props ) }
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings' ) }>
					<SelectControl
						label={ __( 'Play Button Style' ) }
						value={ playButtonType }
						options={ playButtonTypes.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ newSize => {
							setAttributes( { playButtonType: newSize } )
						} }
					/>
					<ColorPaletteControl
						label={ __( 'Play Button Color' ) }
						value={ playButtonColor }
						onChange={ playButtonColor => setAttributes( { playButtonColor } ) }
					/>
				</PanelBody>
				<PanelBackgroundSettings
					initialOpen={ true }
					backgroundColorType={ backgroundColorType }
					backgroundColor={ backgroundColor }
					backgroundColor2={ backgroundColor2 }
					backgroundColorDirection={ backgroundColorDirection }
					backgroundType={ backgroundType }
					backgroundImageID={ backgroundImageID }
					backgroundImageURL={ backgroundImageURL }
					backgroundOpacity={ backgroundOpacity }
					onChangeBackgroundColorType={ backgroundColorType => setAttributes( { backgroundColorType } ) }
					onChangeBackgroundColor={ backgroundColor => setAttributes( { backgroundColor } ) }
					onChangeBackgroundColor2={ backgroundColor2 => setAttributes( { backgroundColor2 } ) }
					onChangeBackgroundColorDirection={ backgroundColorDirection => setAttributes( { backgroundColorDirection } ) }
					onChangeBackgroundType={ backgroundType => setAttributes( { backgroundType } ) }
					onChangeBackgroundImage={ ( { url, id } ) => setAttributes( { backgroundImageURL: url, backgroundImageID: id } ) }
					onRemoveBackgroundImage={ () => {
						setAttributes( { backgroundImageURL: '', backgroundImageID: 0 } )
					} }
					onChangeBackgroundOpacity={ backgroundOpacity => setAttributes( { backgroundOpacity } ) }
				/>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.video-popup.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyle }>
				{ backgroundType === 'video' && (
					<video
						className="ugb-video-background"
						autoPlay
						muted
						loop
						src={ backgroundImageURL }
					/>
				) }
				{ applyFilters( 'stackable.video-popup.edit.output.before', null, design, props ) }
				<div className="ugb-video-popup__wrapper" >
					<span className="ugb-video-popup__play-button">
						{ getPlayButton( playButtonType, playButtonColor ) }
					</span>
				</div>
				{ applyFilters( 'stackable.video-popup.edit.output.after', null, design, props ) }
			</div>
			{ isSelected && (
				<div>
					<URLInputControl
						value={ videoLink }
						onChange={ value => {
							setAttributes( {
								videoLink: value,
								videoID: getVideoProviderFromURL( value ).id,
							} )
						} }
					/>
					<p className="ugb-video-popup__link-description"><i>{ __( 'Youtube / Vimeo only' ) }</i></p>
				</div>
			) }
		</Fragment>
	)
}

export default edit
