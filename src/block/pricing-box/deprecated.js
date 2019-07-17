import {
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_12,
	DeprecatedButtonContent_1_9,
} from '@stackable/components/button-edit'
import { descriptionPlaceholder, range } from '@stackable/util'
import classnames from 'classnames'
import isDarkColor from 'is-dark-color'
import { RichText } from '@wordpress/block-editor'
import striptags from 'striptags'

const deprecatedSave_1_12 = props => {
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
				const imageAlt = attributes[ `imageAlt${ index }` ]
				const highlightColor = attributes[ `highlightColor${ index }` ] || ''

				const itemClasses = classnames( [
					'ugb-pricing-box__item',
				], {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
					'ugb-pricing-box--highlighted': design !== 'plain' && highlightColor,
					'ugb-pricing-box--is-dark': design !== 'plain' && highlightColor ? isDarkColor( highlightColor ) : false,
				} )

				const styles = {
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
				}

				return (
					<div className={ itemClasses } style={ styles.item } key={ i }>
						{ imageURL &&
							<div className="ugb-pricing-grid__image">
								<img src={ imageURL } alt={ striptags( title ? title : imageAlt ) } />
							</div>
						}
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="h3"
								className="ugb-pricing-box__title"
								style={ styles.title }
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
						{ buttonText && !! buttonText.length && (
							<DeprecatedButtonContent_1_12
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
								style={ styles.description }
								value={ description }
							/>
						) }
					</div>
				)
			} ) }
		</div>
	)
}

