/**
 * External dependencies
 */
import { descriptionPlaceholder, range } from '~stackable/util'
import classnames from 'classnames'
import { omit } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'

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

const deprecatedSchema_1_10 = {
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
		selector: '.ugb-testimonial-item:nth-of-type(1) h4',
		default: 'Name',
	},
	name2: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(2) h4',
		default: 'Name',
	},
	name3: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(3) h4',
		default: 'Name',
	},
	position1: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(1) .ugb-testimonial-position',
		default: 'Position',
	},
	position2: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(2) .ugb-testimonial-position',
		default: 'Position',
	},
	position3: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(3) .ugb-testimonial-position',
		default: 'Position',
	},
	testimonial1: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(1) .ugb-testimonial-body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial2: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(2) .ugb-testimonial-body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial3: {
		source: 'html',
		selector: '.ugb-testimonial-item:nth-of-type(3) .ugb-testimonial-body',
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
	columns: {
		type: 'number',
		default: 2,
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
}

const deprecatedSave_1_10 = props => {
	const { className, attributes } = props
	const {
		columns,
		titleColor,
		posColor,
		bodyTextColor,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial',
		`columns-${ columns }`,
	] )

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const testimonial = attributes[ `testimonial${ i }` ]
				return (
					<div className="ugb-testimonial-item" key={ i }>
						{ ! RichText.isEmpty( testimonial ) && (
							<RichText.Content
								tagName="p"
								className="ugb-testimonial-body"
								style={ { color: bodyTextColor } }
								value={ testimonial }
							/>
						) }
						{ mediaURL && (
							<div className="testimonial-image" style={ { backgroundImage: `url(${ mediaURL })` } }></div>
						) }
						{ ! RichText.isEmpty( name ) && (
							<RichText.Content
								tagName="h4"
								style={ { color: titleColor } }
								value={ name }
							/>
						) }
						{ ! RichText.isEmpty( position ) && (
							<RichText.Content
								tagName="p"
								className="ugb-testimonial-position"
								style={ { color: posColor } }
								value={ position }
							/>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

export const deprecatedSave_1_5 = props => {
	const { className } = props
	const {
		testimonialTitle,
		testimonialTitleTwo,
		testimonialTitleThree,
		body,
		bodyTwo,
		bodyThree,
		position,
		positionTwo,
		positionThree,
		mediaURL,
		mediaURLTwo,
		mediaURLThree,
		titleColor,
		posColor,
		bodyTextColor,
		iconColor,
		columns,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial',
		`column-${ columns }`,
	] )

	const tesitimonialIcon = (
		<div className="quote-icon">
			<svg viewBox="0 0 246 187.5" style={ { fill: iconColor } }>
				<path d="M98.5,0h-93C2.5,0,0,2.5,0,5.5v93c0,3,2.5,5.5,5.5,5.5h39c-1.7,15.5-8.8,50-39,50c-3,0-5.5,2.5-5.5,5.5V182c0,3,2.5,5.5,5.5,5.5c5.2,0,98.5-4.5,98.5-89v-93C104,2.5,101.5,0,98.5,0z" />
				<path d="M240.5,0h-93c-3,0-5.5,2.5-5.5,5.5v93c0,3,2.5,5.5,5.5,5.5h39c-1.7,15.5-8.8,50-39,50c-3,0-5.5,2.5-5.5,5.5V182c0,3,2.5,5.5,5.5,5.5c5.2,0,98.5-4.5,98.5-89v-93C246,2.5,243.5,0,240.5,0z" />
				<path d="M161.3-86.3c3.2,0,3.2-5,0-5C158.1-91.3,158.1-86.3,161.3-86.3L161.3-86.3z" />
			</svg>
		</div>
	)

	return (
		<div className={ mainClasses }>
			<div className="ugb-testimonial-column-one">
				{ mediaURL ? <div className="testimonial-image" style={ { backgroundImage: `url(${ mediaURL })` } } data-src={ mediaURL }></div> : tesitimonialIcon }
				{ ! RichText.isEmpty( testimonialTitle ) && (
					<RichText.Content
						tagName="h4"
						style={ { color: titleColor } }
						value={ testimonialTitle }
					/>
				) }
				{ ! RichText.isEmpty( position ) && (
					<RichText.Content
						tagName="p"
						className="ugb-testimonial-position"
						style={ { color: posColor } }
						value={ position }
					/>
				) }
				{ ! RichText.isEmpty( body ) && (
					<RichText.Content
						tagName="p"
						className="ugb-testimonial-body"
						style={ { color: bodyTextColor } }
						value={ body }
					/>
				) }
			</div>
			{ columns > 1 && (
				<div className="ugb-testimonial-column-two">
					{ mediaURLTwo ? <div className="testimonial-image" style={ { backgroundImage: `url(${ mediaURLTwo })` } } data-src={ mediaURLTwo }></div> : tesitimonialIcon }
					{ ! RichText.isEmpty( testimonialTitleTwo ) && (
						<RichText.Content
							tagName="h4"
							style={ { color: titleColor } }
							value={ testimonialTitleTwo }
						/>
					) }
					{ ! RichText.isEmpty( positionTwo ) && (
						<RichText.Content
							tagName="p"
							className="ugb-testimonial-position-two"
							style={ { color: posColor } }
							value={ positionTwo }
						/>
					) }
					{ ! RichText.isEmpty( bodyTwo ) && (
						<RichText.Content
							tagName="p"
							className="ugb-testimonial-body-two"
							style={ { color: bodyTextColor } }
							value={ bodyTwo }
						/>
					) }
				</div>
			) }
			{ columns > 2 && (
				<div className="ugb-testimonial-column-three">
					{ mediaURLThree ? <div className="testimonial-image" style={ { backgroundImage: `url(${ mediaURLThree })` } } data-src={ mediaURLThree }></div> : tesitimonialIcon }
					{ ! RichText.isEmpty( testimonialTitleThree ) && (
						<RichText.Content
							tagName="h4"
							style={ { color: titleColor } }
							value={ testimonialTitleThree }
						/>
					) }
					{ ! RichText.isEmpty( positionThree ) && (
						<RichText.Content
							tagName="p"
							className="ugb-testimonial-position-three"
							style={ { color: posColor } }
							value={ positionThree }
						/>
					) }
					{ ! RichText.isEmpty( bodyThree ) && (
						<RichText.Content
							tagName="p"
							className="ugb-testimonial-body-three"
							style={ { color: bodyTextColor } }
							value={ bodyThree }
						/>
					) }
				</div>
			) }
		</div>
	)
}

export const deprecatedSchema_1_5 = {
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
		source: 'attribute',
		selector: '.ugb-testimonial-column-one .testimonial-image',
		attribute: 'data-src',
	},
	mediaURLTwo: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-testimonial-column-two .testimonial-image',
		attribute: 'data-src',
	},
	mediaURLThree: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-testimonial-column-three .testimonial-image',
		attribute: 'data-src',
	},
	testimonialTitle: {
		source: 'html',
		selector: '.ugb-testimonial-column-one h4',
		default: 'Ben Adams',
	},
	testimonialTitleTwo: {
		source: 'html',
		selector: '.ugb-testimonial-column-two h4',
		default: 'Alex Johnson',
	},
	testimonialTitleThree: {
		source: 'html',
		selector: '.ugb-testimonial-column-three h4',
		default: 'Sammy Simpson',
	},
	position: {
		source: 'html',
		selector: '.ugb-testimonial-position',
		default: 'Founder',
	},
	positionTwo: {
		source: 'html',
		selector: '.ugb-testimonial-position-two',
		default: 'Editor',
	},
	positionThree: {
		source: 'html',
		selector: '.ugb-testimonial-position-three',
		default: 'Programmer',
	},
	body: {
		source: 'html',
		selector: '.ugb-testimonial-body',
		default: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
	},
	bodyTwo: {
		source: 'html',
		selector: '.ugb-testimonial-body-two',
		default: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
	},
	bodyThree: {
		source: 'html',
		selector: '.ugb-testimonial-body-three',
		default: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
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
	iconColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 1,
	},
}

