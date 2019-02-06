import {
	ButtonEdit, DesignPanelBody, ImageUploadPlaceholder, PanelButtonSettings, ProControl, URLInputControl,
} from '@stackable/components'
import { descriptionPlaceholder, range } from '@stackable/util'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	PanelBody, RangeControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		isSelected,
		className,
		setAttributes,
		attributes,
	} = props

	const {
		pricingBoxColor,
		priceColor,
		perMonthLabelColor,
		buttonColor,
		buttonTextColor,
		buttonDesign,
		buttonIcon,
		featureListColor,
		columns,
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
		<Fragment>
			<InspectorControls>
				<DesignPanelBody
					initialOpen={ true }
					selected={ design }
					options={ [
						{
							image: ImageDesignBasic, label: __( 'Basic' ), value: 'basic',
						},
						{
							image: ImageDesignPlain, label: __( 'Plain' ), value: 'plain',
						},
						...applyFilters( 'stackable.pricing-box.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.pricing-box.edit.designs.before', null, props ) }
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Shadow / Outline' ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ applyFilters( 'stackable.pricing-box.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings' ) }>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 3 }
					/>
				</PanelBody>
				<PanelColorSettings
					initialOpen={ false }
					title={ __( 'Text Colors' ) }
					colorSettings={ [
						{
							value: pricingBoxColor,
							onChange: colorValue => setAttributes( { pricingBoxColor: colorValue } ),
							label: __( 'Pricing Title Color' ),
						},
						{
							value: priceColor,
							onChange: colorValue => setAttributes( { priceColor: colorValue } ),
							label: __( 'Price Color' ),
						},
						{
							value: perMonthLabelColor,
							onChange: colorValue => setAttributes( { perMonthLabelColor: colorValue } ),
							label: __( 'Per Month Label Color' ),
						},
						{
							value: featureListColor,
							onChange: colorValue => setAttributes( { featureListColor: colorValue } ),
							label: __( 'Feature List Color' ),
						},
					] }
				>
				</PanelColorSettings>
				<PanelButtonSettings
					initialOpen={ false }
					buttonColor={ buttonColor }
					buttonTextColor={ buttonTextColor }
					buttonSize={ size }
					buttonBorderRadius={ cornerButtonRadius }
					buttonDesign={ buttonDesign }
					buttonIcon={ buttonIcon }
					onChangeButtonColor={ value => setAttributes( { buttonColor: value } ) }
					onChangeButtonTextColor={ value => setAttributes( { buttonTextColor: value } ) }
					onChangeButtonSize={ value => {
						setAttributes( { size: value } )
					} }
					onChangeButtonBorderRadius={ value => setAttributes( { cornerButtonRadius: value } ) }
					onChangeButtonDesign={ buttonDesign => setAttributes( { buttonDesign } ) }
					onChangeButtonIcon={ buttonIcon => setAttributes( { buttonIcon } ) }
				/>
			</InspectorControls>
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
					const imageID = attributes[ `imageID${ index }` ]
					return (
						<div key={ i }>
							<div className={ boxClasses } style={ boxStyle }>
								<div
									className="ugb-pricing-box__image"
									data-is-placeholder-visible={ ! imageURL }
								>
									<ImageUploadPlaceholder
										imageID={ imageID }
										imageURL={ imageURL }
										onRemove={ () => {
											setAttributes( {
												[ `imageURL${ index }` ]: '',
												[ `imageID${ index }` ]: '',
												[ `imageAlt${ index }` ]: '',
											} )
										} }
										onChange={ ( { url, id, alt } ) => {
											setAttributes( {
												[ `imageURL${ index }` ]: url,
												[ `imageID${ index }` ]: id,
												[ `imageAlt${ index }` ]: alt,
											} )
										} }
										render={ <img src={ imageURL } alt={ title } /> }
									/>
								</div>
								<RichText
									tagName="h3"
									className="ugb-pricing-box__title"
									value={ title }
									onChange={ value => setAttributes( { [ `pricingBoxTitle${ index }` ]: value } ) }
									style={ {
										color: pricingBoxColor,
									} }
									placeholder={ __( 'Title' ) }
									keepPlaceholderOnFocus
								/>
								<div className="ugb-pricing-box__price-wrapper">
									<div className="ugb-pricing-box__price-line">
										<RichText
											tagName="div"
											className="ugb-pricing-box__price-prefix"
											value={ pricePrefix }
											onChange={ value => setAttributes( { [ `pricePrefix${ index }` ]: value } ) }
											style={ {
												color: priceColor,
											} }
											placeholder="$"
											keepPlaceholderOnFocus
										/>
										<RichText
											tagName="div"
											className="ugb-pricing-box__price"
											value={ price }
											onChange={ value => setAttributes( { [ `price${ index }` ]: value } ) }
											style={ {
												color: priceColor,
											} }
											placeholder="9"
											keepPlaceholderOnFocus
										/>
										<RichText
											tagName="div"
											className="ugb-pricing-box__price-suffix"
											value={ priceSuffix }
											onChange={ value => setAttributes( { [ `priceSuffix${ index }` ]: value } ) }
											style={ {
												color: priceColor,
											} }
											placeholder=".00"
											keepPlaceholderOnFocus
										/>
									</div>
									<RichText
										tagName="p"
										className="ugb-pricing-box__subprice"
										value={ subPrice }
										onChange={ value => setAttributes( { [ `perMonthLabel${ index }` ]: value } ) }
										style={ {
											color: perMonthLabelColor,
										} }
										placeholder={ __( 'Description' ) }
										keepPlaceholderOnFocus
									/>
								</div>
								<ButtonEdit
									size={ size }
									color={ buttonTextColor }
									backgroundColor={ buttonColor }
									text={ buttonText }
									borderRadius={ cornerButtonRadius }
									design={ buttonDesign }
									icon={ buttonIcon }
									onChange={ value => setAttributes( { [ `buttonText${ index }` ]: value } ) }
								/>
								<RichText
									tagName="p"
									value={ description }
									className="ugb-pricing-box__description"
									onChange={ value => setAttributes( { [ `featureList${ index }` ]: value } ) }
									style={ {
										color: featureListColor,
									} }
									placeholder={ descriptionPlaceholder( 'medium' ) }
									keepPlaceholderOnFocus
								/>
							</div>
							{
								isSelected && (
									<URLInputControl
										value={ buttonURL }
										newTab={ buttonNewTab }
										onChange={ value => setAttributes( { [ `url${ index }` ]: value } ) }
										onChangeNewTab={ value => setAttributes( { [ `newTab${ index }` ]: value } ) }
									/>
								)
							}
						</div>
					)
				} ) }
			</div>
		</Fragment>
	)
}

export default edit
