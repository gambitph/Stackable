import classnames from 'classnames'
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
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-team-member',
		'ugb-team-member--v2',
		`ugb-team-member--columns-${ columns }`,
		`ugb-team-member--image-${ shapes }`,
		`ugb-team-member--design-${ design }`,
	] )

	const itemClasses = classnames( [
		'ugb-team-member__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const itemStyle = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				// const href = attributes[ `href${i}` ]
				const mediaURL = attributes[ `mediaURL${ i }` ]
				const name = attributes[ `name${ i }` ]
				const position = attributes[ `position${ i }` ]
				const description = attributes[ `description${ i }` ]
				return (
					<div className={ itemClasses } style={ itemStyle } key={ i }>
						{ mediaURL && (
							<div className="ugb-team-member__image"
								style={ { backgroundImage: mediaURL ? `url(${ mediaURL })` : undefined } }
								data-src={ mediaURL ? mediaURL : undefined }
							/>
						) }
						<div className="ugb-team-member__content">
							{ ! RichText.isEmpty( name ) && (
								<RichText.Content
									tagName="h4"
									className="ugb-team-member__name"
									style={ { color: nameColor } }
									value={ name }
								/>
							) }
							{ ! RichText.isEmpty( position ) && (
								<RichText.Content
									tagName="p"
									className="ugb-team-member__position"
									style={ { color: posColor } }
									value={ position }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-team-member__description"
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

export default save
