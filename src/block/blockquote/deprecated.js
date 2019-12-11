/**
 * Internal dependencies
 */
import { QUOTE_ICONS } from './quotes'
import { QUOTE_ICONS_1_11 } from './deprecated-quotes'

/**
 * External dependencies
 */
import { descriptionPlaceholder } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import classnames from 'classnames'

const deprecatedSave_1_17_3 = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
		quotationMark = 'round-thin',
		quotationSize = 70,
		align,
		contentWidth,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const designHasBackground = [ 'basic', 'top-icon' ].includes( design )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-blockquote--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-blockquote--design-${ design }`,
	], applyFilters( 'stackable.blockquote.mainclasses_1_17_3', {
		'ugb--has-background': designHasBackground && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': designHasBackground && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: designHasBackground && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		'ugb-blockquote--small-quote': quotationSize < 60,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const basicStyles = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.blockquote.styles_1_17_3', {
		main: {
			'--quote-color': quoteColor ? quoteColor : undefined,
			...basicStyles,
		},
		text: {
			color,
		},
	}, design, props )

	return (
		<blockquote
			className={ mainClasses }
			style={ styles.main }>
			{ designHasBackground && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.blockquote.save.output.before_1_17_3', null, design, props ) }
			<div className="ugb-content-wrapper">
				{ QUOTE_ICONS[ quotationMark ].iconFunc( {
					fill: quoteColor,
					width: quotationSize,
					height: quotationSize,
				} ) }
				{ applyFilters( 'stackable.blockquote.save.output_1_17_3',
					<RichText.Content
						tagName="p"
						className="ugb-blockquote__text"
						style={ styles.text }
						value={ text }
					/>,
					design, props
				) }
			</div>
			{ applyFilters( 'stackable.blockquote.save.output.after_1_17_3', null, design, props ) }
		</blockquote>
	)
}

const deprecatedSchema_1_17_3 = {
	align: {
		type: 'string',
	},
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
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
	quotationMark: {
		type: 'string',
		default: 'round-thin',
	},
	quotationSize: {
		type: 'number',
		default: 70,
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

const deprecatedSave_1_13 = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
		quotationMark = 'round-thin',
		quotationSize = 70,
		align,
		contentWidth,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const designHasBackground = [ 'basic', 'top-icon' ].includes( design )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-blockquote--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-blockquote--design-${ design }`,
	], applyFilters( 'stackable.blockquote.mainclasses', {
		'ugb--has-background': designHasBackground && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': designHasBackground && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: designHasBackground && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		'ugb-blockquote--small-quote': quotationSize < 60,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const basicStyles = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.blockquote.styles_1_17_3', {
		main: {
			'--quote-color': quoteColor ? quoteColor : undefined,
			...basicStyles,
		},
		text: {
			color,
		},
	}, design, props )

	return (
		<blockquote
			className={ mainClasses }
			style={ styles.main }>
			{ designHasBackground && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.blockquote.save.output.before', null, design, props ) }
			<div className="ugb-content-wrapper">
				{ QUOTE_ICONS[ quotationMark ].iconFunc( {
					fill: quoteColor,
					width: quotationSize,
					height: quotationSize,
				} ) }
				{ applyFilters( 'stackable.blockquote.save.text',
					<RichText.Content
						tagName="p"
						className="ugb-blockquote__text"
						style={ styles.text }
						value={ text }
					/>,
					design, props
				) }
			</div>
			{ applyFilters( 'stackable.blockquote.save.output.after', null, design, props ) }
		</blockquote>
	)
}

const deprecatedSchema_1_10 = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
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
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		'--quote-color': quoteColor ? quoteColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
	}

	return (
		<blockquote
			className={ mainClasses }
			style={ mainStyle }>
			<RichText.Content
				tagName="p"
				style={ { color } }
				value={ text }
			/>
		</blockquote>
	)
}

