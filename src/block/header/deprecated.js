/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_12,
	DeprecatedButtonContent_1_15_5,
	DeprecatedButtonContent_1_1_2,
	DeprecatedButtonContent_1_4,
	DeprecatedButtonContent_1_9,
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

const deprecatedSave_1_12 = props => {
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
		backgroundColor,
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
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		[ `ugb-header--design-${ design }` ],
	], {
		'ugb--has-background': design !== 'plain' &&
		                       ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' &&
		                             backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		'ugb-header--invert': invert,
		'ugb-header--full-height': fullHeight,
	} )

	const styles = {
		main: {
			'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
			backgroundAttachment: design !== 'plain' && fixedBackground ? 'fixed' : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
			backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			textAlign: contentAlign ? contentAlign : undefined,
		},
		title: {
			color: titleColor ? titleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
		},
		subtitle: {
			color: subtitleColor ? subtitleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
		},
	}

	return (
		<div className={ mainClasses } style={ styles.main }>
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
					<DeprecatedButtonContent_1_12
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
				return <div className="ugb-content-wrapper">
					{ titleComp }
					{ subtitleComp }
					{ buttonComp }
				</div>
			} )() }
		</div>
	)
}

const deprecatedSchema_1_12 = {
	title: {
		source: 'html',
		selector: 'h2',
		default: 'Title for This Block',
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
		default: 'Button text',
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

const deprecatedSave_1_10 = props => {
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
		contentAlign,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
		textAlign: contentAlign ? contentAlign : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-header-wrapper">
				{ ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header-title"
						style={ { color: titleColor } }
						value={ title }
					/>
				) }
				{ ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header-subtitle"
						style={ { color: subtitleColor } }
						value={ subtitle }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_10
						size={ size }
						url={ buttonURL }
						align={ contentAlign }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				) }
			</div>
		</div>
	)
}

