import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'
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
	] )

	const boxClasses = classnames( [
		'ugb-pricing-box__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const boxStyle = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses }>
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
				return (
					<div className={ boxClasses } style={ boxStyle } key={ i }>
						{ imageURL &&
							<div className="ugb-pricing-grid__image">
								<img src={ imageURL } alt={ striptags( title ) } />
							</div>
						}
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h3"
								className="ugb-pricing-box__title"
								style={ { color: pricingBoxColor } }
								value={ title }
							/>
						) }
						<div className="ugb-pricing-box__price-wrapper">
							{ ! RichText.isEmpty( price ) && (
								<div className="ugb-pricing-box__price-line">
									{ ! RichText.isEmpty( pricePrefix ) && (
										<RichText.Content
											tagName="span"
											className="ugb-pricing-box__price-prefix"
											style={ { color: priceColor } }
											value={ pricePrefix }
										/>
									) }
									<RichText.Content
										tagName="span"
										className="ugb-pricing-box__price"
										style={ { color: priceColor } }
										value={ price }
									/>
									{ ! RichText.isEmpty( priceSuffix ) && (
										<RichText.Content
											tagName="span"
											className="ugb-pricing-box__price-suffix"
											style={ { color: priceColor } }
											value={ priceSuffix }
										/>
									) }
								</div>
							) }
							{ ! RichText.isEmpty( subPrice ) && (
								<RichText.Content
									tagName="p"
									className="ugb-pricing-box__subprice"
									style={ { color: perMonthLabelColor } }
									value={ subPrice }
								/>
							) }
						</div>
						{ buttonText && !! buttonText.length && (
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
						) }
						{ ! RichText.isEmpty( description ) && (
							<RichText.Content
								tagName="p"
								className="ugb-pricing-box__description"
								style={ { color: featureListColor } }
								value={ description }
							/>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

export default save
