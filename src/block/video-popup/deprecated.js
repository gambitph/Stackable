/**
 * Internal dependencies
 */
import { getPlayButton as getPlayButton_1_15_6 } from './deprecated/util_1_15_6'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'

const deprecatedSave_1_15_6 = props => {
	const { className } = props
	const {
		videoID,
		playButtonType,
		playButtonColor = '#ffffff',
		backgroundImageURL,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
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
	], applyFilters( 'stackable.video-popup.mainclasses_1_15_6', {
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
		<div className={ mainClasses } style={ mainStyle } data-video={ videoID }>
			{ backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.video-popup.save.output.before_1_15_6', null, design, props ) }
			<div className="ugb-video-popup__wrapper" >
				{ /* eslint-disable-next-line */ }
				<a href="#" className="ugb-video-popup__overlay" />
				<span className="ugb-video-popup__play-button">
					{ getPlayButton_1_15_6( playButtonType, playButtonColor ) }
				</span>
			</div>
		</div>
	)
}

const deprecatedSchema_1_15_6 = {
	videoLink: {
		type: 'string',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: 'div',
		attribute: 'data-video',
	},
	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	playButtonColor: {
		type: 'string',
		default: '#ffffff',
	},
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	backgroundColor2: {
		type: 'string',
		default: '',
	},
	backgroundColorDirection: {
		type: 'number',
		default: 0,
	},
	backgroundType: {
		type: 'string',
		default: '',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	align: {
		type: 'string',
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	overlayColor: {
		type: 'string',
	},
	mediaLink: {
		type: 'string',
	},
	mediaID: {
		type: 'number',
	},
}

const deprecatedSchema_1_11 = {
	videoLink: {
		type: 'string',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: 'div',
		attribute: 'data-video',
	},
	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	playButtonColor: {
		type: 'string',
		default: '#ffffff',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	align: {
		type: 'string',
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	overlayColor: {
		type: 'string',
	},
	mediaLink: {
		type: 'string',
	},
	mediaID: {
		type: 'number',
	},
}

const deprecatedSave_1_11 = props => {
	const { className } = props
	const {
		videoID,
		playButtonType,
		playButtonColor = '#ffffff',
		backgroundImageURL,
		backgroundColor,
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
	], {
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	const playButton = {
		normal: style => <svg style={ style } xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 320"><path d="M0 0v320l256-160L0 0z" /></svg>,
		circle: style => <svg style={ style } xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40"><path d="M16 29l12-9-12-9v18zm4-29C8.95 0 0 8.95 0 20s8.95 20 20 20 20-8.95 20-20S31.05 0 20 0zm0 36c-8.82 0-16-7.18-16-16S11.18 4 20 4s16 7.18 16 16-7.18 16-16 16z" /></svg>,
		outline: style => <svg style={ style } xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 34 34"><path d="M17 34C7.6 34 0 26.4 0 17S7.6 0 17 0s17 7.6 17 17-7.6 17-17 17zm0-32C8.7 2 2 8.7 2 17s6.7 15 15 15 15-6.7 15-15S25.3 2 17 2z" /><path d="M12 25.7V8.3L27 17l-15 8.7zm2-14v10.5l9-5.3-9-5.2z" /></svg>,
	}

	const getPlayButton = ( name, fill = null ) => {
		return playButton[ name ]( { fill } )
	}

	return (
		<div className={ mainClasses } style={ mainStyle } data-video={ videoID }>
			<div className="ugb-video-popup__wrapper" >
				{ /* eslint-disable-next-line */ }
				<a href="#" className="ugb-video-popup__overlay" />
				<span className="ugb-video-popup__play-button">
					{ getPlayButton( playButtonType, playButtonColor ) }
				</span>
			</div>
		</div>
	)
}

const deprecatedSchema_1_10 = {
	videoLink: {
		type: 'string',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: 'div',
		attribute: 'data-video',
	},
	playButtonType: {
		type: 'string',
		default: 'normal',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	overlayColor: {
		type: 'string',
	},
	mediaLink: {
		type: 'string',
	},
	mediaID: {
		type: 'number',
	},
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		videoID,
		playButtonType,
		backgroundImageURL,
		backgroundColor,
		backgroundOpacity,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle } data-video={ videoID }>
			<div className="ugb-video-wrapper" >
				{ /* eslint-disable-next-line */ }
				<a href="#" />
				<span className="ugb-play-button">
					{ getPlayButton_1_15_6( playButtonType ) }
				</span>
			</div>
		</div>
	)
}

export const deprecatedSave_1_5 = props => {
	const { className } = props
	const {
		videoLink,
		videoID,
		mediaLink,
		overlayColor,
		playButtonType,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup',
	] )

	return (
		<div className={ mainClasses }
			data-video={ videoID }
			data-video-url={ videoLink }
			style={ { backgroundColor: overlayColor } }>
			<div className="ugb-video-preview"
				style={ { backgroundImage: `url(${ mediaLink })` } }
				data-url={ mediaLink }>
			</div>
			<div className="ugb-video-wrapper" >
				{ /* eslint-disable-next-line */ }
				<a href="#" style={ { backgroundColor: overlayColor } } />
				<span className="ugb-play-button">
					{ playButton[ playButtonType ] }
				</span>
			</div>
		</div>
	)
}

export const deprecatedSchema_1_5 = {
	videoLink: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-video-popup',
		attribute: 'data-video-url',
	},
	videoID: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-video-popup',
		attribute: 'data-video',
	},
	mediaLink: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-video-preview',
		attribute: 'data-url',
	},
	mediaID: {
		type: 'number',
	},
	overlayColor: {
		type: 'string',
		default: '#000000',
	},
	playButtonType: {
		type: 'string',
		default: 'normal',
	},
}

export const deprecatedSchema_1_2_1 = {
	videoLink: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-video-popup',
		attribute: 'data-video',
	},
	mediaLink: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-video-preview',
		attribute: 'data-url',
	},
	mediaID: {
		type: 'number',
	},
	overlayColor: {
		type: 'string',
		default: '#000000',
	},
	playButtonType: {
		type: 'string',
		default: 'normal',
	},
}

