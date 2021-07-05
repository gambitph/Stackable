/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_15_5,
} from '../../components/button-edit'
import { descriptionPlaceholder } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

export const deprecatedSave_1_15_5 = props => {
	const { className } = props
	const {
		url,
		buttonText,
		ctaTitle,
		bodyText,
		color,
		textColor,
		size,
		borderButtonRadius,
		bodyTextColor,
		titleColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		buttonDesign,
		buttonIcon,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		align,
		contentWidth,
		newTab,
	} = props.attributes

	const designHasBackground = design !== 'plain'

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.cta.mainclasses_1_15_5', {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		[ `ugb--has-background-gradient` ]: designHasBackground && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: designHasBackground && backgroundType === 'video',
	}, design, props ) )

	const backgroundStyle = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const mainStyle = {
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		...backgroundStyle,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ designHasBackground && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.cta.save.output.before_1_15_5', null, design, props ) }
			<div className="ugb-content-wrapper">
				{ ctaTitle && !! ctaTitle.length && (
					<RichText.Content
						tagName="h3"
						className="ugb-cta__title"
						style={ { color: titleColor } }
						value={ ctaTitle }
					/>
				) }
				{ bodyText && !! bodyText.length && (
					<RichText.Content
						tagName="p"
						className="ugb-cta__description"
						style={ { color: bodyTextColor } }
						value={ bodyText }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_15_5
						size={ size }
						url={ url }
						color={ textColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ color }
						borderRadius={ borderButtonRadius }
						newTab={ newTab }
					/>
				) }
			</div>
		</div>
	)
}

export const deprecatedSchema_1_15_5 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'target',
		default: false,
	},
	ctaTitle: {
		source: 'html',
		selector: 'h3',
		default: __( 'Title for This Block' ),
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder(),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: __( 'Button text' ),
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
		// default: '#ffffff',
	},
	titleColor: {
		type: 'string',
	},
	bodyTextColor: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	borderButtonRadius: {
		type: 'number',
		default: 4,
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
	buttonIcon: {
		type: 'string',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	bgColor: {
		type: 'string',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15_5,
		save: deprecatedSave_1_15_5,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /\n\.ugb-cta(\s*{)/g, '\n.ugb-cta__item$1' )
				.replace( /\.ugb-content-wrapper/g, '.ugb-cta__item' )

			return {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				title: attributes.ctaTitle || '',
				titleColor: attributes.titleColor || '',
				description: attributes.bodyText || '',
				descriptionColor: attributes.bodyTextColor || '',

				// Button.
				buttonUrl: attributes.url,
				buttonNewTab: attributes.newTab,
				buttonBackgroundColor: attributes.color,
				buttonTextColor: attributes.textColor,
				buttonSize: attributes.size,
				buttonDesign: attributes.buttonDesign,
				buttonBorderRadius: attributes.borderButtonRadius,

				// Column.
				columnBackgroundColorType: attributes.backgroundColorType,
				columnBackgroundColor: attributes.backgroundColor,
				columnBackgroundColor2: attributes.backgroundColor2,
				columnBackgroundGradientDirection: attributes.backgroundColorDirection,
				backgroundType: undefined,
				columnBackgroundMediaId: attributes.backgroundImageID,
				columnBackgroundMediaUrl: attributes.backgroundImageURL,
				columnBackgroundTintStrength: attributes.backgroundOpacity,
				columnFixedBackground: attributes.fixedBackground ? attributes.fixedBackground : undefined,

				// Full-width blocks before had 0 margin-top and margin-bottom.
				marginTop: attributes.align === 'full' ? 0 : undefined,
				marginBottom: attributes.align === 'full' ? 0 : undefined,
			}
		},
	},
]

export default deprecated
