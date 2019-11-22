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
import { RichText } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'

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

const deprecatedSave_1_10 = props => {
	const { className, attributes } = props
	const {
		shapes,
		nameColor,
		posColor,
		desColor,
		columns = 2,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-team-member',
		`columns-${ columns }`,
		`image-${ shapes }`,
	] )

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				// const href = attributes[ `href${i}` ]
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const description = attributes[ `description${ i }` ]
				return (
					<div key={ i }>
						<div className="ugb-team-member-item">
							{ mediaURL && (
								<div className="team-member-image"
									style={ { backgroundImage: mediaURL ? `url(${ mediaURL })` : undefined } }
									data-src={ mediaURL ? mediaURL : undefined }
								/>
							) }
							{ ! RichText.isEmpty( name ) && (
								<RichText.Content
									tagName="h4"
									style={ { color: nameColor } }
									value={ name }
								/>
							) }
							{ ! RichText.isEmpty( position ) && (
								<RichText.Content
									tagName="p"
									className="ugb-team-member-position"
									style={ { color: posColor } }
									value={ position }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-team-member-desc"
									style={ { color: desColor } }
									value={ description }
								/>
							) }
						</div>
					</div>
				)
			} ) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
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
		selector: 'div:nth-of-type(1) > .ugb-team-member-item .team-member-image',
		attribute: 'data-src',
	},
	mediaURL2: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(2) > .ugb-team-member-item .team-member-image',
		attribute: 'data-src',
	},
	mediaURL3: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(3) > .ugb-team-member-item .team-member-image',
		attribute: 'data-src',
	},
	name1: {
		source: 'html',
		selector: 'div:nth-of-type(1) > .ugb-team-member-item h4',
		default: 'Name',
	},
	name2: {
		source: 'html',
		selector: 'div:nth-of-type(2) > .ugb-team-member-item h4',
		default: 'Name',
	},
	name3: {
		source: 'html',
		selector: 'div:nth-of-type(3) > .ugb-team-member-item h4',
		default: 'Name',
	},
	position1: {
		source: 'html',
		selector: 'div:nth-of-type(1) > .ugb-team-member-item .ugb-team-member-position',
		default: 'Position',
	},
	position2: {
		source: 'html',
		selector: 'div:nth-of-type(2) > .ugb-team-member-item .ugb-team-member-position',
		default: 'Position',
	},
	position3: {
		source: 'html',
		selector: 'div:nth-of-type(3) > .ugb-team-member-item .ugb-team-member-position',
		default: 'Position',
	},
	description1: {
		source: 'html',
		selector: 'div:nth-of-type(1) > .ugb-team-member-item .ugb-team-member-desc',
		default: descriptionPlaceholder( 'medium' ),
	},
	description2: {
		source: 'html',
		selector: 'div:nth-of-type(2) > .ugb-team-member-item .ugb-team-member-desc',
		default: descriptionPlaceholder( 'medium' ),
	},
	description3: {
		source: 'html',
		selector: 'div:nth-of-type(3) > .ugb-team-member-item .ugb-team-member-desc',
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
}

const deprecatedSchema_1_5 = {
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
		selector: '.ugb-team-member-column-one .team-member-image',
		attribute: 'data-src',
	},
	mediaURLTwo: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member-column-two .team-member-image',
		attribute: 'data-src',
	},
	mediaURLThree: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member-column-three .team-member-image',
		attribute: 'data-src',
	},
	name: {
		source: 'html',
		selector: '.ugb-team-member-column-one h4',
		default: 'Ben Adams',
	},
	nameTwo: {
		source: 'html',
		selector: '.ugb-team-member-column-two h4',
		default: 'Alex Johnson',
	},
	nameThree: {
		source: 'html',
		selector: '.ugb-team-member-column-three h4',
		default: 'Sammy Simpson',
	},
	position: {
		source: 'html',
		selector: '.ugb-team-member-column-one .ugb-team-member-position',
		default: 'Founder',
	},
	positionTwo: {
		source: 'html',
		selector: '.ugb-team-member-column-two .ugb-team-member-position',
		default: 'Editor',
	},
	positionThree: {
		source: 'html',
		selector: '.ugb-team-member-column-three .ugb-team-member-position',
		default: 'Programmer',
	},
	des: {
		source: 'html',
		selector: '.ugb-team-member-des',
		default: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
	},
	desTwo: {
		source: 'html',
		selector: '.ugb-team-member-des-two',
		default: 'Alex handles all written content. She enjoys painting and playing softball on the weekends.',
	},
	desThree: {
		source: 'html',
		selector: '.ugb-team-member-des-three',
		default: 'Sammy is our programmer. You\'ll usually find her nose in a book. She has a cat named Skitty.',
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
	iconColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 1,
	},
	shapes: {
		type: 'string',
		default: 'square',
	},
}

