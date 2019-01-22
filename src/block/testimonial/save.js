import classnames from 'classnames'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className, attributes } = props
	const {
		columns,
		titleColor,
		posColor,
		bodyTextColor,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial',
		'ugb-testimonial--v2',
		`ugb-testimonial--columns-${ columns }`,
		`ugb-testimonial--design-${ design }`,
	] )

	const itemClasses = classnames( [
		'ugb-testimonial__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const itemStyle = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const testimonial = attributes[ `testimonial${ i }` ]
				return (
					<div className={ itemClasses } style={ itemStyle } key={ i }>
						<div className="ugb-testimonial__body-wrapper">
							{ ! RichText.isEmpty( testimonial ) && (
								<RichText.Content
									tagName="p"
									className="ugb-testimonial__body"
									style={ { color: bodyTextColor } }
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
		</div>
	)
}

export default save
