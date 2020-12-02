/**
 * External dependencies
 */
import { descriptionPlaceholder, range } from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { RichText } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'

/**
 * Internal dependecies
 */
import schema from './schema'
import save from './save'

const deprecatedSchema_1_17_3 = {
	href1: {
		type: 'url',
	},
	href2: {
		type: 'url',
	},
	href3: {
		type: 'url',
	},
	mediaID1: {
		type: 'number',
	},
	mediaID2: {
		type: 'number',
	},
	mediaID3: {
		type: 'number',
	},
	mediaURL1: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member__item:nth-of-type(1) .ugb-team-member__image',
		attribute: 'data-src',
		default: '',
	},
	mediaURL2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member__item:nth-of-type(2) .ugb-team-member__image',
		attribute: 'data-src',
		default: '',
	},
	mediaURL3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member__item:nth-of-type(3) .ugb-team-member__image',
		attribute: 'data-src',
		default: '',
	},
	name1: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(1) .ugb-team-member__name',
		default: __( 'Name', i18n ),
	},
	name2: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(2) .ugb-team-member__name',
		default: __( 'Name', i18n ),
	},
	name3: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(3) .ugb-team-member__name',
		default: __( 'Name', i18n ),
	},
	position1: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(1) .ugb-team-member__position',
		default: __( 'Position', i18n ),
	},
	position2: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(2) .ugb-team-member__position',
		default: __( 'Position', i18n ),
	},
	position3: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(3) .ugb-team-member__position',
		default: __( 'Position', i18n ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(1) .ugb-team-member__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(2) .ugb-team-member__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-of-type(3) .ugb-team-member__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	nameColor: {
		type: 'string',
	},
	posColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	shapes: {
		type: 'string',
		default: 'circle',
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
	colorOnHover: {
		type: 'boolean',
		default: false,
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
	href: {
		type: 'url',
	},
	hrefTwo: {
		type: 'url',
	},
	hrefThree: {
		type: 'url',
	},
	mediaID: {
		type: 'number',
	},
	mediaIDTwo: {
		type: 'number',
	},
	mediaIDThree: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
	},
	mediaURLTwo: {
		type: 'string',
	},
	mediaURLThree: {
		type: 'string',
	},
	name: {
		type: 'string',
	},
	nameTwo: {
		type: 'string',
	},
	nameThree: {
		type: 'string',
	},
	position: {
		type: 'string',
	},
	positionTwo: {
		type: 'string',
	},
	positionThree: {
		type: 'string',
	},
	des: {
		type: 'string',
	},
	desTwo: {
		type: 'string',
	},
	desThree: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	align: {
		type: 'string',
	},
}

const deprecatedSave_1_17_3 = props => {
	const { className, attributes } = props
	const {
		shapes,
		nameColor,
		posColor,
		desColor,
		columns = 2,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-team-member',
		'ugb-team-member--v2',
		`ugb-team-member--columns-${ columns }`,
		`ugb-team-member--image-${ shapes }`,
		`ugb-team-member--design-${ design }`,
	], applyFilters( 'stackable.team-member.mainclasses_1_17_3', {}, design, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.team-member.save.output.before_1_17_3', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				// const href = attributes[ `href${i}` ]
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const description = attributes[ `description${ i }` ]

				const itemClasses = classnames( [
					'ugb-team-member__item',
				], applyFilters( 'stackable.team-member.itemclasses_1_17_3', {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
				}, design, i, props ) )

				const styles = applyFilters( 'stackable.team-member.itemstyles_1_17_3', {
					item: {
						borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
					},
				}, design, i, props )

				const imageComp = mediaURL && (
					<div className="ugb-team-member__image"
						style={ { backgroundImage: mediaURL ? `url(${ mediaURL })` : undefined } }
						data-src={ mediaURL ? mediaURL : undefined }
					/>
				)
				const nameComp = ! RichText.isEmpty( name ) && (
					<RichText.Content
						tagName="h4"
						className="ugb-team-member__name"
						style={ { color: nameColor } }
						value={ name }
					/>
				)
				const positionComp = ! RichText.isEmpty( position ) && (
					<RichText.Content
						tagName="p"
						className="ugb-team-member__position"
						style={ { color: posColor } }
						value={ position }
					/>
				)
				const descriptionComp = ! RichText.isEmpty( description ) && (
					<RichText.Content
						tagName="p"
						className="ugb-team-member__description"
						style={ { color: desColor } }
						value={ description }
					/>
				)
				const comps = {
					imageComp,
					nameComp,
					positionComp,
					descriptionComp,
				}

				return (
					<div className={ itemClasses } style={ styles.item } key={ i }>
						{ applyFilters( 'stackable.team-member.save.output_1_17_3', (
							<Fragment>
								{ imageComp }
								<div className="ugb-team-member__content">
									{ nameComp }
									{ positionComp }
									{ descriptionComp }
								</div>
							</Fragment>
						), design, comps, i, props ) }
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.team-member.save.output.after', null, design, props ) }
		</div>
	)
}

const deprecated = [
	{
		attributes: {
			...schema,
			design: {
				type: 'string',
				default: 'basic',
			},
		},
		save,
		migrate: attributes => {
			return {
				...attributes,
				design: attributes.design || 'basic',
			}
		},
	},
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			// We have definite image sizes in v1, preserve their sizes.
			let imageWidth
			if ( ! attributes.design || [ 'basic', 'plain' ].includes( attributes.design ) ) {
				imageWidth = attributes.columns === 1 ? 300 :
					attributes.columns === 3 ? 150 :
						220
			} else if ( attributes.design === 'horizontal' ) {
				imageWidth = attributes.columns === 1 ? 150 :
					attributes.columns === 3 ? 80 :
						110
			}

			return {
				...attributes,

				showSocial: false,
				showFacebook: true,
				showTwitter: true,
				showInstagram: true,
				showEmail: true,

				social1FacebookUrl: '#',
				social1TwitterUrl: '#',
				social1InstagramUrl: '#',
				social1EmailUrl: 'my@email.com',
				social2FacebookUrl: '#',
				social2TwitterUrl: '#',
				social2InstagramUrl: '#',
				social2EmailUrl: 'my@email.com',
				social3FacebookUrl: '#',
				social3TwitterUrl: '#',
				social3InstagramUrl: '#',
				social3EmailUrl: 'my@email.com',

				image1Id: attributes.mediaID1,
				image2Id: attributes.mediaID2,
				image3Id: attributes.mediaID3,
				image1Url: attributes.mediaURL1,
				image2Url: attributes.mediaURL2,
				image3Url: attributes.mediaURL3,
				positionColor: attributes.posColor,
				descriptionColor: attributes.desColor,
				imageShape: attributes.shapes === 'square' ? 'square' : 'circle',
				imageColorOnHover: attributes.colorOnHover,
				imageWidth,
				imageSquare: imageWidth ? true : undefined,
			}
		},
	},
]

export default deprecated
