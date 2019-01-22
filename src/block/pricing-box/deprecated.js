import {
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_9,
} from '@stackable/components/button-edit'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { RichText } from '@wordpress/editor'

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
		default: __( 'Title' ),
	},
	pricingBoxTitle2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two h3',
		default: __( 'Title' ),
	},
	pricingBoxTitle3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three h3',
		default: __( 'Title' ),
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
		default: __( 'Description' ),
	},
	perMonthLabel2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-per-month-label',
		default: __( 'Description' ),
	},
	perMonthLabel3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-per-month-label',
		default: __( 'Description' ),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-button span',
		default: __( 'Button text' ),
	},
	buttonText2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-button span',
		default: __( 'Button text' ),
	},
	buttonText3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-button span',
		default: __( 'Button text' ),
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
		default: __( 'Basic' ),
	},
	pricingBoxTitle2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two h3',
		default: __( 'Basic' ),
	},
	pricingBoxTitle3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three h3',
		default: __( 'Basic' ),
	},
	price: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-pricing',
		default: __( '$9' ),
	},
	price2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-pricing',
		default: __( '$9' ),
	},
	price3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-pricing',
		default: __( '$9' ),
	},
	perMonthLabel: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-per-month-label',
		default: __( 'per month' ),
	},
	perMonthLabel2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-per-month-label',
		default: __( 'per month' ),
	},
	perMonthLabel3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-per-month-label',
		default: __( 'per month' ),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-button a',
		default: __( 'Buy Now' ),
	},
	buttonText2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-button a',
		default: __( 'Buy Now' ),
	},
	buttonText3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-button a',
		default: __( 'Buy Now' ),
	},
	featureList: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-feature-list',
		default: __( 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec' ),
	},
	featureList2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-feature-list',
		default: __( 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec' ),
	},
	featureList3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-feature-list',
		default: __( 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec' ),
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

export const deprecatedSchema_0_7 = {
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
		default: __( 'Basic' ),
	},
	pricingBoxTitle2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two h3',
		default: __( 'Basic' ),
	},
	pricingBoxTitle3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three h3',
		default: __( 'Basic' ),
	},
	price: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-pricing',
		default: __( '$9' ),
	},
	price2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-pricing',
		default: __( '$9' ),
	},
	price3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-pricing',
		default: __( '$9' ),
	},
	perMonthLabel: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-per-month-label',
		default: __( 'per month' ),
	},
	perMonthLabel2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-per-month-label',
		default: __( 'per month' ),
	},
	perMonthLabel3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-per-month-label',
		default: __( 'per month' ),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-button a',
		default: __( 'Buy Now' ),
	},
	buttonText2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-button a',
		default: __( 'Buy Now' ),
	},
	buttonText3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-button a',
		default: __( 'Buy Now' ),
	},
	featureList: {
		source: 'html',
		selector: '.ugb-pricing-box-column-one .ugb-pricing-box-feature-list',
		default: __( 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec' ),
	},
	featureList2: {
		source: 'html',
		selector: '.ugb-pricing-box-column-two .ugb-pricing-box-feature-list',
		default: __( 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec' ),
	},
	featureList3: {
		source: 'html',
		selector: '.ugb-pricing-box-column-three .ugb-pricing-box-feature-list',
		default: __( 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec' ),
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

export const deprecatedSave_0_7 = props => {
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
		featureListColor,
		columns,
		size,
		cornerButtonRadius,
	} = props.attributes

	const buttonStyle = {
		backgroundColor: buttonColor,
		color: buttonTextColor,
		borderRadius: cornerButtonRadius + 'px',
	}

	return (
		<div className={ `ugb-pricing-box column-${ columns }` }>
			<div className="ugb-pricing-box-column-one">
				{ pricingBoxTitle && !! pricingBoxTitle.length && (
					<h3 style={ { color: pricingBoxColor } }>
						{ pricingBoxTitle }
					</h3>
				) }
				{ price && !! price.length && (
					<p className="ugb-pricing-box-pricing" style={ { color: priceColor } }>
						{ price }
					</p>
				) }
				{ perMonthLabel && !! perMonthLabel.length && (
					<p className="ugb-pricing-box-per-month-label" style={ { color: perMonthLabelColor } }>
						{ perMonthLabel }
					</p>
				) }
				{ buttonText && !! buttonText.length && (
					<a
						href={ url }
						className={ `wp-ugb-button ugb-button-${ size }` }
						style={ buttonStyle }>
						{ buttonText }
					</a>
				) }
				{ featureList && !! featureList.length && (
					<p className="ugb-pricing-box-feature-list" style={ { color: featureListColor } }>
						{ featureList }
					</p>
				) }
			</div>
			{ columns > 1 && (
				<div className="ugb-pricing-box-column-two">
					{ pricingBoxTitle2 && !! pricingBoxTitle2.length && (
						<h3 style={ { color: pricingBoxColor } }>
							{ pricingBoxTitle2 }
						</h3>
					) }
					{ price2 && !! price2.length && (
						<p className="ugb-pricing-box-pricing" style={ { color: priceColor } }>
							{ price2 }
						</p>
					) }
					{ perMonthLabel2 && !! perMonthLabel2.length && (
						<p className="ugb-pricing-box-per-month-label" style={ { color: perMonthLabelColor } }>
							{ perMonthLabel2 }
						</p>
					) }
					{ buttonText2 && !! buttonText2.length && (
						<a
							href={ url2 }
							className={ `wp-ugb-button ugb-button-${ size }` }
							style={ buttonStyle }>
							{ buttonText2 }
						</a>
					) }
					{ featureList2 && !! featureList2.length && (
						<p className="ugb-pricing-box-feature-list" style={ { color: featureListColor } }>
							{ featureList2 }
						</p>
					) }
				</div>
			) }
			{ columns > 2 && (
				<div className="ugb-pricing-box-column-three">
					{ pricingBoxTitle3 && !! pricingBoxTitle3.length && (
						<h3 style={ { color: pricingBoxColor } }>
							{ pricingBoxTitle3 }
						</h3>
					) }
					{ price3 && !! price3.length && (
						<p className="ugb-pricing-box-pricing" style={ { color: priceColor } }>
							{ price3 }
						</p>
					) }
					{ perMonthLabel3 && !! perMonthLabel3.length && (
						<p className="ugb-pricing-box-per-month-label" style={ { color: perMonthLabelColor } }>
							{ perMonthLabel3 }
						</p>
					) }
					{ buttonText3 && !! buttonText3.length && (
						<a
							href={ url3 }
							className={ `wp-ugb-button ugb-button-${ size }` }
							style={ buttonStyle }>
							{ buttonText3 }
						</a>
					) }
					{ featureList3 && !! featureList3.length && (
						<p className="ugb-pricing-box-feature-list" style={ { color: featureListColor } }>
							{ featureList3 }
						</p>
					) }
				</div>
			) }
		</div>
	)
}

const deprecated = [
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
	{
		attributes: deprecatedSchema_0_7,
		save: deprecatedSave_0_7,
	},
]

export default deprecated
