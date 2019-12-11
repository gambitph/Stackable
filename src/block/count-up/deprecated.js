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

const deprecatedSchema_1_10 = {
	columns: {
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
	title1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(1) h4',
		default: 'Title',
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(2) h4',
		default: 'Title',
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(3) h4',
		default: 'Title',
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(4) h4',
		default: 'Title',
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(1) .ugb-counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(2) .ugb-counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(3) .ugb-counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(4) .ugb-counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(1) p',
		default: 'Description',
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(2) p',
		default: 'Description',
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(3) p',
		default: 'Description',
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(4) p',
		default: 'Description',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	title: {
		source: 'html',
		selector: 'h4',
	},
	counter: {
		source: 'html',
		selector: '.ugb-counter',
	},
	des: {
		source: 'html',
		selector: 'p',
	},
	fontSize: {
		type: 'number',
		default: 60,
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

const deprecatedSave_1_10 = props => {
	const { className, attributes } = props
	const {
		columns,
		backgroundColor,
		backgroundImageURL,
		fixedBackground,
		backgroundOpacity = 5,
		textColor,
		countColor,
		countSize,
		contentWidth,
		design,
		align,
		borderRadius,
		shadow,
		countFont,
		countFontWeight,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
		'ugb-countup-v3', // For backward compatibility.
		`columns-${ columns }`,
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		// 'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		[ `ugb-design-${ design }` ]: design !== 'plain',
		[ `ugb-shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const mainStyle = {
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	const countStyle = {
		color: countColor ? countColor : undefined,
		fontSize: countSize ? countSize + 'px' : undefined,
		// fontFamily: countFont && countFont !== 'theme' ? getFontFamily( countFont ) : undefined,
		fontWeight: countFontWeight ? countFontWeight : undefined,
	}
	if ( countFont && countFont !== 'theme' ) {
		countStyle.fontFamily = getFontFamily( countFont )
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ range( 1, columns + 1 ).map( i => {
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const countText = attributes[ `countText${ i }` ]
					return (
						<div className="ugb-countup-item" key={ i }>
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h4"
									style={ { color: textColor ? textColor : undefined } }
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( countText ) && (
								<RichText.Content
									tagName="div"
									className="ugb-counter"
									style={ countStyle }
									value={ countText }
									data-duration="1000"
									data-delay="16"
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									style={ { color: textColor ? textColor : undefined } }
									value={ description }
								/>
							) }
						</div>
					)
				} ) }
			</div>
		</div>
	)
}

const deprecatedSchema_1_9_1 = {
	columns: {
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
	title1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(1) h4',
		default: 'Stat Title',
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(2) h4',
		default: 'Stat Title',
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(3) h4',
		default: 'Stat Title',
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(4) h4',
		default: 'Stat Title',
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(1) .ugb-counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(2) .ugb-counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(3) .ugb-counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(4) .ugb-counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(1) p',
		default: 'stat description',
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(2) p',
		default: 'stat description',
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(3) p',
		default: 'stat description',
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup-item:nth-of-type(4) p',
		default: 'stat description',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	title: {
		source: 'html',
		selector: 'h4',
		default: 'Happy Customers',
	},
	counter: {
		source: 'html',
		selector: '.ugb-counter',
		default: '12,345',
	},
	des: {
		source: 'html',
		selector: 'p',
		default: 'and counting',
	},
	fontSize: {
		type: 'number',
		default: 60,
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

const deprecatedSave_1_9_1 = props => {
	const { className, attributes } = props
	const {
		columns,
		backgroundColor,
		backgroundImageURL,
		fixedBackground,
		backgroundOpacity = 5,
		textColor,
		countColor,
		countSize,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
		'ugb-countup-v2', // For backward compatibility.
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
			{ range( 1, columns + 1 ).map( i => {
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const countText = attributes[ `countText${ i }` ]
				return (
					<div className="ugb-countup-item" key={ i }>
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h4"
								style={ { color: textColor ? textColor : undefined } }
								value={ title }
							/>
						) }
						{ ! RichText.isEmpty( countText ) && (
							<RichText.Content
								tagName="div"
								className="ugb-counter"
								style={ {
									color: countColor ? countColor : undefined,
									fontSize: countSize ? countSize + 'px' : undefined,
								} }
								value={ countText }
								data-duration="1000"
								data-delay="16"
							/>
						) }
						{ ! RichText.isEmpty( description ) && (
							<RichText.Content
								tagName="p"
								style={ { color: textColor ? textColor : undefined } }
								value={ description }
							/>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

export const deprecatedSchema_1_4 = {
	title: {
		source: 'html',
		selector: 'h4',
		default: 'Happy Customers',
	},
	counter: {
		source: 'html',
		selector: '.ugb-counter',
		default: '12,345',
	},
	des: {
		source: 'html',
		selector: 'p',
		default: 'and counting',
	},
	fontSize: {
		type: 'number',
		default: 60,
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

export const deprecatedSave_1_4 = props => {
	const { className } = props
	const {
		color, headingColor, desColor, title, counter, des, fontSize,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
	] )

	return (
		<div className={ mainClasses }>
			<RichText.Content
				tagName="h4"
				style={ { color: headingColor } }
				value={ title }
			/>
			<RichText.Content
				tagName="div"
				className="ugb-counter"
				style={ { color, fontSize: fontSize + 'px' } }
				value={ counter }
				data-duration="1000"
				data-delay="16"
			/>
			<RichText.Content
				tagName="p"
				style={ { color: desColor } }
				value={ des }
			/>
		</div>
	)
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
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
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
		attributes: deprecatedSchema_1_9_1,
		save: deprecatedSave_1_9_1,
		migrate: attributes => {
			const className = ( attributes.className || '' )
			                  .replace( /align\w+/, '' )
			                  .replace( /\s+/, ' ' )
			                  .trim()
			return {
				...attributes,
				design: attributes.backgroundColor ? 'basic' : 'plain',
				borderRadius: 12,
				shadow: 3,
				contentWidth: false,
				countFont: 'theme',
				countFontWeight: '400',
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
				columns: 1,
				title1: attributes.title,
				description1: attributes.des,
				countText1: attributes.counter,
				textColor: attributes.headingColor,
				countColor: attributes.color,
				countSize: attributes.fontSize,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
]

export default deprecated
