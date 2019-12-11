/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_15_5,
} from '~stackable/components/button-edit'
import { descriptionPlaceholder, range } from '~stackable/util'
import classnames from 'classnames'
import { i18n, contentWidth } from 'stackable'
import striptags from 'striptags'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const deprecatedSave_1_17_2 = props => {
	const { attributes, className } = props
	const {
		columns,
		imageSize,
		design,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonDesign = 'link',
		buttonIcon,
		borderRadius = 12,
		shadow = 3,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature-grid',
		`ugb-feature-grid--columns-${ columns }`,
	], applyFilters( 'stackable.feature-grid.mainclasses_1_17_2', {
		[ `ugb-feature-grid--design-${ design }` ]: design && design !== 'basic',
	}, design, props ) )

	const itemStyle = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.feature-grid.edit.output.before_1_17_2', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const imageUrl = attributes[ `imageUrl${ i }` ]
				const imageAlt = attributes[ `imageAlt${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const linkUrl = attributes[ `linkUrl${ i }` ]
				const newTab = attributes[ `newTab${ i }` ]
				const linkText = attributes[ `linkText${ i }` ]

				const itemClasses = classnames( [
					'ugb-feature-grid__item',
				], applyFilters( 'stackable.feature-grid.itemclasses_1_17_2', {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
				}, design, i, props ) )

				const itemStyles = applyFilters( 'stackable.feature-grid.itemstyles_1_17_2', {
					image: {
						width: imageUrl ? `${ imageSize }%` : undefined,
					},
				}, design, i, props )

				return (
					<div className={ itemClasses } style={ itemStyle } key={ i }>
						{ imageUrl &&
							<div className="ugb-feature-grid__image">
								<img
									src={ imageUrl }
									style={ itemStyles.image }
									alt={ striptags( title ? title : imageAlt ) }
								/>
							</div>
						}
						<div className="ugb-feature-grid__content">
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h5"
									className="ugb-feature-grid__title"
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-feature-grid__description"
									value={ description }
								/>
							) }
							{ ! RichText.isEmpty( linkText ) && (
								<DeprecatedButtonContent_1_15_5
									size={ buttonSize }
									url={ linkUrl }
									newTab={ newTab }
									// align={ contentAlign }
									color={ buttonTextColor }
									text={ linkText }
									icon={ buttonIcon }
									design={ buttonDesign }
									backgroundColor={ buttonColor }
									borderRadius={ buttonBorderRadius }
								/>
							) }
						</div>
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.feature-grid.edit.output.after_1_17_2', null, design, props ) }
		</div>
	)
}

export const deprecatedSchema_1_17_2 = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	imageSize: {
		type: 'number',
		default: 100,
	},
	imageID1: {
		type: 'number',
	},
	imageID2: {
		type: 'number',
	},
	imageID3: {
		type: 'number',
	},
	imageUrl1: {
		type: 'url',
	},
	imageUrl2: {
		type: 'url',
	},
	imageUrl3: {
		type: 'url',
	},
	imageAlt1: {
		type: 'string',
	},
	imageAlt2: {
		type: 'string',
	},
	imageAlt3: {
		type: 'string',
	},
	title1: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-feature-grid__title',
		default: __( 'Title', i18n ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-feature-grid__title',
		default: __( 'Title', i18n ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-feature-grid__title',
		default: __( 'Title', i18n ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-feature-grid__description',
		default: descriptionPlaceholder( 'short' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-feature-grid__description',
		default: descriptionPlaceholder( 'short' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-feature-grid__description',
		default: descriptionPlaceholder( 'short' ),
	},
	linkUrl1: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-button',
		attribute: 'href',
		default: '',
	},
	linkUrl2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-button',
		attribute: 'href',
		default: '',
	},
	linkUrl3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab1: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-button',
		attribute: 'target',
		default: false,
	},
	newTab2: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-button',
		attribute: 'target',
		default: false,
	},
	newTab3: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-button',
		attribute: 'target',
		default: false,
	},
	linkText1: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	linkText2: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	linkText3: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonSize: {
		type: 'string',
		default: 'normal',
	},
	buttonBorderRadius: {
		type: 'number',
		default: 4,
	},
	buttonDesign: {
		type: 'string',
		default: 'link',
	},
	buttonIcon: {
		type: 'string',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	hoverEffect: {
		type: 'string',
		default: '',
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

const deprecatedSave_1_10 = props => {
	const { attributes, className } = props
	const {
		columns,
		imageSize,
		design,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature-grid',
		`columns-${ columns }`,
	], {
		[ `ugb-design-${ design }` ]: design && design !== 'basic',
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				const imageUrl = attributes[ `imageUrl${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const linkUrl = attributes[ `linkUrl${ i }` ]
				const linkText = attributes[ `linkText${ i }` ]
				return (
					<div className={ `ugb-feature-grid-item` } key={ i }>
						{ imageUrl && <img src={ imageUrl } style={ { width: `${ imageSize }%` } } alt={ title } /> }
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h5"
								className="ugb-fg-title"
								value={ title }
							/>
						) }
						{ ! RichText.isEmpty( description ) && (
							<RichText.Content
								tagName="p"
								className="ugb-fg-description"
								value={ description }
							/>
						) }
						{ ! RichText.isEmpty( linkText ) && (
							<p>
								<RichText.Content
									tagName="a"
									href={ linkUrl }
									value={ linkText }
									className="ugb-fg-link"
								/>
							</p>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	imageSize: {
		type: 'number',
		default: 100,
	},
	imageID1: {
		type: 'number',
	},
	imageID2: {
		type: 'number',
	},
	imageID3: {
		type: 'number',
	},
	imageUrl1: {
		type: 'url',
	},
	imageUrl2: {
		type: 'url',
	},
	imageUrl3: {
		type: 'url',
	},
	title1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) h5',
		default: 'Title',
	},
	title2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) h5',
		default: 'Title',
	},
	title3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) h5',
		default: 'Title',
	},
	description1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-description',
		default: descriptionPlaceholder( 'short' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-description',
		default: descriptionPlaceholder( 'short' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-description',
		default: descriptionPlaceholder( 'short' ),
	},
	linkUrl1: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-link',
		attribute: 'href',
	},
	linkUrl2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-link',
		attribute: 'href',
	},
	linkUrl3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-link',
		attribute: 'href',
	},
	linkText1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-link',
		default: 'Button text',
	},
	linkText2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-link',
		default: 'Button text',
	},
	linkText3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-link',
		default: 'Button text',
	},
}

