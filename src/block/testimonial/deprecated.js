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
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'

/**
 * Internal dependencies
 */
import schema from './schema'
import save from './save'

const deprecatedSchema_1_17_3 = {
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
	},
	mediaURL2: {
		type: 'string',
	},
	mediaURL3: {
		type: 'string',
	},
	name1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(1) .ugb-testimonial__name',
		default: __( 'Name', i18n ),
	},
	name2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(2) .ugb-testimonial__name',
		default: __( 'Name', i18n ),
	},
	name3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(3) .ugb-testimonial__name',
		default: __( 'Name', i18n ),
	},
	position1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(1) .ugb-testimonial__position',
		default: __( 'Position', i18n ),
	},
	position2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(2) .ugb-testimonial__position',
		default: __( 'Position', i18n ),
	},
	position3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(3) .ugb-testimonial__position',
		default: __( 'Position', i18n ),
	},
	testimonial1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(1) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(2) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(3) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	titleColor: {
		type: 'string',
	},
	posColor: {
		type: 'string',
	},
	bodyTextColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
		default: '',
	},
	serif: {
		type: 'boolean',
		default: false,
	},
	columns: {
		type: 'number',
		default: 2,
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
	testimonialTitle: {
		type: 'string',
	},
	testimonialTitleTwo: {
		type: 'string',
	},
	testimonialTitleThree: {
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
	body: {
		type: 'string',
	},
	bodyTwo: {
		type: 'string',
	},
	bodyThree: {
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
		columns,
		titleColor,
		posColor,
		bodyTextColor,
		design = 'basic',
		borderRadius = 12,
		backgroundColor = '',
		shadow = 3,
		serif = false,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial',
		'ugb-testimonial--v2',
		`ugb-testimonial--columns-${ columns }`,
		`ugb-testimonial--design-${ design }`,
	], applyFilters( 'stackable.testimonial.mainclasses_1_17_3', {
		'ugb-testimonial--serif': serif,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-testimonial__item',
	], applyFilters( 'stackable.testimonial.itemclasses_1_17_3', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const styles = applyFilters( 'stackable.testimonial.styles_1_17_3', {
		item: {
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		},
		bodyWrapper: {},
		body: {
			color: bodyTextColor ? bodyTextColor : undefined,
		},
	}, design, props )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.testimonial.save.output.before_1_17_3', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const testimonial = attributes[ `testimonial${ i }` ]

				const bodyClasses = classnames( [
					'ugb-testimonial__body-wrapper',
				], applyFilters( 'stackable.testimonial.bodyclasses_1_17_3', {}, design, props ) )

				return (
					<div className={ itemClasses } style={ styles.item } key={ i }>
						<div className={ bodyClasses } style={ styles.bodyWrapper }>
							{ ! RichText.isEmpty( testimonial ) && (
								<RichText.Content
									tagName="p"
									className="ugb-testimonial__body"
									style={ styles.body }
									value={ testimonial }
								/>
							) }
						</div>
						<div className="ugb-testimonial__person">
							{ mediaURL && (
								<div className="ugb-testimonial__image" style={ { backgroundImage: `url(${ mediaURL })` } }></div>
							) }
							{ ! RichText.isEmpty( name ) && (
								<RichText.Content
									tagName="h4"
									className="ugb-testimonial__name"
									style={ { color: titleColor } }
									value={ name }
								/>
							) }
							{ ! RichText.isEmpty( position ) && (
								<RichText.Content
									tagName="p"
									className="ugb-testimonial__position"
									style={ { color: posColor } }
									value={ position }
								/>
							) }
						</div>
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.testimonial.save.output.after_1_17_3', null, design, props ) }
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
			const imageWidth = [ '', 'basic', 'plain', 'basic2', 'bubble' ].includes( attributes.design ) ? 75 : undefined
			return {
				...attributes,
				image1Id: attributes.mediaID1,
				image2Id: attributes.mediaID2,
				image3Id: attributes.mediaID3,
				image1Url: attributes.mediaURL1,
				image2Url: attributes.mediaURL2,
				image3Url: attributes.mediaURL3,
				imageShape: 'circle',
				nameColor: attributes.titleColor,
				positionColor: attributes.posColor,
				testimonialColor: attributes.bodyTextColor,
				columnBackgroundColor: attributes.backgroundColor,

				testimonialFontFamily: attributes.serif ? 'Serif-Alt' : undefined,
				testimonialFontSize: attributes.serif ? 20 : undefined,

				testimonial1: attributes.serif ? `<em>${ attributes.testimonial1 }</em>` : attributes.testimonial1,
				testimonial2: attributes.serif ? `<em>${ attributes.testimonial2 }</em>` : attributes.testimonial2,
				testimonial3: attributes.serif ? `<em>${ attributes.testimonial3 }</em>` : attributes.testimonial3,

				shadow: attributes.design === 'basic2' ? undefined : attributes.shadow,
				bubbleBackgroundColor: attributes.design === 'bubble' ? attributes.backgroundColor : undefined,
				imageWidth,
				imageSquare: imageWidth ? true : undefined,
			}
		},
	},
]

export default deprecated
