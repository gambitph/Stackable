/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	ButtonEditHelper, BlockContainer, Image, DivBackground,
} from '~stackable/components'
import { withUniqueClass, withBlockStyles } from '~stackable/higher-order'
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

const save = props => {
	const { attributes, className } = props

	const {
		design = 'basic',
		columns = 3,
		imageShape = '',
		imageShapeStretch = false,
		imageWidth = '',
		imageShadow = '',
		titleTag = '',
		shadow = '',
		showImage = true,
		showTitle = true,
		showDescription = true,
		showButton = true,
		buttonIcon = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		`ugb-feature-grid--v2`,
		`ugb-feature-grid--columns-${ columns }`,
		`ugb-feature-grid--design-${ design }`,
	], applyFilters( 'stackable.feature-grid.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ]

					const itemClasses = classnames( [
						'ugb-feature-grid__item',
						`ugb-feature-grid__item${ i }`,
					], applyFilters( 'stackable.feature-grid.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground && show[ `columnBackground${ i }` ] }
							key={ i }
						>
							{ imageUrl && showImage &&
								<div className="ugb-feature-grid__image">
									<Image
										imageId={ imageId }
										src={ imageUrl }
										width={ imageWidth }
										alt={ imageAlt || ( showTitle && title ) }
										shadow={ imageShadow }
										shape={ attributes[ `image${ i }Shape` ] || imageShape }
										shapeStretch={ attributes[ `image${ i }ShapeStretch` ] || imageShapeStretch }
									/>
								</div>
							}
							<div className="ugb-feature-grid__content">
								{ showTitle && ! RichText.isEmpty( title ) &&
									<RichText.Content
										tagName={ titleTag || 'h5' }
										className="ugb-feature-grid__title"
										value={ title }
									/>
								}
								{ showDescription && ! RichText.isEmpty( description ) &&
									<RichText.Content
										tagName="p"
										className="ugb-feature-grid__description"
										value={ description }
									/>
								}
								{ showButton && !! buttonText.length &&
									<ButtonEditHelper.Content
										attrNameTemplate={ `button%s` }
										blockAttributes={ props.attributes }
										designDefault="plain"
										text={ buttonText }
										icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
										url={ attributes[ `button${ i }Url` ] }
										newTab={ attributes[ `button${ i }NewTab` ] }
										noFollow={ attributes[ `button${ i }NoFollow` ] }
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
