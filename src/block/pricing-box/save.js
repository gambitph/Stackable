/**
 * Internal dependencies
 */
import { createStyles } from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import { range } from 'lodash'
import {
	BlockContainer,
	Image,
	ButtonEditHelper,
	DivBackground,
} from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import classnames from 'classnames'

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
		design = 'basic',
		columns = 2,
		shadow = '',
		imageShape = '',
		imageShapeStretch = false,
		showImage = true,
		showTitle = true,
		showPricePrefix = true,
		showPrice = true,
		showPriceSuffix = true,
		showSubPrice = true,
		showButton = true,
		showDescription = true,
		imageShadow = '',
		imageWidth = '',
		titleTag = '',
		buttonIcon = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-pricing-box--v3',
		`ugb-pricing-box--columns-${ columns }`,
		`ugb-pricing-box--design-${ design }`,
	], applyFilters( 'stackable.pricing-box.mainclasses', {}, props ) )

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
					const price = attributes[ `price${ i }` ]
					const pricePrefix = attributes[ `pricePrefix${ i }` ]
					const priceSuffix = attributes[ `priceSuffix${ i }` ]
					const subPrice = attributes[ `subPrice${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ]

					const itemClasses = classnames( [
						'ugb-pricing-box__item',
						`ugb-pricing-box__item${ i }`,
					], applyFilters( 'stackable.pricing-box.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					const imageComp = imageUrl &&
						<div className="ugb-pricing-box__image">
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
					const imageBgComp = imageUrl &&
						<div className="ugb-pricing-box__image"></div>

					const titleComp = ! RichText.isEmpty( title ) && (
						<RichText.Content
							tagName={ titleTag || 'h3' }
							className="ugb-pricing-box__title"
							value={ title }
						/>
					)
					const priceComp = ! RichText.isEmpty( price ) && (
						<div className="ugb-pricing-box__price-wrapper">
							{ ! RichText.isEmpty( price ) && (
								<div className="ugb-pricing-box__price-line">
									{ showPricePrefix && ! RichText.isEmpty( pricePrefix ) && (
										<RichText.Content
											tagName="span"
											className="ugb-pricing-box__price-prefix"
											value={ pricePrefix }
										/>
									) }
									<RichText.Content
										tagName="span"
										className="ugb-pricing-box__price"
										value={ price }
									/>
									{ showPriceSuffix && ! RichText.isEmpty( priceSuffix ) && (
										<RichText.Content
											tagName="span"
											className="ugb-pricing-box__price-suffix"
											value={ priceSuffix }
										/>
									) }
								</div>
							) }
						</div>
					)
					const subPriceComp = ! RichText.isEmpty( subPrice ) &&
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box__subprice"
							value={ subPrice }
						/>
					const buttonComp = buttonText && ! RichText.isEmpty( buttonText ) && (
						<div className="ugb-pricing-box__button">
							<ButtonEditHelper.Content
								attrNameTemplate={ `button%s` }
								blockAttributes={ props.attributes }
								text={ buttonText }
								icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
								url={ attributes[ `button${ i }Url` ] }
								newTab={ attributes[ `button${ i }NewTab` ] }
								noFollow={ attributes[ `button${ i }NoFollow` ] }
							/>
						</div>
					)
					const descriptionComp = ! RichText.isEmpty( description ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box__description"
							value={ description }
						/>
					)
					const comps = {
						imageComp,
						imageBgComp,
						titleComp,
						priceComp,
						subPriceComp,
						buttonComp,
						descriptionComp,
					}

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ applyFilters( 'stackable.pricing-box.save.output', (
								<Fragment>
									{ showImage && imageComp }
									{ showTitle && titleComp }
									{ showPrice && priceComp }
									{ showSubPrice && subPriceComp }
									{ showButton && buttonComp }
									{ showDescription && descriptionComp }
								</Fragment>
							), props, comps, i ) }
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