const deprecatedSchema_1_12 = {
	pricingBoxColor: {
		type: 'string',
	},
	priceColor: {
		type: 'string',
	},
	perMonthLabelColor: {
		type: 'string',
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	featureListColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
}
// Wrap in curly or else statement will merge with the previous one and will error out.
{ [ 1, 2, 3 ].forEach( i => {
	const index = i === 1 ? '' : i
	deprecatedSchema_1_12[ `url${ index }` ] = {
		type: 'string',
		source: 'attribute',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-button`,
		attribute: 'href',
		default: '',
	}
	deprecatedSchema_1_12[ `newTab${ index }` ] = {
		type: 'boolean',
		source: 'attribute',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-button`,
		attribute: 'target',
		default: false,
	}
	deprecatedSchema_1_12[ `imageURL${ index }` ] = {
		type: 'string',
	}
	deprecatedSchema_1_12[ `imageID${ index }` ] = {
		type: 'string',
	}
	deprecatedSchema_1_12[ `imageAlt${ index }` ] = {
		type: 'string',
	}
	deprecatedSchema_1_12[ `highlightColor${ index }` ] = {
		type: 'string',
		default: '',
	}
	deprecatedSchema_1_12[ `pricingBoxTitle${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-pricing-box__title`,
		default: 'Title',
	}
	deprecatedSchema_1_12[ `price${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-pricing-box__price`,
		default: `${ index }9`,
	}
	deprecatedSchema_1_12[ `pricePrefix${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-pricing-box__price-prefix`,
		default: '$',
	}
	deprecatedSchema_1_12[ `priceSuffix${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-pricing-box__price-suffix`,
		default: '.00',
	}
	deprecatedSchema_1_12[ `perMonthLabel${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-pricing-box__subprice`,
		default: 'Description',
	}
	deprecatedSchema_1_12[ `buttonText${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-button span`,
		default: 'Button text',
	}
	deprecatedSchema_1_12[ `featureList${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-of-type(${ i }) .ugb-pricing-box__description`,
		default: descriptionPlaceholder( 'medium' ),
	}
} ) }

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		url,
		url2,
		url3,
		pricingBoxTitle,
		pricingBoxTitle2,
		pricingBoxTitle3,
		price,
		price2,
		price3,
		perMonthLabel,
		perMonthLabel2,
		perMonthLabel3,
		buttonText,
		buttonText2,
		buttonText3,
		featureList,
		featureList2,
		featureList3,
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
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-pricing-box',
		`column-${ columns }`,
	] )

	return (
		<div className={ mainClasses }>
			<div className="ugb-pricing-box-column-one">
				{ ! RichText.isEmpty( pricingBoxTitle ) && (
					<RichText.Content
						tagName="h3"
						style={ { color: pricingBoxColor } }
						value={ pricingBoxTitle }
					/>
				) }
				{ ! RichText.isEmpty( price ) && (
					<RichText.Content
						tagName="p"
						className="ugb-pricing-box-pricing"
						style={ { color: priceColor } }
						value={ price }
					/>
				) }
				{ ! RichText.isEmpty( perMonthLabel ) && (
					<RichText.Content
						tagName="p"
						className="ugb-pricing-box-per-month-label"
						style={ { color: perMonthLabelColor } }
						value={ perMonthLabel }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_10
						size={ size }
						url={ url }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				) }
				{ ! RichText.isEmpty( featureList ) && (
					<RichText.Content
						tagName="p"
						className="ugb-pricing-box-feature-list"
						style={ { color: featureListColor } }
						value={ featureList }
					/>
				) }
			</div>
			{ columns > 1 && (
				<div className="ugb-pricing-box-column-two">
					{ ! RichText.isEmpty( pricingBoxTitle2 ) && (
						<RichText.Content
							tagName="h3"
							style={ { color: pricingBoxColor } }
							value={ pricingBoxTitle2 }
						/>
					) }
					{ ! RichText.isEmpty( price2 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-pricing"
							style={ { color: priceColor } }
							value={ price2 }
						/>
					) }
					{ ! RichText.isEmpty( perMonthLabel2 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-per-month-label"
							style={ { color: perMonthLabelColor } }
							value={ perMonthLabel2 }
						/>
					) }
					{ buttonText2 && !! buttonText2.length && (
						<DeprecatedButtonContent_1_10
							size={ size }
							url={ url2 }
							color={ buttonTextColor }
							text={ buttonText2 }
							design={ buttonDesign }
							icon={ buttonIcon }
							backgroundColor={ buttonColor }
							borderRadius={ cornerButtonRadius }
						/>
					) }
					{ ! RichText.isEmpty( featureList2 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-feature-list"
							style={ { color: featureListColor } }
							value={ featureList2 }
						/>
					) }
				</div>
			) }
			{ columns > 2 && (
				<div className="ugb-pricing-box-column-three">
					{ ! RichText.isEmpty( pricingBoxTitle3 ) && (
						<RichText.Content
							tagName="h3"
							style={ { color: pricingBoxColor } }
							value={ pricingBoxTitle3 }
						/>
					) }
					{ ! RichText.isEmpty( price3 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-pricing"
							style={ { color: priceColor } }
							value={ price3 }
						/>
					) }
					{ ! RichText.isEmpty( perMonthLabel3 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-per-month-label"
							style={ { color: perMonthLabelColor } }
							value={ perMonthLabel3 }
						/>
					) }
					{ buttonText3 && !! buttonText3.length && (
						<DeprecatedButtonContent_1_10
							size={ size }
							url={ url3 }
							color={ buttonTextColor }
							text={ buttonText3 }
							design={ buttonDesign }
							icon={ buttonIcon }
							backgroundColor={ buttonColor }
							borderRadius={ cornerButtonRadius }
						/>
					) }
					{ ! RichText.isEmpty( featureList3 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-feature-list"
							style={ { color: featureListColor } }
							value={ featureList3 }
						/>
					) }
				</div>
			) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-pricing-box-column-one .ugb-button',
		attribute: 'href',
	},
	url2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-pricing-box-column-two .ugb-button',
		attribute: 'href',
	},
	url3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-pricing-box-column-three .ugb-button',
		attribute: 'href',
	},
	pricingBoxTitle: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one h3',
		default: 'Title',
	},
	pricingBoxTitle2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two h3',
		default: 'Title',
	},
	pricingBoxTitle3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three h3',
		default: 'Title',
	},
	price: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-pricing',
		default: '$9.99',
	},
	price2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-pricing',
		default: '$19.99',
	},
	price3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-pricing',
		default: '$99.99',
	},
	perMonthLabel: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-per-month-label',
		default: 'Description',
	},
	perMonthLabel2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-per-month-label',
		default: 'Description',
	},
	perMonthLabel3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-per-month-label',
		default: 'Description',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-button span',
		default: 'Button text',
	},
	buttonText2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-button span',
		default: 'Button text',
	},
	buttonText3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-button span',
		default: 'Button text',
	},
	featureList: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-feature-list',
		default: descriptionPlaceholder( 'medium' ),
	},
	featureList2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-feature-list',
		default: descriptionPlaceholder( 'medium' ),
	},
	featureList3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-feature-list',
		default: descriptionPlaceholder( 'medium' ),
	},
	pricingBoxColor: {
		type: 'string',
	},
	priceColor: {
		type: 'string',
	},
	perMonthLabelColor: {
		type: 'string',
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	featureListColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
}

export const deprecatedSchema_1_9 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-pricing-box-column-one .ugb-button a',
		attribute: 'href',
	},
	url2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-pricing-box-column-two .ugb-button a',
		attribute: 'href',
	},
	url3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-pricing-box-column-three .ugb-button a',
		attribute: 'href',
	},
	pricingBoxTitle: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one h3',
		default: 'Basic',
	},
	pricingBoxTitle2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two h3',
		default: 'Basic',
	},
	pricingBoxTitle3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three h3',
		default: 'Basic',
	},
	price: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-pricing',
		default: '$9',
	},
	price2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-pricing',
		default: '$9',
	},
	price3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-pricing',
		default: '$9',
	},
	perMonthLabel: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-per-month-label',
		default: 'per month',
	},
	perMonthLabel2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-per-month-label',
		default: 'per month',
	},
	perMonthLabel3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-per-month-label',
		default: 'per month',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-button a',
		default: 'Buy Now',
	},
	buttonText2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-button a',
		default: 'Buy Now',
	},
	buttonText3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-button a',
		default: 'Buy Now',
	},
	featureList: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-feature-list',
		default: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
	},
	featureList2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-feature-list',
		default: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
	},
	featureList3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-feature-list',
		default: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
	},
	pricingBoxColor: {
		type: 'string',
	},
	priceColor: {
		type: 'string',
	},
	perMonthLabelColor: {
		type: 'string',
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	featureListColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
}

