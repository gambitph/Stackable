import {
	DeprecatedButtonContent_1_1,
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_1_2,
	DeprecatedButtonContent_1_4,
	DeprecatedButtonContent_1_9,
} from '@stackable/components/button-edit'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { RichText } from '@wordpress/editor'

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
		default: __( 'Title for This Block' ),
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
		default: __( 'Button text' ),
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
		default: __( 'Heading Title' ),
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.' ),
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
		default: __( 'Button' ),
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
				style={ { backgroundColor: backgroundColor } }>
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
		default: __( 'Heading Title' ),
	},
	subtitle: {
		source: 'html',
		selector: 'p',
		default: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.' ),
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
		default: __( 'Button' ),
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
		opacityToClass_1_1( opacity ),
		{
			'overlay-opacity': opacity !== 0,
		}
	)

	const displayNone = ( ! title.length && ! subtitle.length && ! buttonText.length ) ? 'has-no-content' : 'has-content'

	return (
		<div className={ `ugb-header ${ imageClass } ${ displayNone }` }>
			<div className={ `ugb-header-overlay ${ opacityClass }` }
				style={ { backgroundColor: backgroundColor } }>
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
		default: __( 'Heading Title' ),
	},
	subtitle: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.' ),
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
		default: __( 'Button' ),
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

export const deprecatedSave_1_1 = props => {
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
		opacityToClass_1_1( opacity ),
		{
			'overlay-opacity': opacity !== 0,
		}
	)

	const displayNone = ( ! title.length && ! subtitle.length && ! buttonText.length ) ? 'has-no-content' : 'has-content'

	return (
		<div className={ `ugb-header ${ imageClass } ${ displayNone }` }>
			<div className={ `ugb-header-overlay ${ opacityClass }` }
				style={ { backgroundColor: backgroundColor } }>
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
					<DeprecatedButtonContent_1_1 size={ size } url={ buttonURL } align={ contentAlign } color={ buttonTextColor } text={ buttonText } backgroundColor={ buttonColor } borderRadius={ cornerButtonRadius } />
				) }
			</section>
		</div>
	)
}

function opacityToClass_1_1( ratio ) {
	return ( ratio === 0 ) ?
		null :
		'overlay-opacity-' + ( 1 * Math.round( ratio / 1 ) )
}

export const deprecatedSchema_1_1 = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'h2',
		default: __( 'Heading Title' ),
	},
	subtitle: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.' ),
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
		default: __( 'Button' ),
	},
	buttonColor: {
		type: 'string',
		default: '#2091e1',
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

export const deprecatedSave_0_7 = props => {
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
		backgroundColor,
		opacity,
	} = props.attributes

	const buttonStyle = {
		backgroundColor: buttonColor,
		color: buttonTextColor,
		borderRadius: cornerButtonRadius + 'px',
	}

	const style = url ? { backgroundImage: `url(${ url })` } : undefined

	const imageClass = url ? 'has-image' : ''

	const opacityClass = classnames(
		opacityToClass_0_7( opacity ),
		{
			'overlay-opacity': opacity !== 0,
		}
	)

	const displayNone = ( ! title && ! subtitle && ! buttonText ) ? 'has-no-content' : 'has-content'

	return (
		<div className={ `ugb-header ${ imageClass } ${ displayNone }` }>
			<div className={ `ugb-header-overlay ${ opacityClass }` }
				style={ { backgroundColor: backgroundColor } }>
			</div>
			<section
				key="preview"
				data-url={ url }
				style={ style }
				className="ugb-header-section">
				{ title && !! title.length && (
					<h2 className="ugb-header-title" style={ { color: titleColor } }>
						{ title }
					</h2>
				) }
				{ subtitle && !! subtitle.length && (
					<p className="ugb-header-subtitle" style={ { color: subtitleColor } }>
						{ subtitle }
					</p>
				) }
				{ buttonText && !! buttonText.length && (
					<a
						href={ buttonURL }
						className={ `wp-ugb-button ugb-button-${ size }` }
						style={ buttonStyle }>
						{ buttonText }
					</a>
				) }
			</section>
		</div>
	)
}

function opacityToClass_0_7( ratio ) {
	return ( ratio === 0 ) ?
		null :
		'overlay-opacity-' + ( 1 * Math.round( ratio / 1 ) )
}

export const deprecatedSchema_0_7 = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'h2',
		default: __( 'Heading Title' ),
	},
	subtitle: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.' ),
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
		selector: 'a',
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
		selector: '.ugb-header a.wp-ugb-button',
		default: __( 'Button' ),
	},
	buttonColor: {
		type: 'string',
		default: '#2091e1',
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
	},
	{
		attributes: deprecatedSchema_1_4,
		save: deprecatedSave_1_4,
		migrate: attributes => {
			return {
				...attributes,
				backgroundOpacity: attributes.opacity,
				backgroundImageID: attributes.id,
				backgroundImageURL: attributes.url,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_1_2,
		save: deprecatedSave_1_1_2,
	},
	{
		attributes: deprecatedSchema_1_1,
		save: deprecatedSave_1_1,
	},
	{
		attributes: deprecatedSchema_0_7,
		save: deprecatedSave_0_7,
	},
]

export default deprecated
