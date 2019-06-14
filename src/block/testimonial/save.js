import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/block-editor'

const save = props => {
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
	], applyFilters( 'stackable.testimonial.mainclasses', {
		'ugb-testimonial--serif': serif,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-testimonial__item',
	], applyFilters( 'stackable.testimonial.itemclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const styles = applyFilters( 'stackable.testimonial.styles', {
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
			{ applyFilters( 'stackable.testimonial.save.output.before', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const testimonial = attributes[ `testimonial${ i }` ]

				const bodyClasses = classnames( [
					'ugb-testimonial__body-wrapper',
				], applyFilters( 'stackable.testimonial.bodyclasses', {}, design, props ) )

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
			{ applyFilters( 'stackable.testimonial.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
