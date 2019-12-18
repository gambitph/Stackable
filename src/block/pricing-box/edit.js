/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { createStyles } from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	BlockContainer,
	ButtonEditHelper,
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	Image,
	BackgroundControlsHelper,
	ContentAlignControl,
	ImageControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	HeadingButtonsControl,
	ColorPaletteControl,
	ResponsiveControl,
	AlignButtonsControl,
	ButtonControlsHelper,
	ControlSeparator,
	PanelSpacingBody,
	AdvancedRangeControl,
	DivBackground,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	createButtonAttributeNames,
	cacheImageData,
	getImageUrlFromCache,
} from '~stackable/util'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'
import { i18n, showProNotice } from 'stackable'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	addFilter,
	applyFilters,
} from '@wordpress/hooks'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.pricing-box.edit.inspector.layout.before', 'stackable/pricing-box', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
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
					...applyFilters( 'stackable.pricing-box.edit.layouts', [] ),
				] }
				onChange={ design => {
					setAttributes( { design } )
				} }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.pricing-box.edit.inspector.style.before', 'stackable/pricing-box', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		titleColor,
		descriptionColor,
		borderRadius = '',
		shadow = '',
		showImage = true,
		showTitle = true,
		showPricePrefix = true,
		showPrice = true,
		showPriceSuffix = true,
		showSubPrice = true,
		showDescription = true,
		titleTag = '',
		priceColor = '',
		pricePrefixColor = '',
		priceSuffixColor = '',
		subPriceColor = '',
		showButton = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
					className="ugb--help-tip-general-columns"
				/>
				{ show.borderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
				}
				{ show.shadow &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
						className="ugb--help-tip-general-shadow"
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ applyFilters( 'stackable.pricing-box.edit.inspector.style.general.after', null, props ) }

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Column Background', i18n ) }
					id="column-background"
					initialOpen={ false }
					className="ugb--help-tip-column-background-on-off"
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelAdvancedSettings>
			}

			{ applyFilters( 'stackable.pricing-box.edit.inspector.style.column.after', null, props ) }

			{ show.imageSettings &&
				<PanelAdvancedSettings
					title={ __( 'Image', i18n ) }
					checked={ showImage }
					onChange={ showImage => setAttributes( { showImage } ) }
					toggleOnSetAttributes={ [
						'imageSize',
						'imageShape',
						'imageShapeFlipX',
						'imageShapeFlipY',
						'imageShapeStretch',
						'imageWidth',
						...createResponsiveAttributeNames( 'image%sWidth' ),
						'imageBorderRadius',
						'imageShadow',
						'imageBlendMode',
					] }
					toggleAttributeName="showImage"
				>
					<ImageControlsHelper
						attrNameTemplate="image%s"
						setAttributes={ props.setAttributes }
						blockAttributes={ props.attributes }
						onChangeImage={ false }
						onChangeAlt={ false }
						onChangeBlendMode={ false }
						onChangeSize={ size => {
							setAttributes( {
								imageSize: size,
								image1Url: getImageUrlFromCache( image1Id, size || 'medium' ),
								image2Url: getImageUrlFromCache( image2Id, size || 'medium' ),
								image3Url: getImageUrlFromCache( image3Id, size || 'medium' ),
							} )
						} }
					/>
					<ControlSeparator />
					<ResponsiveControl
						attrNameTemplate="Image%sAlign"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							className="ugb--help-tip-pricing-image-align"
						/>
					</ResponsiveControl>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleTag',
					'titleColor',
					...createResponsiveAttributeNames( 'Title%sAlign' ),
				] }
				toggleAttributeName="showTitle"
			>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<HeadingButtonsControl
					value={ titleTag || 'h3' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Title Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-pricing-title-align"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Price', i18n ) }
				id="price"
				checked={ showPrice }
				onChange={ showPrice => setAttributes( { showPrice } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'price%s' ),
					'priceColor',
					...createResponsiveAttributeNames( 'Price%sAlign' ),
				] }
				toggleAttributeName="showPrice"
			>
				<TypographyControlHelper
					attrNameTemplate="price%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ priceColor }
					onChange={ priceColor => setAttributes( { priceColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Price%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-pricing-price-align"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			{ showPrice &&
				<PanelAdvancedSettings
					title={ __( 'Price Prefix', i18n ) }
					id="price-prefix"
					checked={ showPricePrefix }
					onChange={ showPricePrefix => setAttributes( { showPricePrefix } ) }
					toggleOnSetAttributes={ [
						...createTypographyAttributeNames( 'pricePrefix%s' ),
						'pricePrefixColor',
					] }
					toggleAttributeName="showPricePrefix"
				>
					<TypographyControlHelper
						attrNameTemplate="pricePrefix%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
						onChangeFontFamily={ false }
						onChangeTextTransform={ false }
						onChangeLetterSpacing={ false }
					/>
					<ColorPaletteControl
						value={ pricePrefixColor }
						onChange={ pricePrefixColor => setAttributes( { pricePrefixColor } ) }
						label={ __( 'Text Color', i18n ) }
					/>
				</PanelAdvancedSettings>
			}

			{ showPrice &&
				<PanelAdvancedSettings
					title={ __( 'Price Suffix', i18n ) }
					id="price-suffix"
					checked={ showPriceSuffix }
					onChange={ showPriceSuffix => setAttributes( { showPriceSuffix } ) }
					toggleOnSetAttributes={ [
						...createTypographyAttributeNames( 'priceSuffix%s' ),
						'priceSuffixColor',
					] }
					toggleAttributeName="showPriceSuffix"
				>
					<TypographyControlHelper
						attrNameTemplate="priceSuffix%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
						onChangeFontFamily={ false }
						onChangeTextTransform={ false }
						onChangeLetterSpacing={ false }
					/>
					<ColorPaletteControl
						value={ priceSuffixColor }
						onChange={ priceSuffixColor => setAttributes( { priceSuffixColor } ) }
						label={ __( 'Text Color', i18n ) }
					/>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Sub Price', i18n ) }
				id="subprice"
				checked={ showSubPrice }
				onChange={ showSubPrice => setAttributes( { showSubPrice } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'subPrice%s' ),
					'subPriceColor',
					...createResponsiveAttributeNames( 'subPrice%sAlign' ),
				] }
				toggleAttributeName="showSubPrice"
			>
				<TypographyControlHelper
					attrNameTemplate="subPrice%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ subPriceColor }
					onChange={ subPriceColor => setAttributes( { subPriceColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="subPrice%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-pricing-subprice-align"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button', i18n ) }
				id="button"
				checked={ showButton }
				onChange={ showButton => setAttributes( { showButton } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button%s' ),
				] }
				toggleAttributeName="showButton"
			>
				<ButtonControlsHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					onChangeUrl={ false }
					onChangeNewTab={ false }
					onChangeNoFollow={ false }
				/>
				<ControlSeparator />
				<ResponsiveControl
					attrNameTemplate="button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-pricing-button-align"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Description', i18n ) }
				id="description"
				checked={ showDescription }
				onChange={ showDescription => setAttributes( { showDescription } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'description%s' ),
					'descriptionColor',
					...createResponsiveAttributeNames( 'description%sAlign' ),
				] }
				toggleAttributeName="showDescription"
			>
				<TypographyControlHelper
					attrNameTemplate="description%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ descriptionColor }
					onChange={ descriptionColor => setAttributes( { descriptionColor } ) }
					label={ __( 'Description Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="description%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-pricing-button-align"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ show.imageSpacing &&
					<ResponsiveControl
						attrNameTemplate="image%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-pricing-image-spacing"
						/>
					</ResponsiveControl>
				}
				{ show.titleSpacing && (
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-pricing-title-spacing"
						/>
					</ResponsiveControl>
				) }
				{ show.priceSpacing && (
					<ResponsiveControl
						attrNameTemplate="price%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Price', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-pricing-price-spacing"
						/>
					</ResponsiveControl>
				) }
				{ show.subPriceSpacing && (
					<ResponsiveControl
						attrNameTemplate="subPrice%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Sub Price', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-pricing-subprice-spacing"
						/>
					</ResponsiveControl>
				) }
				{ show.buttonSpacing && (
					<ResponsiveControl
						attrNameTemplate="button%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Button', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-pricing-button-spacing"
						/>
					</ResponsiveControl>
				) }
				{ show.descriptionSpacing && (
					<ResponsiveControl
						attrNameTemplate="description%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Description', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-pricing-description-spacing"
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
		attributes,
	} = props

	const {
		columns = 3,
		imageSize,
		imageShadow = '',
		imageShape = '',
		imageShapeStretch = false,
		imageWidth = '',
		design = 'basic',
		shadow = '',
		titleTag = '',
		showImage = true,
		showTitle = true,
		showPrice = true,
		showPricePrefix = true,
		showPriceSuffix = true,
		showSubPrice = true,
		showButton = true,
		showDescription = true,
		buttonIcon = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-pricing-box--v3',
		`ugb-pricing-box--columns-${ columns }`,
		`ugb-pricing-box--design-${ design }`,
	], applyFilters( 'stackable.pricing-box.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					// const imageWidth = attributes[ `image${ i }Width` ]
					// const imageHeight = attributes[ `image${ i }Height` ]
					const buttonText = attributes[ `button${ i }Text` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const price = attributes[ `price${ i }` ]
					const pricePrefix = attributes[ `pricePrefix${ i }` ]
					const priceSuffix = attributes[ `priceSuffix${ i }` ]
					const subPrice = attributes[ `subPrice${ i }` ]

					const itemClasses = classnames( [
						'ugb-pricing-box__item',
						`ugb-pricing-box__item${ i }`,
					], applyFilters( 'stackable.pricing-box.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					const imageComp = (
						<div className="ugb-pricing-box__image">
							<ImageUploadPlaceholder
								imageID={ imageId }
								imageURL={ imageUrl }
								imageSize={ imageSize }
								// className={ imageClasses }
								onRemove={ () => {
									setAttributes( {
										[ `image${ i }Url` ]: '',
										[ `image${ i }Id` ]: '',
										[ `image${ i }Alt` ]: '',
										[ `image${ i }Width` ]: '',
										[ `image${ i }Height` ]: '',
									} )
								} }
								onChange={ image => {
									setAttributes( {
										[ `image${ i }Url` ]: image.url,
										[ `image${ i }Id` ]: image.id,
										[ `image${ i }Alt` ]: image.alt,
										[ `image${ i }Width` ]: image.width,
										[ `image${ i }Height` ]: image.height,
									} )
								} }
								render={
									<Image
										imageId={ imageId }
										src={ imageUrl }
										size={ imageSize }
										shadow={ imageShadow }
										shape={ attributes[ `image${ i }Shape` ] || imageShape }
										shapeStretch={ attributes[ `image${ i }ShapeStretch` ] || imageShapeStretch }
										alt={ imageAlt }
										width={ imageWidth }
									/>
								}
							/>
						</div>
					)
					const imageBgComp = (
						<ImageUploadPlaceholder
							imageID={ imageId }
							imageURL={ imageUrl }
							imageSize={ imageSize }
							className="ugb-pricing-box__image"
							onRemove={ () => {
								setAttributes( {
									[ `image${ i }Url` ]: '',
									[ `image${ i }Id` ]: '',
									[ `image${ i }Alt` ]: '',
									[ `image${ i }Width` ]: '',
									[ `image${ i }Height` ]: '',
								} )
							} }
							onChange={ image => {
								setAttributes( {
									[ `image${ i }Url` ]: image.url,
									[ `image${ i }Id` ]: image.id,
									[ `image${ i }Alt` ]: image.alt,
									[ `image${ i }Width` ]: image.width,
									[ `image${ i }Height` ]: image.height,
								} )
							} }
						/>
					)
					const titleComp = (
						<RichText
							tagName={ titleTag || 'h3' }
							className="ugb-pricing-box__title"
							value={ title }
							onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
							placeholder={ __( 'Title', i18n ) }
							keepPlaceholderOnFocus
						/>
					)
					const priceComp = (
						<div className="ugb-pricing-box__price-wrapper">
							<div className="ugb-pricing-box__price-line">
								{ showPricePrefix &&
									<RichText
										tagName="div"
										className="ugb-pricing-box__price-prefix"
										value={ pricePrefix }
										onChange={ value => setAttributes( { [ `pricePrefix${ i }` ]: value } ) }
										placeholder="$"
										keepPlaceholderOnFocus
									/>
								}
								<RichText
									tagName="div"
									className="ugb-pricing-box__price"
									value={ price }
									onChange={ value => setAttributes( { [ `price${ i }` ]: value } ) }
									placeholder="9"
									keepPlaceholderOnFocus
								/>
								{ showPriceSuffix &&
									<RichText
										tagName="div"
										className="ugb-pricing-box__price-suffix"
										value={ priceSuffix }
										onChange={ value => setAttributes( { [ `priceSuffix${ i }` ]: value } ) }
										placeholder=".00"
										keepPlaceholderOnFocus
									/>
								}
							</div>
						</div>
					)
					const subPriceComp =
						<RichText
							tagName="p"
							className="ugb-pricing-box__subprice"
							value={ subPrice }
							onChange={ value => setAttributes( { [ `subPrice${ i }` ]: value } ) }
							placeholder={ __( 'Sub Price', i18n ) }
							keepPlaceholderOnFocus
						/>
					const buttonComp = (
						<div className="ugb-pricing-box__button">
							<ButtonEditHelper
								attrNameTemplate={ `button%s` }
								setAttributes={ setAttributes }
								blockAttributes={ props.attributes }
								text={ buttonText }
								icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
								onChange={ value => setAttributes( { [ `button${ i }Text` ]: value } ) }
								onChangeIcon={ value => setAttributes( { [ `button${ i }Icon` ]: value } ) }
								url={ attributes[ `button${ i }Url` ] }
								newTab={ attributes[ `button${ i }NewTab` ] }
								noFollow={ attributes[ `button${ i }NoFollow` ] }
								onChangeUrl={ value => setAttributes( { [ `button${ i }Url` ]: value } ) }
								onChangeNewTab={ value => setAttributes( { [ `button${ i }NewTab` ]: value } ) }
								onChangeNoFollow={ value => setAttributes( { [ `button${ i }NoFollow` ]: value } ) }
							/>
						</div>
					)
					const descriptionComp = (
						<RichText
							tagName="p"
							value={ description }
							className="ugb-pricing-box__description"
							onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
							placeholder={ descriptionPlaceholder( 'short' ) }
							keepPlaceholderOnFocus
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
							{ applyFilters( 'stackable.pricing-box.edit.content', (
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
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Image%sAlign', 'Title%sAlign', 'Price%sAlign', 'SubPrice%sAlign', 'Button%sAlign', 'Description%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-pricing-box__header', 'column-header' ],
		[ '.ugb-pricing-box__item', 'column-background' ],
		[ '.ugb-pricing-box__title', 'title' ],
		[ '.ugb-pricing-box__price-prefix', 'price-prefix' ],
		[ '.ugb-pricing-box__price', 'price' ],
		[ '.ugb-pricing-box__price-suffix', 'price-suffix' ],
		[ '.ugb-pricing-box__subprice', 'subprice' ],
		[ '.ugb-button', 'button' ],
		[ '.ugb-pricing-box__description', 'description' ],
	] ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
	} ),
)( edit )
