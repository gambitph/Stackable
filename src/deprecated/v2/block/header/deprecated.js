/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_15_5,
} from '~stackable/components/button-edit'
import { descriptionPlaceholder } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { RichText } from '@wordpress/block-editor'

const deprecatedSchema_1_15_6 = {
	title: {
		source: 'html',
		selector: 'h2',
		default: __( 'Title for This Block', i18n ),
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder(),
	},
	titleColor: {
		type: 'string',
		// default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		// default: '#ffffff',
	},
	contentAlign: {
		type: 'string',
		default: 'center',
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
	fixedBackground: {
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
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	align: {
		type: 'string',
	},
	invert: {
		type: 'boolean',
		default: false,
	},
	fullHeight: {
		type: 'boolean',
		default: false,
	},

	// Button.
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
		default: '#ffffff',
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},

	// Button #2.
	buttonURL2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-header__buttons > *:last-child .ugb-button',
		attribute: 'href',
		default: '',
	},
	buttonNewTab2: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-header__buttons > *:last-child .ugb-button',
		attribute: 'target',
		default: false,
	},
	buttonText2: {
		source: 'html',
		selector: '.ugb-header__buttons > *:last-child .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	buttonColor2: {
		type: 'string',
	},
	buttonTextColor2: {
		type: 'string',
		default: '#ffffff',
	},
	buttonDesign2: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon2: {
		type: 'string',
	},
	buttonSize2: {
		type: 'string',
		default: 'normal',
	},
	buttonBorderRadius2: {
		type: 'number',
		default: 4,
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
	opacity: {
		type: 'number',
	},
	url: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
}

const deprecatedSave_1_15_6 = props => {
	const { className } = props
	const {
		buttonURL,
		buttonText,
		buttonColor,
		buttonTextColor,
		buttonDesign,
		buttonIcon,
		cornerButtonRadius,
		size,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		contentAlign = 'center',
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		align,
		contentWidth = false,
		buttonNewTab,
		invert = false,
		fullHeight = false,
		buttonSize2,
		buttonTextColor2,
		buttonColor2,
		buttonText2 = '',
		buttonBorderRadius2 = 4,
		buttonDesign2 = 'basic',
		buttonIcon2 = '',
		buttonURL2 = '',
		buttonNewTab2 = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		[ `ugb-header--design-${ design }` ],
	], applyFilters( 'stackable.header.mainclasses_1_15_6', {
		'ugb--has-background': design !== 'plain' &&
		                       ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' &&
		                             backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		'ugb-header--invert': invert,
		'ugb-header--full-height': fullHeight,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainBackgroundStyles = design === 'plain' ? {} : {
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.header.styles_1_15_6', {
		main: {
			textAlign: contentAlign ? contentAlign : undefined,
			...mainBackgroundStyles,
		},
		title: {
			color: titleColor ? titleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
			textAlign: contentAlign ? contentAlign : undefined,
		},
		subtitle: {
			color: subtitleColor ? subtitleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
			textAlign: contentAlign ? contentAlign : undefined,
		},
	}, design, props )

	return (
		<div className={ mainClasses } style={ styles.main }>
			{ design !== 'plain' && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.header.save.output.before_1_15_6', null, design, props ) }
			{ ( () => {
				const titleComp = ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header__title"
						style={ styles.title }
						value={ title }
					/>
				)
				const subtitleComp = ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header__subtitle"
						style={ styles.subtitle }
						value={ subtitle }
					/>
				)
				const buttonComp = buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_15_5
						size={ size }
						url={ buttonURL }
						newTab={ buttonNewTab }
						align={ contentAlign }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				)
				const button2Comp = buttonText2 && !! buttonText2.length &&
					<DeprecatedButtonContent_1_15_5
						size={ buttonSize2 }
						url={ buttonURL2 }
						newTab={ buttonNewTab2 }
						align={ contentAlign }
						color={ buttonTextColor2 }
						text={ buttonText2 }
						design={ buttonDesign2 }
						icon={ buttonIcon2 }
						backgroundColor={ buttonColor2 }
						borderRadius={ buttonBorderRadius2 }
					/>
				const comps = {
					titleComp,
					subtitleComp,
					buttonComp,
				}

				const buttonsStyle = {
					justifyContent: contentAlign === 'right' ? 'flex-end' :
						contentAlign === 'left' ? 'flex-start' :
							undefined,
				}

				const buttonArea = ! buttonText2 ? comps.buttonComp : (
					<div className="ugb-header__buttons" style={ buttonsStyle }>
						{ comps.buttonComp }
						{ button2Comp }
					</div>
				)

				if ( design === 'basic' || design === 'plain' ) {
					return <div className="ugb-content-wrapper">
						{ titleComp }
						{ subtitleComp }
						{ buttonArea }
					</div>
				}

				return <div className="ugb-content-wrapper">
					<div className="ugb-header__wrapper">
						{ titleComp }
						{ subtitleComp }
						{ buttonArea }
					</div>
				</div>
			} )() }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15_6,
		save: deprecatedSave_1_15_6,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' ).replace( /\.ugb-header(\s*\{)/g, '.ugb-header__item$1' )

			const additonalAttributes = {}
			if ( attributes.design === 'half-overlay' && attributes.fullHeight ) {
				additonalAttributes.design = 'side-overlay'
				additonalAttributes[ attributes.invert ? 'columnPaddingRight' : 'columnPaddingLeft' ] = 0
			}

			return {
				...attributes,
				...additonalAttributes,

				columnBackgroundColorType: attributes.backgroundColorType,
				columnBackgroundColor: attributes.backgroundColor,
				columnBackgroundColor2: attributes.backgroundColor2,
				columnBackgroundGradientDirection: attributes.backgroundColorDirection,
				backgroundType: undefined,
				columnBackgroundMediaId: attributes.backgroundImageID,
				columnBackgroundMediaUrl: attributes.backgroundImageURL,
				columnBackgroundTintStrength: attributes.backgroundOpacity,
				columnFixedBackground: attributes.fixedBackground ? attributes.fixedBackground : undefined,

				restrictContentWidth: attributes.contentWidth,

				// Button 1.
				showButton: !! attributes.buttonText,
				buttonUrl: attributes.buttonURL,
				buttonNewTab: attributes.buttonNewTab,
				buttonBackgroundColor: attributes.buttonColor,
				buttonSize: attributes.size,
				buttonBorderRadius: attributes.cornerButtonRadius,

				// Button 2.
				showButton2: !! attributes.buttonText2,
				button2Url: attributes.buttonURL2,
				button2NewTab: attributes.buttonNewTab2,
				button2Text: attributes.buttonText2,
				button2BackgroundColor: attributes.buttonColor2,
				button2TextColor: attributes.buttonTextColor2,
				button2Design: attributes.buttonDesign2,
				button2Icon: attributes.buttonIcon2,
				button2Size: attributes.buttonSize2,
				button2BorderRadius: attributes.buttonBorderRadius2,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				// Full-width blocks before had 0 margin-top and margin-bottom.
				marginTop: attributes.align === 'full' ? 0 : undefined,
				marginBottom: attributes.align === 'full' ? 0 : undefined,
			}
		},
	},
]

export default deprecated
