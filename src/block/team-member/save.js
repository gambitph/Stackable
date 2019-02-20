import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const save = props => {
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
		colorOnHover = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-team-member',
		'ugb-team-member--v2',
		`ugb-team-member--columns-${ columns }`,
		`ugb-team-member--image-${ shapes }`,
		`ugb-team-member--design-${ design }`,
	], {
		'ugb-team-member--color-on-hover': colorOnHover,
	} )

	const itemClasses = classnames( [
		'ugb-team-member__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				// const href = attributes[ `href${i}` ]
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const description = attributes[ `description${ i }` ]

				const styles = applyFilters( 'stackable.team-member.itemstyles', {
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
						{ applyFilters( 'stackable.team-member.save.output', (
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
		</div>
	)
}

export default save