const deprecatedSave_1_5 = props => {
	const { className } = props
	const {
		name,
		nameTwo,
		nameThree,
		shapes,
		des,
		desTwo,
		desThree,
		position,
		positionTwo,
		positionThree,
		mediaURL,
		mediaURLTwo,
		mediaURLThree,
		nameColor,
		posColor,
		desColor,
		columns,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-team-member',
		`column-${ columns }`,
		`image-${ shapes }`,
	] )

	return (
		<div className={ mainClasses }>
			<div className="ugb-team-member-column-one">
				{ mediaURL && <div className="team-member-image" style={ { backgroundImage: `url(${ mediaURL })` } } data-src={ mediaURL }></div> }
				{ ! RichText.isEmpty( name ) && (
					<RichText.Content
						tagName="h4"
						style={ { color: nameColor } }
						value={ name }
					/>
				) }
				{ ! RichText.isEmpty( position ) && (
					<RichText.Content
						tagName="p"
						className="ugb-team-member-position"
						style={ { color: posColor } }
						value={ position }
					/>
				) }
				{ ! RichText.isEmpty( des ) && (
					<RichText.Content
						tagName="p"
						className="ugb-team-member-des"
						style={ { color: desColor } }
						value={ des }
					/>
				) }
			</div>
			{ columns > 1 && (
				<div className="ugb-team-member-column-two">
					{ mediaURLTwo && <div className="team-member-image" style={ { backgroundImage: `url(${ mediaURLTwo })` } } data-src={ mediaURLTwo }></div> }
					{ ! RichText.isEmpty( nameTwo ) && (
						<RichText.Content
							tagName="h4"
							style={ { color: nameColor } }
							value={ nameTwo }
						/>
					) }
					{ ! RichText.isEmpty( positionTwo ) && (
						<RichText.Content
							tagName="p"
							className="ugb-team-member-position"
							style={ { color: posColor } }
							value={ positionTwo }
						/>
					) }
					{ ! RichText.isEmpty( desTwo ) && (
						<RichText.Content
							tagName="p"
							className="ugb-team-member-des-two"
							style={ { color: desColor } }
							value={ desTwo }
						/>
					) }
				</div>
			) }
			{ columns > 2 && (
				<div className="ugb-team-member-column-three">
					{ mediaURLThree && <div className="team-member-image" style={ { backgroundImage: `url(${ mediaURLThree })` } } data-src={ mediaURLThree }></div> }
					{ ! RichText.isEmpty( nameThree ) && (
						<RichText.Content
							tagName="h4"
							style={ { color: nameColor } }
							value={ nameThree }
						/>
					) }
					{ ! RichText.isEmpty( positionThree ) && (
						<RichText.Content
							tagName="p"
							className="ugb-team-member-position"
							style={ { color: posColor } }
							value={ positionThree }
						/>
					) }
					{ ! RichText.isEmpty( desThree ) && (
						<RichText.Content
							tagName="p"
							className="ugb-team-member-des-three"
							style={ { color: desColor } }
							value={ desThree }
						/>
					) }
				</div>
			) }
		</div>
	)
}

const deprecated = [
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
				columns: attributes.columns ? attributes.columns : 1,
				href1: attributes.href,
				href2: attributes.hrefTwo,
				href3: attributes.hrefThree,
				mediaID1: attributes.mediaID,
				mediaID2: attributes.mediaIDTwo,
				mediaID3: attributes.mediaIDThree,
				mediaURL1: attributes.mediaURL,
				mediaURL2: attributes.mediaURLTwo,
				mediaURL3: attributes.mediaURLThree,
				name1: attributes.name,
				name2: attributes.nameTwo,
				name3: attributes.nameThree,
				position1: attributes.position,
				position2: attributes.positionTwo,
				position3: attributes.positionThree,
				description1: attributes.des,
				description2: attributes.desTwo,
				description3: attributes.desThree,
			}, [
				'href',
				'hrefTwo',
				'hrefThree',
				'mediaID',
				'mediaIDTwo',
				'mediaIDThree',
				'mediaURL',
				'mediaURLTwo',
				'mediaURLThree',
				'name',
				'nameTwo',
				'nameThree',
				'postion',
				'positionTwo',
				'positionThree',
				'des',
				'desTwo',
				'desThree',
			] )
		},
	},
]

export default deprecated
