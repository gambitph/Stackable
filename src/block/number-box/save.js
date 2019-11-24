/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer, DivBackground } from '~stackable/components'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { range } from 'lodash'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className, attributes } = props
	const {
		columns = 2,
		design = 'basic',
		titleTag = '',
		shadow = '',
		numberStyle = '',
		showNumber = true,
		showTitle = true,
		showDescription = true,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box--v3',
		`ugb-number-box--columns-${ columns }`,
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
		[ `ugb-number-box--number-style-${ numberStyle }` ]: numberStyle !== '' && ( design === 'basic' || design === 'plain' ),
	}, design, props ) )

	const show = showOptions( props )

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
						[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== '',
					}, design, props ) )

					return (
						<DivBackground
							className={ boxClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ showNumber && ! RichText.isEmpty( num ) && (
								<RichText.Content
									tagName="span"
									className="ugb-number-box__number"
									value={ num }
								/>
							) }
							{ ( showTitle || showDescription ) && ( ! RichText.isEmpty( title ) || ! RichText.isEmpty( description ) ) &&
								<div className="ugb-number-box__content">
									{ showTitle && ! RichText.isEmpty( title ) && (
										<RichText.Content
											tagName={ titleTag || 'h4' }
											className="ugb-number-box__title"
											value={ title }
										/>
									) }
									{ showDescription && ! RichText.isEmpty( description ) && (
										<RichText.Content
											tagName="p"
											className="ugb-number-box__description"
											value={ description }
										/>
									) }
								</div>
							}
						</DivBackground>
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