const deprecated = [
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
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				design: 'plain',
				borderRadius: 12,
				shadow: 3,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_5,
		save: deprecatedSave_1_5,
		migrate: attributes => {
			return omit( {
				...attributes,
				mediaID1: attributes.mediaID,
				mediaID2: attributes.mediaIDTwo,
				mediaID3: attributes.mediaIDThree,
				mediaURL1: attributes.mediaURL,
				mediaURL2: attributes.mediaURLTwo,
				mediaURL3: attributes.mediaURLThree,
				name1: attributes.testimonialTitle,
				name2: attributes.testimonialTitleTwo,
				name3: attributes.testimonialTitleThree,
				position1: attributes.position,
				position2: attributes.positionTwo,
				position3: attributes.positionThree,
				testimonial1: attributes.body,
				testimonial2: attributes.bodyTwo,
				testimonial3: attributes.bodyThree,
			}, [
				'mediaID',
				'mediaIDTwo',
				'mediaIDThree',
				'mediaURL',
				'mediaURLTwo',
				'mediaURLThree',
				'testimonialTitle',
				'testimonialTitleTwo',
				'testimonialTitleThree',
				'postion',
				'positionTwo',
				'positionThree',
				'body',
				'bodyTwo',
				'bodyThree',
			] )
		},
	},
]

export default deprecated
