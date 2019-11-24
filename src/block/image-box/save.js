/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer } from '~stackable/components'
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import SVGArrow from './images/arrow.svg'
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className, attributes } = props
	const {
		columns = 2,
		contentAlign = '',
		design = 'basic',
		titleTag = '',
		shadow = '',
		showOverlay = false,
		showOverlayHover = true,
		showSubtitle = true,
		showTitle = true,
		showDescription = true,
		showArrow = false,
		imageHoverEffect = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box--v4',
		`ugb-image-box--columns-${ columns }`,
		`ugb-image-box--design-${ design }`,
	], applyFilters( 'stackable.image-box.mainclasses', {
		[ `ugb-image-box--effect-${ imageHoverEffect }` ]: imageHoverEffect,
		'ugb-image-box--with-arrow': showArrow,
		[ `ugb-image-box--align-${ contentAlign }` ]: contentAlign,
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const subtitle = attributes[ `subtitle${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]

					const itemClasses = classnames( [
						'ugb-image-box__item',
						`ugb-image-box__item${ i }`,
						'ugb-image-box__box',
					], applyFilters( 'stackable.image-box.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					const rel = []
					if ( attributes[ `link${ i }NewTab` ] ) {
						rel.push( 'noopener' )
						rel.push( 'noreferrer' )
					}
					if ( attributes[ `link${ i }NoFollow` ] ) {
						rel.push( 'nofollow' )
					}

					return (
						<div
							className={ itemClasses }
							key={ i }
						>
							{ attributes[ `image${ i }Url` ] &&
								<div className="ugb-image-box__box ugb-image-box__image-wrapper">
									<div className="ugb-image-box__box ugb-image-box__image"></div>
								</div>
							}
							{ showOverlay &&
								<div className="ugb-image-box__box ugb-image-box__overlay"></div>
							}
							{ showOverlayHover &&
								<div className="ugb-image-box__box ugb-image-box__overlay-hover"></div>
							}
							<div className="ugb-image-box__content">
								{ ( showSubtitle || showTitle ) &&
									<div className="ugb-image-box__header">
										{ showSubtitle && ! RichText.isEmpty( subtitle ) &&
											<RichText.Content
												tagName="div"
												className="ugb-image-box__subtitle"
												value={ subtitle }
											/>
										}
										{ showTitle && ! RichText.isEmpty( title ) &&
											<RichText.Content
												tagName={ titleTag || 'h4' }
												className="ugb-image-box__title"
												value={ title }
											/>
										}
									</div>
								}
								{ showDescription && ! RichText.isEmpty( description ) &&
									<RichText.Content
										tagName="p"
										className="ugb-image-box__description"
										value={ description }
									/>
								}
							</div>
							{ showArrow &&
								<div className="ugb-image-box__arrow">
									<SVGArrow />
								</div>
							}
							{ attributes[ `link${ i }Url` ] &&
								<a
									className="ugb-image-box__overlay-link"
									href={ attributes[ `link${ i }Url` ] }
									target={ attributes[ `link${ i }NewTab` ] ? '_blank' : undefined }
									rel={ rel.join( ' ' ) || undefined }
									title={ attributes[ `title${ i }` ] }
									aria-label={ attributes[ `title${ i }` ] }
								>{ null }</a>
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
