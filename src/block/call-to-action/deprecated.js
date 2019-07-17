import {
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_12,
	DeprecatedButtonContent_1_4,
	DeprecatedButtonContent_1_9,
	DeprecatedButtonContent_1_9_1,
} from '@stackable/components/button-edit'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { RichText } from '@wordpress/block-editor'

const deprecatedSchema_1_12 = {
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
		default: 'Title for This Block',
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder(),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: 'Button text',
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
	backgroundColor: {
		type: 'string',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	bgColor: {
		type: 'string',
	},
}

const deprecatedSave_1_12 = props => {
	const { className } = props
	const {
		url,
		buttonText,
		ctaTitle,
		bodyText,
		color,
		textColor = '#ffffff',
		size,
		borderButtonRadius,
		bodyTextColor,
		titleColor,
		backgroundColor,
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

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
	} )

	const mainStyle = {
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
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
					<DeprecatedButtonContent_1_12
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

const deprecatedSave_1_10 = props => {
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
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		buttonDesign,
		buttonIcon,
		design,
		borderRadius,
		shadow,
		align,
		contentWidth,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		[ `ugb-design-${ design }` ]: design !== 'basic',
		[ `ugb-shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
	} )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ ctaTitle && !! ctaTitle.length && (
					<RichText.Content
						tagName="h3"
						className="ugb-cta-title"
						style={ { color: titleColor } }
						value={ ctaTitle }
					/>
				) }
				{ bodyText && !! bodyText.length && (
					<RichText.Content
						tagName="p"
						className="ugb-cta-bodyText"
						style={ { color: bodyTextColor } }
						value={ bodyText }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_10
						size={ size }
						url={ url }
						color={ textColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ color }
						borderRadius={ borderButtonRadius }
					/>
				) }
			</div>
		</div>
	)
}

const deprecatedSchema_1_10 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
	},
	ctaTitle: {
		source: 'html',
		selector: 'h3',
		default: 'Title for This Block',
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder(),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: 'Button text',
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
		default: '#ffffff',
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
	backgroundColor: {
		type: 'string',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	bgColor: {
		type: 'string',
	},
}

const deprecatedSave_1_9_1 = props => {
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
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		buttonDesign,
		buttonIcon,
		columns = undefined,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		`columns-${ columns }`, // eslint-disable-line
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
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ ctaTitle && !! ctaTitle.length && (
				<RichText.Content
					tagName="h3"
					className="ugb-cta-title"
					style={ { color: titleColor } }
					value={ ctaTitle }
				/>
			) }
			{ bodyText && !! bodyText.length && (
				<RichText.Content
					tagName="p"
					className="ugb-cta-bodyText"
					style={ { color: bodyTextColor } }
					value={ bodyText }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_9_1
					size={ size }
					url={ url }
					color={ textColor }
					text={ buttonText }
					design={ buttonDesign }
					icon={ buttonIcon }
					backgroundColor={ color }
					borderRadius={ borderButtonRadius }
				/>
			) }
		</div>
	)
}

const deprecatedSchema_1_9_1 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
	},
	ctaTitle: {
		source: 'html',
		selector: 'h3',
		default: 'Get Started Today',
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: 'Get Stackable: Ultimate Gutenberg Blocks today.  Apart from adding new blocks, it gives Gutenberg users more options and settings to tinker with, expanding Gutenberg’s functionality.',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
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
		default: '#ffffff',
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
	backgroundColor: {
		type: 'string',
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
	align: {
		type: 'string',
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	bgColor: {
		type: 'string',
	},
}

export const deprecatedSchema_1_9 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button a',
		attribute: 'href',
	},
	ctaTitle: {
		source: 'html',
		selector: 'h3',
		default: 'Get Started Today',
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: 'Get Stackable: Ultimate Gutenberg Blocks today.  Apart from adding new blocks, it gives Gutenberg users more options and settings to tinker with, expanding Gutenberg’s functionality.',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button a',
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
		default: '#ffffff',
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
	backgroundColor: {
		type: 'string',
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
	align: {
		type: 'string',
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	bgColor: {
		type: 'string',
	},
}

export const deprecatedSave_1_9 = props => {
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
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		buttonDesign,
		buttonIcon,
		columns = undefined,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		`columns-${ columns }`,
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
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ ctaTitle && !! ctaTitle.length && (
				<RichText.Content
					tagName="h3"
					className="ugb-cta-title"
					style={ { color: titleColor } }
					value={ ctaTitle }
				/>
			) }
			{ bodyText && !! bodyText.length && (
				<RichText.Content
					tagName="p"
					className="ugb-cta-bodyText"
					style={ { color: bodyTextColor } }
					value={ bodyText }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_9
					size={ size }
					url={ url }
					color={ textColor }
					text={ buttonText }
					design={ buttonDesign }
					icon={ buttonIcon }
					backgroundColor={ color }
					borderRadius={ borderButtonRadius }
				/>
			) }
		</div>
	)
}

export const deprecatedSchema_1_4 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button a',
		attribute: 'href',
	},
	ctaTitle: {
		source: 'html',
		selector: 'h3',
		default: 'Get Started Today',
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: 'Get Stackable: Ultimate Gutenberg Blocks today.  Apart from adding new blocks, it gives Gutenberg users more options and settings to tinker with, expanding Gutenberg’s functionality.',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button a',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
		default: '#ffffff',
	},
	titleColor: {
		type: 'string',
	},
	bodyTextColor: {
		type: 'string',
	},
	bgColor: {
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
	align: {
		type: 'string',
	},
}

export const deprecatedSave_1_4 = props => {
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
		bgColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
	] )

	return (
		<div className={ mainClasses } style={ { backgroundColor: bgColor } }>
			{ ctaTitle && !! ctaTitle.length && (
				<RichText.Content
					tagName="h3"
					className="ugb-cta-title"
					style={ { color: titleColor } }
					value={ ctaTitle }
				/>
			) }
			{ bodyText && !! bodyText.length && (
				<RichText.Content
					tagName="p"
					className="ugb-cta-bodyText"
					style={ { color: bodyTextColor } }
					value={ bodyText }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_4 size={ size } url={ url } color={ textColor } text={ buttonText } backgroundColor={ color } borderRadius={ borderButtonRadius } />
			) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_12,
		save: deprecatedSave_1_12,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
			                  .trim()
			return {
				...attributes,
				newTab: false,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9_1,
		save: deprecatedSave_1_9_1,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
			                  .trim()
			return {
				...attributes,
				contentWidth: false,
				design: 'basic',
				borderRadius: 12,
				shadow: 3,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9,
		save: deprecatedSave_1_9,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
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
			                  .trim()
			return {
				backgroundColor: attributes.bgColor,
				...attributes,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
]

export default deprecated
