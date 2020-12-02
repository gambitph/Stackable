/**
 * Internal dependencies
 */
import SVGArrow from './images/arrow.svg'

/**
 * External dependencies
 */
import { range } from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'

const deprecatedSchema_1_17_3 = {
	align: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	overlayColor: {
		type: 'string',
	},
	width: {
		type: 'number',
		default: 400,
	},
	height: {
		type: 'number',
		default: 400,
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	horizontalAlign: {
		type: 'string',
		default: 'center',
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
	overlayOpacity: {
		type: 'number',
		default: 7,
	},
	imageHoverEffect: {
		type: 'string',
		default: '',
	},
	arrow: {
		type: 'string',
		default: '',
	},
	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	full: {
		type: 'boolean',
	},
	title: {
		type: 'string',
	},
	subtitle: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
	},
	href: {
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

// Wrap in curly or else statement will merge with the previous one and will error out.
{ [ 1, 2, 3, 4 ].forEach( i => {
	deprecatedSchema_1_17_3[ `title${ i }` ] = {
		source: 'html',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__title`,
		default: __( 'Title', i18n ),
	}
	deprecatedSchema_1_17_3[ `description${ i }` ] = {
		source: 'html',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__description`,
		default: __( 'Description', i18n ),
	}
	deprecatedSchema_1_17_3[ `imageURL${ i }` ] = {
		type: 'string',
	}
	deprecatedSchema_1_17_3[ `imageID${ i }` ] = {
		type: 'number',
	}
	deprecatedSchema_1_17_3[ `link${ i }` ] = {
		type: 'string',
		source: 'attribute',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__overlay`,
		attribute: 'href',
		default: '',
	}
	deprecatedSchema_1_17_3[ `newTab${ i }` ] = {
		type: 'boolean',
		source: 'attribute',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__overlay`,
		attribute: 'target',
		default: false,
	}
} ) }

const deprecatedSave_1_17_3 = props => {
	const { className, attributes } = props
	const {
		titleColor,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		align,
		columns,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		imageHoverEffect = '',
		overlayOpacity = 7,
		arrow = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box',
		'ugb-image-box--v3',
		`ugb-image-box--columns-${ columns }`,
	], applyFilters( 'stackable.image-box.mainclasses_1_17_3', {
		[ `ugb-image-box--design-${ design }` ]: design !== 'basic',
		[ `ugb-image-box--effect-${ imageHoverEffect }` ]: imageHoverEffect,
		[ `ugb-image-box--overlay-${ overlayOpacity }` ]: overlayOpacity !== 7,
		'ugb-image-box--arrow': arrow,
	}, design, props ) )

	const mainStyles = {
		textAlign: horizontalAlign ? horizontalAlign : undefined,
		'--overlay-color': overlayColor,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
			{ applyFilters( 'stackable.image-box.save.output.before_1_17_3', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const imageURL = attributes[ `imageURL${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const link = attributes[ `link${ i }` ]
				const newTab = attributes[ `newTab${ i }` ]

				const boxStyles = {
					backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
					maxWidth: align !== 'wide' && align !== 'full' && columns === 1 ? width : undefined,
					height,
					textAlign: horizontalAlign,
					justifyContent: verticalAlign,
					borderRadius,
				}

				const boxClasses = classnames( [
					'ugb-image-box__item',
				], applyFilters( 'stackable.image-box.itemclasses_1_17_3', {
					[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
				}, design, i, props ) )

				const arrowClasses = classnames( [
					'ugb-image-box__arrow',
					`ugb-image-box__arrow--align-${ arrow }`,
				] )

				return (
					<div className={ boxClasses } style={ boxStyles } key={ i }>
						{ imageHoverEffect && <div
							className="ugb-image-box__image-effect"
							style={ {
								backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
							} } />
						}
						{ /* eslint-disable-next-line */ }
						<a
							className="ugb-image-box__overlay"
							href={ link }
							target={ newTab ? '_blank' : undefined }
						/>
						<div className="ugb-image-box__content">
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h4"
									className="ugb-image-box__title"
									style={ { color: titleColor } }
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-image-box__description"
									style={ { color: subtitleColor } }
									value={ description }
								/>
							) }
						</div>
						{ arrow && link && (
							<div className={ arrowClasses }>
								<SVGArrow style={ { fill: titleColor ? titleColor : undefined } } />
							</div>
						) }
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.image-box.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const deprecatedSave_1_17_3_ = ( hasTitleStyle = true, hasDescriptionStyle = true ) => props => {
	const { className, attributes } = props
	const {
		titleColor,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		align,
		columns,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		imageHoverEffect = '',
		overlayOpacity = 7,
		arrow = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box',
		'ugb-image-box--v3',
		`ugb-image-box--columns-${ columns }`,
	], applyFilters( 'stackable.image-box.mainclasses_1_17_3', {
		[ `ugb-image-box--design-${ design }` ]: design !== 'basic',
		[ `ugb-image-box--effect-${ imageHoverEffect }` ]: imageHoverEffect,
		[ `ugb-image-box--overlay-${ overlayOpacity }` ]: overlayOpacity !== 7,
		'ugb-image-box--arrow': arrow,
	}, design, props ) )

	const mainStyles = {
		textAlign: horizontalAlign ? horizontalAlign : undefined,
		'--overlay-color': overlayColor,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
			{ applyFilters( 'stackable.image-box.save.output.before_1_17_3', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const imageURL = attributes[ `imageURL${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const link = attributes[ `link${ i }` ]
				const newTab = attributes[ `newTab${ i }` ]

				const boxStyles = {
					backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
					maxWidth: align !== 'wide' && align !== 'full' && columns === 1 ? width : undefined,
					height,
					textAlign: horizontalAlign,
					justifyContent: verticalAlign,
					borderRadius,
				}

				const boxClasses = classnames( [
					'ugb-image-box__item',
				], applyFilters( 'stackable.image-box.itemclasses_1_17_3', {
					[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
				}, design, i, props ) )

				const arrowClasses = classnames( [
					'ugb-image-box__arrow',
					`ugb-image-box__arrow--align-${ arrow }`,
				] )

				return (
					<div className={ boxClasses } style={ boxStyles } key={ i }>
						{ imageHoverEffect && <div
							className="ugb-image-box__image-effect"
							style={ {
								backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
							} } />
						}
						{ /* eslint-disable-next-line */ }
						<a
							className="ugb-image-box__overlay"
							href={ link }
							target={ newTab ? '_blank' : undefined }
						/>
						<div className="ugb-image-box__content">
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h4"
									className="ugb-image-box__title"
									style={ hasTitleStyle ? { color: titleColor } : undefined }
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-image-box__description"
									style={ hasDescriptionStyle ? { color: subtitleColor } : undefined }
									value={ description }
								/>
							) }
						</div>
						{ arrow && link && (
							<div className={ arrowClasses }>
								<SVGArrow style={ { fill: titleColor ? titleColor : undefined } } />
							</div>
						) }
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.image-box.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const migrate_1_17_3 = attributes => {
	// Update the custom CSS since the structure has changed.
	const updateCSS = css => ( css || '' )
		.replace( /\.ugb-image-box__overlay(\s*{)/g, '.ugb-image-box__overlay-hover$1' )

	// try and get full image url & dimensions.

	return {
		...attributes,

		// Custom CSS.
		customCSS: updateCSS( attributes.customCSS ),
		customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

		// width option when there's only 1 column.
		blockWidth: attributes.columns === 1 && attributes.align !== 'full' ? attributes.width : undefined, // Old width is the same as the block width option.
		columnHeight: attributes.height,
		columnContentVerticalAlign: attributes.verticalAlign,
		contentAlign: attributes.horizontalAlign,

		// Link.
		link1Url: attributes.link1,
		link2Url: attributes.link2,
		link3Url: attributes.link3,
		link4Url: attributes.link4,
		link1NewTab: attributes.newTab1,
		link2NewTab: attributes.newTab2,
		link3NewTab: attributes.newTab3,
		link4NewTab: attributes.newTab4,

		// Image.
		image1Id: attributes.imageID1,
		image2Id: attributes.imageID2,
		image3Id: attributes.imageID3,
		image4Id: attributes.imageID4,
		image1Url: attributes.imageURL1,
		image2Url: attributes.imageURL2,
		image3Url: attributes.imageURL3,
		image4Url: attributes.imageURL4,
		image1FullUrl: attributes.imageURL1,
		image2FullUrl: attributes.imageURL2,
		image3FullUrl: attributes.imageURL3,
		image4FullUrl: attributes.imageURL4,
		imageSize: 'full',

		// Overlay.
		showOverlay: false,

		// Overlay hover.
		showOverlayHover: true,
		overlayHoverBackgroundColor: attributes.overlayColor,
		overlayHoverOpacity: isNaN( parseInt( attributes.overlayOpacity, 10 ) ) ? 0.7 : parseInt( attributes.overlayOpacity, 10 ) / 10,

		// Arrow.
		showArrow: !! attributes.arrow,
		arrowAlign: attributes.arrow ? attributes.arrow : undefined,
		arrowColor: attributes.titleColor,

		// Description.
		descriptionColor: attributes.subtitleColor,

		// Subtitle.
		showSubtitle: false,

		// Full width & 1 column.
		borderRadius: attributes.columns === 1 && attributes.align === 'full' ? 0 : attributes.borderRadius,
		paddingRight: attributes.columns === 1 && attributes.align === 'full' ? 0 : undefined,
		paddingLeft: attributes.columns === 1 && attributes.align === 'full' ? 0 : undefined,
	}
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: migrate_1_17_3,
	},

	/**
	 * If you blank the title color and/or subtitle color in v1.17.3,
	 * the block will error out. These deprecation methods will fix those
	 * errored blocks.
	 *
	 * How? Since the migration fails because the saved html didn't have a
	 * style attribute for the title, the block save doesn't match.
	 * To fix, we create a new save method that doesn't have the style attribute
	 * to make the save method match.
	 */
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3_( false, false ),
		migrate: migrate_1_17_3,
	},
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3_( true, false ),
		migrate: migrate_1_17_3,
	},
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3_( false, true ),
		migrate: migrate_1_17_3,
	},
]

export default deprecated
