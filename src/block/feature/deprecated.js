/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_15_5,
} from '~stackable/components/button-edit'
import { descriptionPlaceholder } from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'
import striptags from 'striptags'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const deprecatedSchema_1_17_2 = {
	textColor: {
		type: 'string',
	},
	invert: {
		type: 'boolean',
		default: false,
	},
	contentAlign: {
		type: 'string',
		default: 'left',
	},
	imageSize: {
		type: 'number',
		default: 400,
	},
	imageID: {
		type: 'number',
	},
	imageUrl: {
		type: 'url',
	},
	imageAlt: {
		type: 'string',
	},
	title: {
		source: 'html',
		selector: 'h2',
		default: __( 'Title for This Block', i18n ),
	},
	description: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'medium' ),
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
		default: '',
	},
	buttonNewTab: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'target',
		default: false,
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: __( 'Button text', i18n ),
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonSize: {
		type: 'string',
		default: 'normal',
	},
	buttonBorderRadius: {
		type: 'number',
		default: 4,
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
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
	fixedBackground: {
		type: 'boolean',
		default: false,
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	design: {
		type: 'string',
		default: 'plain',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	align: {
		type: 'string',
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
}

const deprecatedSave_1_17_2 = props => {
	const {
		className,
	} = props

	const {
		invert,
		contentAlign,
		textColor,
		imageAlt = '',
		imageSize,
		imageUrl,
		title,
		description,
		buttonURL,
		buttonNewTab,
		buttonText,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonDesign,
		buttonIcon,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
		contentWidth,
		align,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-feature--design-${ design }`,
	], applyFilters( 'stackable.feature.mainclasses_1_17_2', {
		[ `ugb-feature--content-${ contentAlign }` ]: contentAlign,
		'ugb-feature--invert': invert,
		'ugb--has-background': design !== 'plain' && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' && backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--has-background-gradient` ]: design !== 'plain' && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: design !== 'plain' && backgroundType === 'video',
	}, design, props ) )

	const imageClasses = classnames( [
		'ugb-feature__image',
	], applyFilters( 'stackable.feature.imageclasses_1_17_2', {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	}, design, props ) )

	const backgroundStyles = design === 'plain' ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.feature.styles_1_17_2', {
		main: {
			'--image-size': imageSize ? `${ imageSize }px` : undefined,
			...backgroundStyles,
		},
		image: {
			borderRadius: design === 'plain' ? borderRadius : undefined,
		},
	}, design, props )

	const titleComp = ! RichText.isEmpty( title ) && (
		<RichText.Content
			tagName="h2"
			className="ugb-feature__title"
			style={ { color: textColor } }
			value={ title }
		/>
	)
	const descriptionComp = ! RichText.isEmpty( description ) && (
		<RichText.Content
			tagName="p"
			className="ugb-feature__description"
			style={ { color: textColor } }
			value={ description }
		/>
	)
	const buttonComp = ! RichText.isEmpty( buttonText ) && (
		<DeprecatedButtonContent_1_15_5
			size={ buttonSize }
			url={ buttonURL }
			newTab={ buttonNewTab }
			align={ contentAlign }
			color={ buttonTextColor }
			text={ buttonText }
			icon={ buttonIcon }
			design={ buttonDesign }
			backgroundColor={ buttonColor }
			borderRadius={ buttonBorderRadius }
		/>
	)
	const imageComp = imageUrl && (
		<img
			className={ imageClasses }
			style={ styles.image }
			src={ imageUrl }
			alt={ striptags( title ? title : imageAlt ) }
		/>
	)
	const comps = {
		titleComp,
		descriptionComp,
		buttonComp,
		imageComp,
	}

	return (
		<div className={ mainClasses } style={ styles.main }>
			{ design === 'basic' && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.feature.save.output.before_1_17_2', null, design, props ) }
			{ applyFilters( 'stackable.feature.save.output_1_17_2', (
				<div className="ugb-content-wrapper">
					<div className="ugb-feature__content">
						{ titleComp }
						{ descriptionComp }
						{ buttonComp }
					</div>
					<div className="ugb-feature__image-side">
						{ imageComp }
					</div>
				</div>
			), comps, props ) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_2,
		save: deprecatedSave_1_17_2,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /\n\.ugb-feature(\s*{)/g, '\n.ugb-feature__item$1' )

			const portDesigns = {
				overlap: 'overlap-bg',
				overlap2: 'overlap-bg2',
				overlap3: 'overlap-bg4',
			}

			return {
				...attributes,
				design: Object.keys( portDesigns ).includes( attributes.design ) ? portDesigns[ attributes.design ] : attributes.design,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				titleColor: attributes.textColor,
				descriptionColor: attributes.textColor,

				imageWidth: attributes.imageSize,
				imageId: attributes.imageID,
				imageUrl: attributes.imageUrl,

				buttonUrl: attributes.buttonURL,
				buttonNewTab: attributes.buttonNewTab,
				buttonBackgroundColor: attributes.buttonColor,

				columnBackgroundColorType: attributes.backgroundColorType,
				columnBackgroundColor: attributes.backgroundColor,
				columnBackgroundColor2: attributes.backgroundColor2,
				columnBackgroundGradientDirection: attributes.backgroundColorDirection,
				columnBackgroundMediaId: attributes.backgroundImageID,
				columnBackgroundMediaUrl: attributes.backgroundImageURL,
				columnBackgroundTintStrength: attributes.backgroundOpacity,
				columnFixedBackground: attributes.fixedBackground,

				// Full-width blocks before had 0 margin-top and margin-bottom.
				marginTop: attributes.align === 'full' ? 0 : undefined,
				marginBottom: attributes.align === 'full' ? 0 : undefined,
			}
		},
	},
]

export default deprecated
