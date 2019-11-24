/**
 * Internal dependencies
 */
import { createStyles } from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	Image,
	DivBackground,
} from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className, attributes } = props
	const {
		columns = 2,
		design = 'basic',
		shadow = '',
		nameTag = 'h4',
		imageShadow = '',
		imageShape = 'circle',
		imageShapeStretch = false,
		imageWidth = '',
		showTestimonial = true,
		showImage = true,
		showName = true,
		showPosition = true,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial--v3',
		`ugb-testimonial--columns-${ columns }`,
		`ugb-testimonial--design-${ design }`,
	], applyFilters( 'stackable.testimonial.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const name = attributes[ `name${ i }` ]
					const position = attributes[ `position${ i }` ]
					const testimonial = attributes[ `testimonial${ i }` ]

					const itemClasses = classnames( [
						'ugb-testimonial__item',
						`ugb-testimonial__item${ i }`,
					], applyFilters( 'stackable.testimonial.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					const bodyWrapperClasses = classnames( [
						'ugb-testimonial__body-wrapper',
					], applyFilters( 'stackable.testimonial.bodywrapperclasses', {}, props, i ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							<div className={ bodyWrapperClasses }>
								{ showTestimonial &&
									<RichText.Content
										tagName="p"
										className="ugb-testimonial__body"
										value={ testimonial }
									/>
								}
							</div>
							<div className="ugb-testimonial__person">
								{ ! show.imageAsBackground && showImage && imageUrl &&
									<div className="ugb-testimonial__image">
										<Image
											imageId={ imageId }
											src={ imageUrl }
											width={ imageWidth }
											alt={ imageAlt || ( showName && name ) }
											shadow={ imageShadow }
											shape={ attributes[ `image${ i }Shape` ] || imageShape }
											shapeStretch={ attributes[ `image${ i }ShapeStretch` ] || imageShapeStretch }
										/>
									</div>
								}
								{ show.imageAsBackground && showImage && imageUrl &&
									<div className="ugb-testimonial__image"></div>
								}
								{ showName &&
									<RichText.Content
										tagName={ nameTag || 'h4' }
										className="ugb-testimonial__name"
										value={ name }
									/>
								}
								{ showPosition &&
									<RichText.Content
										tagName="p"
										className="ugb-testimonial__position"
										value={ position }
									/>
								}
							</div>
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