export const deprecatedSave_1_9 = props => {
	const { attributes, className } = props
	const {
		columns,
		imageSize,
		design,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature-grid',
		`columns-${ columns }`,
	], {
		[ `ugb-design-${ design }` ]: design && design !== 'basic',
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				const imageUrl = attributes[ `imageUrl${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const linkUrl = attributes[ `linkUrl${ i }` ]
				const linkText = attributes[ `linkText${ i }` ]
				return (
					<div className={ `ugb-feature-grid-item` } key={ i }>
						{ /* eslint-disable-next-line */ }
						{ imageUrl && <img src={ imageUrl } style={ { width: `${ imageSize }%` } } /> }
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h5"
								className="ugb-fg-title"
								value={ title }
							/>
						) }
						{ ! RichText.isEmpty( description ) && (
							<RichText.Content
								tagName="p"
								className="ugb-fg-description"
								value={ description }
							/>
						) }
						{ ! RichText.isEmpty( linkText ) && (
							<p>
								<RichText.Content
									tagName="a"
									href={ linkUrl }
									value={ linkText }
									className="ugb-fg-link"
								/>
							</p>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

export const deprecatedSchema_1_9 = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	imageSize: {
		type: 'number',
		default: 100,
	},
	imageID1: {
		type: 'number',
	},
	imageID2: {
		type: 'number',
	},
	imageID3: {
		type: 'number',
	},
	imageUrl1: {
		type: 'url',
	},
	imageUrl2: {
		type: 'url',
	},
	imageUrl3: {
		type: 'url',
	},
	title1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) h5',
		default: 'Feature 1',
	},
	title2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) h5',
		default: 'Feature 2',
	},
	title3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) h5',
		default: 'Feature 3',
	},
	description1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-description',
		default: 'Some feature description for an awesome feature',
	},
	description2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-description',
		default: 'Some feature description for an awesome feature',
	},
	description3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-description',
		default: 'Some feature description for an awesome feature',
	},
	linkUrl1: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-link',
		attribute: 'href',
	},
	linkUrl2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-link',
		attribute: 'href',
	},
	linkUrl3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-link',
		attribute: 'href',
	},
	linkText1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-link',
		default: 'View More',
	},
	linkText2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-link',
		default: 'View More',
	},
	linkText3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-link',
		default: 'View More',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_2,
		save: deprecatedSave_1_17_2,
		migrate: attributes => {
			// Compute for the imageWidth. We are assuming some widths here.
			let imageWidth
			if ( attributes.imageSize && attributes.design !== 'horizontal' ) {
				const maxContentWidth = attributes.align !== 'wide' ? ( contentWidth || 900 ) : 1200
				const columnGap = 35 // V1 has this as a fixed value.
				const columnPaddings = attributes.design === 'plain' ? 0 : 70 // V1 has this as a fixed value.
				const columnContentWidth = attributes.columns === 1 ? maxContentWidth - columnPaddings :
					attributes.columns === 2 ? ( ( maxContentWidth - columnGap ) / 2 ) - columnPaddings :
						( ( maxContentWidth - ( columnGap * 2 ) ) / 3 ) - columnPaddings
				imageWidth = parseInt( ( parseInt( attributes.imageSize, 10 ) || 100 ) / 100 * columnContentWidth, 10 )
			}

			return {
				...attributes,
				image1Id: attributes.imageID1,
				image2Id: attributes.imageID2,
				image3Id: attributes.imageID3,
				image1Url: attributes.imageUrl1,
				image2Url: attributes.imageUrl2,
				image3Url: attributes.imageUrl3,
				image1Alt: attributes.imageAlt1,
				image2Alt: attributes.imageAlt2,
				image3Alt: attributes.imageAlt3,
				button1Url: attributes.linkUrl1,
				button2Url: attributes.linkUrl2,
				button3Url: attributes.linkUrl3,
				button1NewTab: attributes.newTab1,
				button2NewTab: attributes.newTab2,
				button3NewTab: attributes.newTab3,
				button1Text: attributes.linkText1,
				button2Text: attributes.linkText2,
				button3Text: attributes.linkText3,
				buttonBackgroundColor: attributes.buttonColor,
				imageWidth,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				buttonDesign: 'link',
				buttonSize: 'normal',
				buttonBorderRadius: 4,
				borderRadius: 12,
				shadow: 3,
				newTab1: false,
				newTab2: false,
				newTab3: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9,
		save: deprecatedSave_1_9,
	},
]

export default deprecated
