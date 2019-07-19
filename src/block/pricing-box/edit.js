import {
	ButtonEdit, DesignPanelBody, ImageUploadPlaceholder, PanelButtonSettings, ProControl, ProControlButton, URLInputControl,
} from '@stackable/components'
import { descriptionPlaceholder, isDarkColor, range } from '@stackable/util'
import { i18n, showProNotice } from 'stackable'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	PanelBody, RangeControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'

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
		highlightColor = '',
		highlightColor2 = '',
		highlightColor3 = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-pricing-box',
		'ugb-pricing-box--v2',
		`ugb-pricing-box--columns-${ columns }`,
		`ugb-pricing-box--design-${ design }`,
	], applyFilters( 'stackable.pricing-box.mainclasses', {}, design, props ) )

	return (
		<Fragment>
			<InspectorControls>
				<DesignPanelBody
					initialOpen={ true }
					selected={ design }
					options={ [
						{
							image: ImageDesignBasic, label: __( 'Basic', i18n ), value: 'basic',
						},
						{
							image: ImageDesignPlain, label: __( 'Plain', i18n ), value: 'plain',
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
							label={ __( 'Border Radius', i18n ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Shadow / Outline', i18n ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ applyFilters( 'stackable.pricing-box.edit.designs.after', null, props ) }
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings', i18n ) }>
					<RangeControl
						label={ __( 'Columns', i18n ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 3 }
					/>
				</PanelBody>
				{ design !== 'plain' &&
					<PanelColorSettings
						initialOpen={ false }
						title={ __( 'Column Highlight Colors', i18n ) }
						colorSettings={ [
							{
								value: highlightColor,
								onChange: highlightColor => setAttributes( { highlightColor } ),
								label: __( 'Column #1 Highlight', i18n ),
							},
							...( columns < 2 ? [] : [
								{
									value: highlightColor2,
									onChange: highlightColor2 => setAttributes( { highlightColor2 } ),
									label: __( 'Column #2 Highlight', i18n ),
								},
							] ),
							...( columns < 3 ? [] : [
								{
									value: highlightColor3,
									onChange: highlightColor3 => setAttributes( { highlightColor3 } ),
									label: __( 'Column #3 Highlight', i18n ),
								},
							] ),
						] }
					/>
				}
				<PanelColorSettings
					initialOpen={ false }
					title={ __( 'Text Colors', i18n ) }
					colorSettings={ [
						{
							value: pricingBoxColor,
							onChange: colorValue => setAttributes( { pricingBoxColor: colorValue } ),
							label: __( 'Pricing Title Color', i18n ),
						},
						{
							value: priceColor,
							onChange: colorValue => setAttributes( { priceColor: colorValue } ),
							label: __( 'Price Color', i18n ),
						},
						{
							value: perMonthLabelColor,
							onChange: colorValue => setAttributes( { perMonthLabelColor: colorValue } ),
							label: __( 'Per Month Label Color', i18n ),
						},
						{
							value: featureListColor,
							onChange: colorValue => setAttributes( { featureListColor: colorValue } ),
							label: __( 'Feature List Color', i18n ),
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
					onChangeButtonColor={ buttonColor => setAttributes( { buttonColor } ) }
					onChangeButtonTextColor={ buttonTextColor => setAttributes( { buttonTextColor } ) }
					onChangeButtonSize={ size => setAttributes( { size } ) }
					onChangeButtonBorderRadius={ cornerButtonRadius => setAttributes( { cornerButtonRadius } ) }
					onChangeButtonDesign={ buttonDesign => setAttributes( { buttonDesign } ) }
					onChangeButtonIcon={ buttonIcon => setAttributes( { buttonIcon } ) }
				/>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS', i18n ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.pricing-box.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses }>
				{ applyFilters( 'stackable.pricing-box.edit.output.before', null, design, props ) }
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
						<div key={ i }>
							<div className={ itemClasses } style={ styles.item }>
								{ ( () => {
									const imageBGComp = (
										<div
											className="ugb-pricing-box__image-bg"
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
											/>
										</div>
									)
									const imageComp = (
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
									)
									const titleComp = (
										<RichText
											tagName="h3"
											className="ugb-pricing-box__title"
											value={ title }
											onChange={ value => setAttributes( { [ `pricingBoxTitle${ index }` ]: value } ) }
											style={ styles.title }
											placeholder={ __( 'Title', i18n ) }
											keepPlaceholderOnFocus
										/>
									)
									const priceComp = (
										<div className="ugb-pricing-box__price-wrapper">
											<div className="ugb-pricing-box__price-line">
												<RichText
													tagName="div"
													className="ugb-pricing-box__price-prefix"
													value={ pricePrefix }
													onChange={ value => setAttributes( { [ `pricePrefix${ index }` ]: value } ) }
													style={ styles.price }
													placeholder="$"
													keepPlaceholderOnFocus
												/>
												<RichText
													tagName="div"
													className="ugb-pricing-box__price"
													value={ price }
													onChange={ value => setAttributes( { [ `price${ index }` ]: value } ) }
													style={ styles.price }
													placeholder="9"
													keepPlaceholderOnFocus
												/>
												<RichText
													tagName="div"
													className="ugb-pricing-box__price-suffix"
													value={ priceSuffix }
													onChange={ value => setAttributes( { [ `priceSuffix${ index }` ]: value } ) }
													style={ styles.price }
													placeholder=".00"
													keepPlaceholderOnFocus
												/>
											</div>
											<RichText
												tagName="p"
												className="ugb-pricing-box__subprice"
												value={ subPrice }
												onChange={ value => setAttributes( { [ `perMonthLabel${ index }` ]: value } ) }
												style={ styles.month }
												placeholder={ __( 'Description', i18n ) }
												keepPlaceholderOnFocus
											/>
										</div>
									)
									const buttonComp = (
										<div className="ugb-pricing-box__button">
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
										</div>
									)
									const descriptionComp = (
										<RichText
											tagName="p"
											value={ description }
											className="ugb-pricing-box__description"
											onChange={ value => setAttributes( { [ `featureList${ index }` ]: value } ) }
											style={ styles.description }
											placeholder={ descriptionPlaceholder( 'medium' ) }
											keepPlaceholderOnFocus
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
									return applyFilters( 'stackable.pricing-box.edit.output', (
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
				{ applyFilters( 'stackable.pricing-box.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