const deprecatedSchema_1_10 = {
	title: {
		source: 'html',
		selector: 'h2',
		default: 'Title for This Block',
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder(),
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: 'Button text',
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
	contentAlign: {
		type: 'string',
		default: 'center',
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
	fixedBackground: {
		type: 'boolean',
		default: false,
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

export const deprecatedSave_1_9 = props => {
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
		contentAlign,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
		textAlign: contentAlign ? contentAlign : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-header-wrapper">
				{ ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header-title"
						style={ { color: titleColor } }
						value={ title }
					/>
				) }
				{ ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header-subtitle"
						style={ { color: subtitleColor } }
						value={ subtitle }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_9
						size={ size }
						url={ buttonURL }
						align={ contentAlign }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				) }
			</div>
		</div>
	)
}

export const deprecatedSchema_1_9 = {
	title: {
		source: 'html',
		selector: 'h2',
		default: 'Heading Title',
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.',
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button-inner',
		attribute: 'href',
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button-inner',
		default: 'Button',
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
	contentAlign: {
		type: 'string',
		default: 'center',
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
	fixedBackground: {
		type: 'boolean',
		default: false,
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	opacity: {
		type: 'number',
		default: 5,
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-header .ugb-header-section',
		attribute: 'data-url',
	},
	id: {
		type: 'number',
	},
}

function opacityToClass_1_4( ratio ) {
	return ( ratio === 0 ) ?
		null :
		'overlay-opacity-' + ( 1 * Math.round( ratio / 1 ) )
}

export const deprecatedSave_1_4 = props => {
	const { className } = props
	const {
		url,
		buttonURL,
		buttonText,
		buttonColor,
		buttonTextColor,
		cornerButtonRadius,
		size,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		contentAlign,
		backgroundColor,
		opacity,
	} = props.attributes

	const style = {
		backgroundImage: url ? `url(${ url })` : undefined,
		textAlign: contentAlign ? contentAlign : undefined,
	}

	const mainClasses = classnames( [
		className,
		'ugb-header',
	], {
		'has-image': url,
		'has-no-content': ! title && ! subtitle && ! buttonText,
		'has-content': title || subtitle || buttonText,
	} )

	const overlayClasses = classnames( [
		opacityToClass_1_4( opacity ),
		'ugb-header-overlay',
	], {
		'overlay-opacity': opacity !== 0,
	} )

	return (
		<div className={ mainClasses }>
			<div className={ overlayClasses }
				style={ { backgroundColor } }>
			</div>
			<section
				key="preview"
				data-url={ url }
				style={ style }
				className="ugb-header-section">
				{ ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header-title"
						style={ { color: titleColor } }
						value={ title }
					/>
				) }
				{ ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header-subtitle"
						style={ { color: subtitleColor } }
						value={ subtitle }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_4 size={ size } url={ buttonURL } align={ contentAlign } color={ buttonTextColor } text={ buttonText } backgroundColor={ buttonColor } borderRadius={ cornerButtonRadius } />
				) }
			</section>
		</div>
	)
}

export const deprecatedSchema_1_4 = {
	title: {
		source: 'html',
		selector: 'h2',
		default: 'Heading Title',
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-header .ugb-header-section',
		attribute: 'data-url',
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button-inner',
		attribute: 'href',
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button-inner',
		default: 'Button',
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	contentAlign: {
		type: 'string',
		default: 'center',
	},
	id: {
		type: 'number',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	opacity: {
		type: 'number',
		default: 5,
	},
}

export const deprecatedSave_1_1_2 = props => {
	const {
		url,
		buttonURL,
		buttonText,
		buttonColor,
		buttonTextColor,
		cornerButtonRadius,
		size,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		contentAlign,
		backgroundColor,
		opacity,
	} = props.attributes

	const style = url ? { backgroundImage: `url(${ url })` } : undefined

	const imageClass = url ? 'has-image' : ''

	const opacityClass = classnames(
		[],
		{
			'overlay-opacity': opacity !== 0,
			[ 'overlay-opacity-' + ( 1 * Math.round( opacity / 1 ) ) ]: opacity === 0,
		}
	)

	const displayNone = ( ! title.length && ! subtitle.length && ! buttonText.length ) ? 'has-no-content' : 'has-content'

	return (
		<div className={ `ugb-header ${ imageClass } ${ displayNone }` }>
			<div className={ `ugb-header-overlay ${ opacityClass }` }
				style={ { backgroundColor } }>
			</div>
			<section
				key="preview"
				data-url={ url }
				style={ style }
				className="ugb-header-section">
				{ ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header-title"
						style={ { color: titleColor } }
						value={ title }
					/>
				) }
				{ ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header-subtitle"
						style={ { color: subtitleColor } }
						value={ subtitle }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_1_2 size={ size } url={ buttonURL } align={ contentAlign } color={ buttonTextColor } text={ buttonText } backgroundColor={ buttonColor } borderRadius={ cornerButtonRadius } />
				) }
			</section>
		</div>
	)
}

export const deprecatedSchema_1_1_2 = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'h2',
		default: 'Heading Title',
	},
	subtitle: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-header .ugb-header-section',
		attribute: 'data-url',
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button-inner',
		attribute: 'href',
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	buttonText: {
		type: 'array',
		source: 'children',
		selector: '.ugb-button-inner',
		default: 'Button',
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	contentAlign: {
		type: 'string',
		default: 'center',
	},
	id: {
		type: 'number',
	},
	backgroundColor: {
		type: 'string',
		default: '#000000',
	},
	opacity: {
		type: 'number',
		default: 5,
	},
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
	{
		attributes: deprecatedSchema_1_12,
		save: deprecatedSave_1_12,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			const design = attributes.backgroundColor || attributes.backgroundImageURL ? 'basic' : 'plain'
			const className = ( attributes.className || '' ).replace( /align\w+/, '' ).trim()
			return {
				...attributes,
				design,
				borderRadius: 12,
				shadow: 3,
				titleColor: '#ffffff',
				contentWidth: attributes.align === 'full',
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
				buttonNewTab: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9,
		save: deprecatedSave_1_9,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
			                  .replace( /\s+/, ' ' )
							  .trim()
			return {
				...attributes,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_4,
		save: deprecatedSave_1_4,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
			                  .replace( /\s+/, ' ' )
							  .trim()
			return {
				...attributes,
				backgroundOpacity: attributes.opacity,
				backgroundImageID: attributes.id,
				backgroundImageURL: attributes.url,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_1_2,
		save: deprecatedSave_1_1_2,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
			                  .replace( /\s+/, ' ' )
							  .trim()
			return {
				...attributes,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
]

export default deprecated
