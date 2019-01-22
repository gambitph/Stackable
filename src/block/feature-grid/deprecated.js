import { descriptionPlaceholder, range } from '@stackable/util'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { RichText } from '@wordpress/editor'

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
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) h5',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) h5',
		default: __( 'Title' ),
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
		default: __( 'Button text' ),
	},
	linkText2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-link',
		default: __( 'Button text' ),
	},
	linkText3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-link',
		default: __( 'Button text' ),
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
		default: __( 'Feature 1' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) h5',
		default: __( 'Feature 2' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) h5',
		default: __( 'Feature 3' ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(1) .ugb-fg-description',
		default: __( 'Some feature description for an awesome feature' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-description',
		default: __( 'Some feature description for an awesome feature' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-description',
		default: __( 'Some feature description for an awesome feature' ),
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
		default: __( 'View More' ),
	},
	linkText2: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(2) .ugb-fg-link',
		default: __( 'View More' ),
	},
	linkText3: {
		source: 'html',
		selector: '.ugb-feature-grid > *:nth-child(3) .ugb-fg-link',
		default: __( 'View More' ),
	},
}

const deprecated = [
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