export const deprecatedSave_1_9 = props => {
	const { className } = props
	const {
		url,
		url2,
		url3,
		pricingBoxTitle,
		pricingBoxTitle2,
		pricingBoxTitle3,
		price,
		price2,
		price3,
		perMonthLabel,
		perMonthLabel2,
		perMonthLabel3,
		buttonText,
		buttonText2,
		buttonText3,
		featureList,
		featureList2,
		featureList3,
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
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-pricing-box',
		`column-${ columns }`,
	] )

	return (
		<div className={ mainClasses }>
			<div className="ugb-pricing-box-column-one">
				{ ! RichText.isEmpty( pricingBoxTitle ) && (
					<RichText.Content
						tagName="h3"
						style={ { color: pricingBoxColor } }
						value={ pricingBoxTitle }
					/>
				) }
				{ ! RichText.isEmpty( price ) && (
					<RichText.Content
						tagName="p"
						className="ugb-pricing-box-pricing"
						style={ { color: priceColor } }
						value={ price }
					/>
				) }
				{ ! RichText.isEmpty( perMonthLabel ) && (
					<RichText.Content
						tagName="p"
						className="ugb-pricing-box-per-month-label"
						style={ { color: perMonthLabelColor } }
						value={ perMonthLabel }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<DeprecatedButtonContent_1_9
						size={ size }
						url={ url }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				) }
				{ ! RichText.isEmpty( featureList ) && (
					<RichText.Content
						tagName="p"
						className="ugb-pricing-box-feature-list"
						style={ { color: featureListColor } }
						value={ featureList }
					/>
				) }
			</div>
			{ columns > 1 && (
				<div className="ugb-pricing-box-column-two">
					{ ! RichText.isEmpty( pricingBoxTitle2 ) && (
						<RichText.Content
							tagName="h3"
							style={ { color: pricingBoxColor } }
							value={ pricingBoxTitle2 }
						/>
					) }
					{ ! RichText.isEmpty( price2 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-pricing"
							style={ { color: priceColor } }
							value={ price2 }
						/>
					) }
					{ ! RichText.isEmpty( perMonthLabel2 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-per-month-label"
							style={ { color: perMonthLabelColor } }
							value={ perMonthLabel2 }
						/>
					) }
					{ buttonText2 && !! buttonText2.length && (
						<DeprecatedButtonContent_1_9
							size={ size }
							url={ url2 }
							color={ buttonTextColor }
							text={ buttonText2 }
							design={ buttonDesign }
							icon={ buttonIcon }
							backgroundColor={ buttonColor }
							borderRadius={ cornerButtonRadius }
						/>
					) }
					{ ! RichText.isEmpty( featureList2 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-feature-list"
							style={ { color: featureListColor } }
							value={ featureList2 }
						/>
					) }
				</div>
			) }
			{ columns > 2 && (
				<div className="ugb-pricing-box-column-three">
					{ ! RichText.isEmpty( pricingBoxTitle3 ) && (
						<RichText.Content
							tagName="h3"
							style={ { color: pricingBoxColor } }
							value={ pricingBoxTitle3 }
						/>
					) }
					{ ! RichText.isEmpty( price3 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-pricing"
							style={ { color: priceColor } }
							value={ price3 }
						/>
					) }
					{ ! RichText.isEmpty( perMonthLabel3 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-per-month-label"
							style={ { color: perMonthLabelColor } }
							value={ perMonthLabel3 }
						/>
					) }
					{ buttonText3 && !! buttonText3.length && (
						<DeprecatedButtonContent_1_9
							size={ size }
							url={ url3 }
							color={ buttonTextColor }
							text={ buttonText3 }
							design={ buttonDesign }
							icon={ buttonIcon }
							backgroundColor={ buttonColor }
							borderRadius={ cornerButtonRadius }
						/>
					) }
					{ ! RichText.isEmpty( featureList3 ) && (
						<RichText.Content
							tagName="p"
							className="ugb-pricing-box-feature-list"
							style={ { color: featureListColor } }
							value={ featureList3 }
						/>
					) }
				</div>
			) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_12,
		save: deprecatedSave_1_12,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				design: 'basic',
				borderRadius: 12,
				shadow: 3,
				imageID: undefined,
				imageID2: undefined,
				imageID3: undefined,
				imageURL: undefined,
				imageURL2: undefined,
				imageURL3: undefined,
				pricePrefix: undefined,
				pricePrefix2: undefined,
				pricePrefix3: undefined,
				priceSuffix: undefined,
				priceSuffix2: undefined,
				priceSuffix3: undefined,
				newTab: false,
				newTab2: false,
				newTab3: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9,
		save: deprecatedSave_1_9,
	},
]

export default deprecated
