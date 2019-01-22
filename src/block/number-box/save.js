import classnames from 'classnames'
import isDarkColor from 'is-dark-color'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className, attributes } = props
	const {
		numberColor,
		titleColor,
		descriptionColor,
		numberBGColor,
		columns = 3,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		backgroundColor,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v2',
		`ugb-number-box--columns-${ columns }`,
	], {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				const num = attributes[ `num${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]

				const boxClasses = classnames( [
					'ugb-number-box__item',
				], {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
				} )

				const boxStyle = {
					borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
					backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
				}

				return (
					<div className={ boxClasses } style={ boxStyle } key={ i }>
						{ ! RichText.isEmpty( num ) && (
							<RichText.Content
								tagName="span"
								className="ugb-number-box__number"
								style={ {
									backgroundColor: numberBGColor,
									color: numberColor ? numberColor :
										   ! numberBGColor ? undefined :
										   isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
								} }
								value={ num }
							/>
						) }
						{ ( ! RichText.isEmpty( title ) || ! RichText.isEmpty( description ) ) &&
							<div className="ugb-number-box__content">
								{ ! RichText.isEmpty( title ) && (
									<RichText.Content
										tagName="h4"
										className="ugb-number-box__title"
										style={ {
											color: titleColor ? titleColor :
												   design === 'plain' ? undefined :
												   ! backgroundColor ? undefined :
												   isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
										} }
										value={ title }
									/>
								) }
								{ ! RichText.isEmpty( description ) && (
									<RichText.Content
										tagName="p"
										className="ugb-number-box__description"
										style={ {
											color: descriptionColor ? descriptionColor :
												   design === 'plain' ? undefined :
												   ! backgroundColor ? undefined :
												   isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
										} }
										value={ description }
									/>
								) }
							</div>
						}
					</div>
				)
			} ) }
		</div>
	)
}

export default save