const playButton = {
	normal: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 320"><path d="M0 0v320l256-160L0 0z" /></svg>,
	circle: <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40"><path d="M16 29l12-9-12-9v18zm4-29C8.95 0 0 8.95 0 20s8.95 20 20 20 20-8.95 20-20S31.05 0 20 0zm0 36c-8.82 0-16-7.18-16-16S11.18 4 20 4s16 7.18 16 16-7.18 16-16 16z" /></svg>,
	outline: <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 34 34"><path d="M17 34C7.6 34 0 26.4 0 17S7.6 0 17 0s17 7.6 17 17-7.6 17-17 17zm0-32C8.7 2 2 8.7 2 17s6.7 15 15 15 15-6.7 15-15S25.3 2 17 2z" /><path d="M12 25.7V8.3L27 17l-15 8.7zm2-14v10.5l9-5.3-9-5.2z" /></svg>,
}

export const deprecatedSave_1_2_1 = props => {
	const {
		videoLink,
		mediaLink,
		overlayColor,
		playButtonType,
	} = props.attributes

	return (
		<div className="ugb-video-popup"
			data-video={ videoLink }
			style={ { backgroundColor: overlayColor } }>
			<div className="ugb-video-preview"
				style={ { backgroundImage: `url(${ mediaLink })` } }
				data-url={ mediaLink }>
			</div>
			<div className="ugb-video-wrapper" >
				{ /* eslint-disable-next-line */ }
				<a href="#" style={ { backgroundColor: overlayColor } } />
				<span className="ugb-play-button">
					{ playButton[ playButtonType ] }
				</span>
			</div>
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15_6,
		save: deprecatedSave_1_15_6,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' ).replace( /\.ugb-video-popup([\s\{\[\.\#\:])/g, '.ugb-video-popup__wrapper$1' )

			return {
				...attributes,
				previewBackgroundColorType: attributes.backgroundColorType,
				previewBackgroundColor: attributes.backgroundColor,
				previewBackgroundColor2: attributes.backgroundColor2,
				previewBackgroundGradientDirection: attributes.backgroundColorDirection,
				previewBackgroundMediaId: attributes.backgroundImageID,
				previewBackgroundMediaUrl: attributes.backgroundImageURL,
				previewBackgroundTintStrength: attributes.backgroundOpacity,
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				// Full-width blocks before had 0 margin-top and margin-bottom.
				marginTop: attributes.align === 'full' ? 0 : undefined,
				marginBottom: attributes.align === 'full' ? 0 : undefined,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_11,
		save: deprecatedSave_1_11,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				align: 'center',
				playButtonColor: '#ffffff',
				design: 'basic',
				borderRadius: 12,
				shadow: 3,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_5,
		save: deprecatedSave_1_5,
		migrate: attributes => {
			return omit( {
				...attributes,
				backgroundOpacity: 5,
				backgroundColor: attributes.overlayColor,
				backgroundImageID: attributes.mediaID,
				backgroundImageURL: attributes.mediaLink,
			}, [
				'overlayColor', 'mediaID', 'mediaLink',
			] )
		},
	},
	{
		attributes: deprecatedSchema_1_2_1,
		migrate: attributes => {
			attributes.videoID = attributes.videoLink
			return attributes
		},
		save: deprecatedSave_1_2_1,
	},
]

export default deprecated
