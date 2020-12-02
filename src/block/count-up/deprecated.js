/**
 * Internal dependencies
 */
import { getFontFamily } from './deprecated-font'

/**
 * External dependencies
 */
import { range } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

export const deprecatedSave_1_15_4 = props => {
	const { className, attributes } = props
	const {
		columns,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		fixedBackground,
		backgroundOpacity = 5,
		textColor,
		countColor,
		countSize,
		contentWidth,
		design = 'plain',
		align,
		borderRadius = 12,
		shadow = 3,
		countFont,
		countFontWeight,
	} = attributes

	const show = applyFilters( 'stackable.count-up.edit.show_1_15_4', {
		background: design !== 'plain',
	}, design, props )

	const designHasBackground = design === 'basic'

	const mainClasses = classnames( [
		// className,
		className.split( ' ' ).filter( name => name !== 'ugb-count-up' ),
		'ugb-countup',
		'ugb-countup--v3', // For backward compatibility.
		`ugb-countup--columns-${ columns }`,
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.count-up.mainclasses_1_15_4', {
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb-countup--design-${ design }` ]: design !== 'plain',
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow !== 3,
		[ `ugb--has-background-gradient` ]: design === 'basic' && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: design === 'basic' && backgroundType === 'video',
	}, design, props ) )

	const backgroundStyle = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const mainStyle = applyFilters( 'stackable.count-up.mainstyle_1_15_4', {
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		...backgroundStyle,
	}, design, props )

	const countStyle = {
		color: countColor ? countColor : undefined,
		fontSize: countSize ? countSize + 'px' : undefined,
		fontWeight: countFontWeight ? countFontWeight : undefined,
	}
	if ( countFont && countFont !== 'theme' ) {
		countStyle.fontFamily = getFontFamily( countFont )
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ show.background && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.count-up.save.output.before_1_15_4', null, design, props ) }
			<div className="ugb-content-wrapper">
				{ range( 1, columns + 1 ).map( i => {
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const countText = attributes[ `countText${ i }` ]

					const titleComp = ! RichText.isEmpty( title ) && (
						<RichText.Content
							tagName="h4"
							className="ugb-countup__title"
							style={ { color: textColor ? textColor : undefined } }
							value={ title }
						/>
					)
					const countComp = ! RichText.isEmpty( countText ) && (
						<RichText.Content
							tagName="div"
							className="ugb-countup__counter"
							style={ countStyle }
							value={ countText }
							data-duration="1000"
							data-delay="16"
						/>
					)
					const descriptionComp = ! RichText.isEmpty( description ) && (
						<RichText.Content
							tagName="p"
							className="ugb-countup__description"
							style={ { color: textColor ? textColor : undefined } }
							value={ description }
						/>
					)
					const comps = {
						i,
						titleComp,
						countComp,
						descriptionComp,
					}
					return applyFilters( 'stackable.count-up.save.output_1_15_4', (
						<div className="ugb-countup__item" key={ i }>
							{ titleComp }
							{ countComp }
							{ descriptionComp }
						</div>
					), comps, i, props )
				} ) }
			</div>
		</div>
	)
}

export const deprecatedSchema_1_15_4 = {
	columns: {
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
	title1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__title',
		default: __( 'Title' ),
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__description',
		default: __( 'Description' ),
	},
	textColor: {
		type: 'string',
	},
	countColor: {
		type: 'string',
	},
	countSize: {
		type: 'number',
		default: 40,
	},
	countFont: {
		type: 'string',
		default: 'theme',
	},
	countFontWeight: {
		type: 'string',
		default: '400',
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
	title: {
		type: 'string',
	},
	counter: {
		type: 'string',
	},
	des: {
		type: 'string',
	},
	fontSize: {
		type: 'number',
	},
	headingColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	color: {
		type: 'string',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15_4,
		save: deprecatedSave_1_15_4,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' ).replace( /\.ugb-countup([\s\{\[\.\#\:])/g, '.ugb-count-up$1' )

			return {
				...attributes,
				columns: attributes.columns ? attributes.columns : 4,
				// New column background attribute names.
				columnBackgroundColorType: attributes.backgroundColorType ? attributes.backgroundColorType : undefined,
				columnBackgroundColor: attributes.backgroundColor ? attributes.backgroundColor : undefined,
				columnBackgroundColor2: attributes.backgroundColor2 ? attributes.backgroundColor2 : undefined,
				columnBackgroundGradientDirection: attributes.backgroundColorDirection ? attributes.backgroundColorDirection : undefined,
				columnBackgroundMediaID: attributes.backgroundImageID ? attributes.backgroundImageID : undefined,
				columnBackgroundMediaURL: attributes.backgroundImageURL ? attributes.backgroundImageURL : undefined,
				columnBackgroundTintStrength: attributes.backgroundOpacity ? attributes.backgroundOpacity : undefined,
				columnFixedBackground: attributes.fixedBackground ? attributes.fixedBackground : undefined,
				// Counter & Text.
				numberColor: attributes.countColor ? attributes.countColor : undefined,
				numberFontSize: attributes.countSize ? attributes.countSize : undefined,
				numberFontFamily: attributes.countFont === 'theme' ? '' : ( attributes.countFont ? attributes.countFont : undefined ),
				numberFontWeight: attributes.countFontWeight ? attributes.countFontWeight : undefined,
				titleColor: attributes.textColor ? attributes.textColor : undefined,
				descriptionColor: attributes.textColor ? attributes.textColor : undefined,
				// Full-width support.
				showBlockBackground: attributes.align === 'full' && attributes.design === 'basic' ? true : undefined, // attributes.contentWidth
				blockInnerWidth: attributes.align !== 'full' ? undefined : ( attributes.contentWidth === true ? 'center' : 'full' ),
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
