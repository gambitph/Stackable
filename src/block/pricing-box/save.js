import { applyFilters } from '@wordpress/hooks'
import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import isDarkColor from 'is-dark-color'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/block-editor'
import striptags from 'striptags'

const save = props => {
	const { className, attributes } = props
	const {
		pricingBoxColor,
		priceColor,
		perMonthLabelColor,
		buttonColor,
		buttonTextColor,
		buttonDesign,
		buttonIcon,
		featureListColor,
		columns = 2,
		size,
		cornerButtonRadius,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-pricing-box',
		'ugb-pricing-box--v2',
		`ugb-pricing-box--columns-${ columns }`,
		`ugb-pricing-box--design-${ design }`,
	], applyFilters( 'stackable.pricing-box.mainclasses', {}, design, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.pricing-box.save.output.before', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const index = i === 1 ? '' : i
				const title = attributes[ `pricingBoxTitle${ index }` ]
				const price = attributes[ `price${ index }` ]
				const pricePrefix = attributes[ `pricePrefix${ index }` ]
				const priceSuffix = attributes[ `priceSuffix${ index }` ]
				const subPrice = attributes[ `perMonthLabel${ index }` ]
				const buttonURL = attributes[ `url${ index }` ]
				const buttonNewTab = attributes[ `newTab${ index }` ]
				const buttonText = attributes[ `buttonText${ index }` ]
				const description = attributes[ `featureList${ index }` ]
				const imageURL = attributes[ `imageURL${ index }` ]
				const imageAlt = attributes[ `imageAlt${ index }` ]
				const highlightColor = attributes[ `highlightColor${ index }` ] || ''

				const itemClasses = classnames( [
					'ugb-pricing-box__item',
				], applyFilters( 'stackable.pricing-box.itemclasses', {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
					'ugb-pricing-box--highlighted': design !== 'plain' && highlightColor,
					'ugb-pricing-box--is-dark': design !== 'plain' && highlightColor ? isDarkColor( highlightColor ) : false,
				}, design, i, props ) )

				const styles = applyFilters( 'stackable.pricing-box.styles', {
					item: {
						borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
						backgroundColor: design !== 'plain' && highlightColor ? highlightColor : undefined,
					},
					title: {
						color: pricingBoxColor,
					},
					price: {
						color: priceColor,
					},
					month: {
						color: perMonthLabelColor,
					},
					description: {
						color: featureListColor,
					},
				}, design, i, props )

				return (
					<div className={ itemClasses } style={ styles.item } key={ i }>
						{ ( () => {
							const imageComp = imageURL && (
								<div className="ugb-pricing-box__image">
									<img src={ imageURL } alt={ striptags( title ? title : imageAlt ) } />
								</div>
							)
							const imageBGComp = imageURL && (
								<div className="ugb-pricing-box__image-bg" style={ {
									backgroundImage: `url(${ imageURL })`,
								} }>
								</div>
							)
							const titleComp = ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h3"
									className="ugb-pricing-box__title"
									style={ styles.title }
									value={ title }
								/>
							)
							const priceComp = ( ! RichText.isEmpty( price ) || ! RichText.isEmpty( subPrice ) ) && (
								<div className="ugb-pricing-box__price-wrapper">
									{ ! RichText.isEmpty( price ) && (
										<div className="ugb-pricing-box__price-line">
											{ ! RichText.isEmpty( pricePrefix ) && (
												<RichText.Content
													tagName="span"
													className="ugb-pricing-box__price-prefix"
													style={ styles.price }
													value={ pricePrefix }
												/>
											) }
											<RichText.Content
												tagName="span"
												className="ugb-pricing-box__price"
												style={ styles.price }
												value={ price }
											/>
											{ ! RichText.isEmpty( priceSuffix ) && (
												<RichText.Content
													tagName="span"
													className="ugb-pricing-box__price-suffix"
													style={ styles.price }
													value={ priceSuffix }
												/>
											) }
										</div>
									) }
									{ ! RichText.isEmpty( subPrice ) && (
										<RichText.Content
											tagName="p"
											className="ugb-pricing-box__subprice"
											style={ styles.month }
											value={ subPrice }
										/>
									) }
								</div>
							)
							const buttonComp = buttonText && !! buttonText.length && (
								<div className="ugb-pricing-box__button">
									<ButtonEdit.Content
										size={ size }
										url={ buttonURL }
										newTab={ buttonNewTab }
										color={ buttonTextColor }
										text={ buttonText }
										design={ buttonDesign }
										icon={ buttonIcon }
										backgroundColor={ buttonColor }
										borderRadius={ cornerButtonRadius }
									/>
								</div>
							)
							const descriptionComp = ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-pricing-box__description"
									style={ styles.description }
									value={ description }
								/>
							)
							const comps = {
								imageComp,
								imageBGComp,
								titleComp,
								priceComp,
								buttonComp,
								descriptionComp,
							}
							return applyFilters( 'stackable.pricing-box.save.output', (
								<Fragment>
									{ imageComp }
									{ titleComp }
									{ priceComp }
									{ buttonComp }
									{ descriptionComp }
								</Fragment>
							), design, comps, i, props )
						} )() }
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.pricing-box.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
