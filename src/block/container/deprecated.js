/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { InnerBlocks } from '@wordpress/block-editor'

const deprecatedSchema_1_17_3 = {
	textColor: {
		type: 'string',
	},
	contentAlign: {
		type: 'string',
		default: '',
	},
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '#f1f1f1',
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
	height: {
		type: 'string',
		default: 'normal',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	contentLocation: {
		type: 'string',
		default: 'full',
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
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

const deprecatedSave_1_17_3 = props => {
	const {
		className,
	} = props

	const {
		contentAlign,
		textColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		height,
		contentLocation,
		verticalAlign,
		contentWidth,
		borderRadius = 12,
		shadow = 3,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-container',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.container.mainclasses_1_17_3', {
		[ `ugb-container--content-${ contentAlign }` ]: contentAlign,
		'ugb--has-background': ( backgroundColor && backgroundColor !== 'transparent' ) || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb-container--height-${ height }` ]: height,
		[ `ugb-container--align-horizontal-${ contentLocation }` ]: contentLocation,
		[ `ugb--content-width` ]: contentWidth,
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainStyle = {
		'--ugb-text-color': textColor ? textColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		'justify-content': ( height === 'full' || height === 'half' ) && verticalAlign ? verticalAlign : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
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
			{ applyFilters( 'stackable.container.save.output.before_1_17_3', null, design, props ) }
			<div className="ugb-container__wrapper">
				<div className="ugb-container__content-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
			{ applyFilters( 'stackable.container.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
	textColor: {
		type: 'string',
	},
	contentAlign: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '#f1f1f1',
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
	height: {
		type: 'string',
		default: 'normal',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	contentLocation: {
		type: 'string',
		default: 'full',
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
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

const deprecatedSave_1_10 = props => {
	const {
		className,
	} = props

	const {
		contentAlign,
		textColor,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		height,
		contentLocation,
		verticalAlign,
		contentWidth,
		borderRadius,
		shadow,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-container',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		[ `ugb-content-${ contentAlign }` ]: contentAlign,
		'ugb-has-background': ( backgroundColor && backgroundColor !== 'transparent' ) || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
		[ `ugb-height-${ height }` ]: height,
		[ `ugb-align-horizontal-${ contentLocation }` ]: contentLocation,
		[ `ugb-content-width` ]: contentWidth,
		[ `ugb-shadow-${ shadow }` ]: shadow !== 3,
	} )

	const mainStyle = {
		'--ugb-text-color': textColor ? textColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
		'justify-content': ( height === 'full' || height === 'half' ) && verticalAlign ? verticalAlign : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-container__wrapper">
				<div className="ugb-container__content-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	)
}

export const deprecatedSchema_1_9_1 = {
	textColor: {
		type: 'string',
	},
	contentAlign: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '#f1f1f1',
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
	height: {
		type: 'string',
		default: 'normal',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	contentLocation: {
		type: 'string',
		default: 'full',
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
}

export const deprecatedSave_1_9_1 = props => {
	const {
		className,
	} = props

	const {
		contentAlign,
		textColor,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		height,
		contentLocation,
		verticalAlign,
		contentWidth,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-container',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		[ `ugb-content-${ contentAlign }` ]: contentAlign,
		'ugb-has-background': ( backgroundColor && backgroundColor !== 'transparent' ) || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
		[ `ugb-height-${ height }` ]: height,
		[ `ugb-align-horizontal-${ contentLocation }` ]: contentLocation,
		[ `ugb-content-width` ]: contentWidth,
	} )

	const mainStyle = {
		'--ugb-text-color': textColor ? textColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
		'justify-content': ( height === 'full' || height === 'half' ) && verticalAlign ? verticalAlign : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-container__wrapper">
				<div className="ugb-container__content-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' ).replace( /\.ugb-container(\s*\{)/g, '.ugb-container__wrapper$1' )

			return {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				design: 'basic',
				headingColor: attributes.textColor,
				bodyTextColor: attributes.textColor,
				linkColor: attributes.textColor,
				linkHoverColor: attributes.textColor,

				columnBackgroundColorType: attributes.backgroundColorType,
				columnBackgroundColor: attributes.backgroundColor,
				columnBackgroundColor2: attributes.backgroundColor2,
				columnBackgroundGradientDirection: attributes.backgroundColorDirection,
				columnBackgroundMediaId: attributes.backgroundImageID,
				columnBackgroundMediaUrl: attributes.backgroundImageURL,
				columnBackgroundTintStrength: attributes.backgroundOpacity,
				columnFixedBackground: attributes.fixedBackground,

				restrictContentWidth: attributes.contentWidth,

				contentWidth: [ 'left', 'center', 'right' ].includes( attributes.contentLocation ) ? 50 : 100,
				contentHorizontalAlign: attributes.contentLocation === 'left' ? 'flex-start' :
					attributes.contentLocation === 'center' ? 'center' :
						attributes.contentLocation === 'right' ? 'flex-end' :
							undefined,

				contentVerticalAlign: attributes.verticalAlign,

				// Full-width blocks before had 0 margin-top and margin-bottom.
				marginTop: attributes.align === 'full' ? 0 : undefined,
				marginBottom: attributes.align === 'full' ? 0 : undefined,
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
				borderRadius: 12,
				shadow: 3,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9_1,
		save: deprecatedSave_1_9_1,
	},
]

export default deprecated
