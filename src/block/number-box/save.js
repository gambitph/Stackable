import { withBlockStyles, withUniqueClass } from '@stackable/higher-order'
import { applyFilters } from '@wordpress/hooks'
import { BlockContainer } from '@stackable/components'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className, attributes } = props
	const {
		// numberColor,
		// titleColor,
		// descriptionColor,
		// numberBGColor,
		columns = 2,
		design = 'basic',
		// borderRadius = 12,
		shadow = 3,
		// backgroundColor,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v3',
		`ugb-number-box--columns-${ columns }`,
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const num = attributes[ `num${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]

					const boxClasses = classnames( [
						'ugb-number-box__item',
						`ugb-number-box__item${ i }`,
					], applyFilters( 'stackable.number-box.boxclasses', {
						[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
					}, design, props ) )

					return (
						<div className={ boxClasses } key={ i }>
							{ ! RichText.isEmpty( num ) && (
								<RichText.Content
									tagName="span"
									className="ugb-number-box__number"
									value={ num }
								/>
							) }
							{ ( ! RichText.isEmpty( title ) || ! RichText.isEmpty( description ) ) &&
								<div className="ugb-number-box__content">
									{ ! RichText.isEmpty( title ) && (
										<RichText.Content
											tagName="h4"
											className="ugb-number-box__title"
											value={ title }
										/>
									) }
									{ ! RichText.isEmpty( description ) && (
										<RichText.Content
											tagName="p"
											className="ugb-number-box__description"
											value={ description }
										/>
									) }
								</div>
							}
						</div>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