const deprecatedSchema_1_11 = {
	align: {
		type: 'string',
	},
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
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
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	quotationMark: {
		type: 'string',
		default: 'round-thin',
	},
	quotationSize: {
		type: 'number',
		default: 70,
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
}

const deprecatedSchema_1_13 = deprecatedSchema_1_11

const deprecatedSave_1_11 = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
		quotationMark = 'round-thin',
		quotationSize = 70,
		align,
		contentWidth,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const designHasBackground = [ 'basic', 'top-icon' ].includes( design )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-blockquote--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-blockquote--design-${ design }`,
	], {
		'ugb--has-background': designHasBackground && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': designHasBackground && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: designHasBackground && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
	} )

	const mainStyle = {
		'--quote-color': quoteColor ? quoteColor : undefined,
		backgroundColor: designHasBackground && backgroundColor ? backgroundColor : undefined,
		backgroundImage: designHasBackground && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: designHasBackground && fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': designHasBackground && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: designHasBackground && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<blockquote
			className={ mainClasses }
			style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ QUOTE_ICONS_1_11[ quotationMark ].iconFunc( {
					fill: quoteColor,
					width: quotationSize,
					height: quotationSize,
				} ) }
				<RichText.Content
					tagName="p"
					className="ugb-blockquote__text"
					style={ { color } }
					value={ text }
				/>
			</div>
		</blockquote>
	)
}

const deprecatedSchema_1_4 = {
	text: {
		source: 'html',
		selector: 'p',
		default: 'It\'s okay to acknowledge that life can get complicated, but we musn\'t forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.',
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
	},
}

const deprecatedSave_1_4 = props => {
	const { className } = props
	const {
		color, text, quoteColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
	] )

	return (
		<blockquote
			className={ mainClasses }
			style={ { '--quote-color': quoteColor } }>
			<RichText.Content
				tagName="p"
				style={ { color } }
				value={ text }
			/>
		</blockquote>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => {
				let newCss = ( css || '' )
					.replace( /\.ugb-content-wrapper/g, '.ugb-blockquote__item' )
					.replace( /svg(\s*\{)/g, '.ugb-blockquote__quote$1' )

				// For the basic design, the box is colored before by just the '.ugb-blockquote' selector.
				if ( attributes.design === 'basic' ) {
					newCss = newCss.replace( /\.ugb-blockquote(\s*\{)/g, '.ugb-blockquote__item$1' )
				}
				return newCss
			}

			return {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				showQuote: true,
				quoteIcon: attributes.quotationMark,
				quoteSize: attributes.quotationSize,
				textColor: attributes.color ? attributes.color : ( attributes.backgroundColor ? '#000000' : undefined ),
				containerBackgroundColorType: attributes.backgroundColorType,
				containerBackgroundColor: attributes.backgroundColor,
				containerBackgroundColor2: attributes.backgroundColor2,
				containerBackgroundGradientDirection: attributes.backgroundColorDirection,
				containerBackgroundMediaId: attributes.backgroundImageID,
				containerBackgroundMediaUrl: attributes.backgroundImageURL,
				containerBackgroundTintStrength: attributes.backgroundOpacity,
				containerFixedBackground: attributes.fixedBackground,

				// Full-width support.
				design: attributes.design === 'basic' && attributes.align === 'full' ? 'plain' : attributes.design,
				showBlockBackground: attributes.design === 'basic' && attributes.align === 'full' ? true : undefined,
				blockInnerWidth: attributes.align !== 'full' ? undefined : ( attributes.design === 'basic' && attributes.contentWidth === true ? 'center' : 'full' ),
				blockBackgroundBackgroundColor: attributes.design === 'basic' && attributes.align === 'full' ? attributes.backgroundColor : undefined,

				// Full-width blocks before had 0 margin-top and margin-bottom.
				marginTop: attributes.align === 'full' ? 0 : undefined,
				marginBottom: attributes.align === 'full' ? 0 : undefined,
			}
		},
	},
	{ // This fixes the highlight design block error.
		attributes: deprecatedSchema_1_13,
		save: deprecatedSave_1_13,
	},
	{
		attributes: deprecatedSchema_1_11,
		save: deprecatedSave_1_11,
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
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			const className = ( attributes.className || '' ).replace( /align\w+/, '' ).trim()
			return {
				...attributes,
				design: attributes.backgroundColor || attributes.backgroundImageURL ? 'basic' : 'plain',
				borderRadius: 12,
				shadow: 3,
				quotationMark: 'round-thin',
				quotationSize: 70,
				contentWidth: false,
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
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
]

export default deprecated
