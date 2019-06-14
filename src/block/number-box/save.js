import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import isDarkColor from 'is-dark-color'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/block-editor'

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
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.number-box.edit.output.before', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const num = attributes[ `num${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]

				const boxClasses = classnames( [
					'ugb-number-box__item',
				], applyFilters( 'stackable.number-box.boxclasses', {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
				}, design, props ) )

				const styles = applyFilters( 'stackable.number-box.styles', {
					box: {
						borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
						backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
					},
					number: {
						backgroundColor: numberBGColor,
						color: numberColor ? numberColor :
						       ! numberBGColor ? undefined :
						       isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
					},
					title: {
						color: titleColor ? titleColor :
						       design === 'plain' ? undefined :
						       ! backgroundColor ? undefined :
						       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
					},
					description: {
						color: descriptionColor ? descriptionColor :
						       design === 'plain' ? undefined :
						       ! backgroundColor ? undefined :
						       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
					},
				}, design, props )

				return (
					<div className={ boxClasses } style={ styles.box } key={ i }>
						{ ! RichText.isEmpty( num ) && (
							<RichText.Content
								tagName="span"
								className="ugb-number-box__number"
								style={ styles.number }
								value={ num }
							/>
						) }
						{ ( ! RichText.isEmpty( title ) || ! RichText.isEmpty( description ) ) &&
							<div className="ugb-number-box__content">
								{ ! RichText.isEmpty( title ) && (
									<RichText.Content
										tagName="h4"
										className="ugb-number-box__title"
										style={ styles.title }
										value={ title }
									/>
								) }
								{ ! RichText.isEmpty( description ) && (
									<RichText.Content
										tagName="p"
										className="ugb-number-box__description"
										style={ styles.description }
										value={ description }
									/>
								) }
							</div>
						}
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.number-box.edit.output.after', null, design, props ) }
		</div>
	)
}

export default save
