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
	ImageAltControl,
	ImageShapeControls,
	ProControl,
} from '~stackable/components'
import {
	createVideoBackground,
	descriptionPlaceholder,
	hasBackgroundOverlay,
	range,
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	createButtonAttributeNames,
} from '~stackable/util'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '~stackable/higher-order'
import { i18n, showProNotice } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__,
	_x,
	sprintf,
} from '@wordpress/i18n'
import {
	addFilter,
	applyFilters,
} from '@wordpress/hooks'
import {
	PanelBody,
	RangeControl,
} from '@wordpress/components'
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
					...applyFilters( 'stackable.pricing-box.edit.designs', [] ),
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
		borderRadius = 12,
		shadow = 3,
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
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<RangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
				/>
				{ show.borderRadius &&
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ ( borderRadius = 12 ) => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
					/>
				}
				{ show.shadow &&
					<RangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ ( shadow = 3 ) => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ show.columnBackground &&
				<PanelBody
					title={ __( 'Column Background', i18n ) }
					initialOpen={ false }
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelBody>
			}

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
				<ImageControlsHelperWithData
					image1Id={ props.attributes.image1Id }
					image2Id={ props.attributes.image2Id }
					image3Id={ props.attributes.image3Id }
					setAttributes={ props.setAttributes }
					attributes={ props.attributes }
				/>
				<ControlSeparator />
				<ResponsiveControl
					attrNameTemplate="Image%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
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
					label={ __( 'Title HTML Tag', i18n ) }
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
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Price', i18n ) }
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
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			{ showPrice &&
				<PanelAdvancedSettings
					title={ __( 'Price Prefix', i18n ) }
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
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button', i18n ) }
				checked={ showButton }
				onChange={ showButton => setAttributes( { showButton } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button%s' ),
				] }
				toggleAttributeName="showButton"
			>
				{ /* { range( 1, columns + 1 ).map( i => {
					return (
						<Fragment key={ i }>
							<URLInputControl
								label={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Link / URL', i18n ), i ) }
								value={ props.attributes[ `button${ i }Url` ] }
								onChange={ value => setAttributes( { [ `button${ i }Url` ]: value } ) }
								placeholder="http://"
							/>
							<ToggleControl
								label={ __( 'Open link in new window', i18n ) }
								checked={ props.attributes[ `button${ i }NewWindow` ] }
								onChange={ value => setAttributes( { [ `button${ i }NewWindow` ]: value } ) }
							/>
							<ToggleControl
								label={ __( 'Nofollow link', i18n ) }
								checked={ props.attributes[ `button${ i }NoFollow` ] }
								onChange={ value => setAttributes( { [ `button${ i }NoFollow` ]: value } ) }
							/>
						</Fragment>
					)
				} ) } */ }
				<ButtonControlsHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					onChangeUrl={ false }
					onChangeNewWindow={ false }
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
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Description', i18n ) }
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
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
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
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>
		</Fragment>
	)
} )

addFilter( 'stackable.pricing-box.edit.inspector.advanced.before', 'stackable/pricing-box', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		showImage = true,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			{ showImage && range( 1, columns + 1 ).map( i => {
				return (
					<PanelBody
						title={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Image', i18n ), i ) }
						initialOpen={ false }
						key={ i }
					>
						<ImageAltControl
							value={ props.attributes[ `image${ i }Alt` ] }
							onChange={ value => setAttributes( { [ `image${ i }Alt` ]: value } ) }
						/>
						<ImageShapeControls
							imageId={ props.attributes[ `image${ i }Id` ] }
							imageSize={ props.attributes[ `image${ i }Size` ] }
							shape={ props.attributes[ `image${ i }Shape` ] || props.attributes.imageShape }
							shapeFlipX={ props.attributes[ `image${ i }ShapeFlipX` ] }
							shapeFlipY={ props.attributes[ `image${ i }ShapeFlipY` ] }
							shapeStretch={ props.attributes[ `image${ i }ShapeStretch` ] }
							onChangeShape={ value => setAttributes( { [ `image${ i }Shape` ]: value } ) }
							onChangeShapeFlipX={ value => setAttributes( { [ `image${ i }ShapeFlipX` ]: value } ) }
							onChangeShapeFlipY={ value => setAttributes( { [ `image${ i }ShapeFlipY` ]: value } ) }
							onChangeShapeStretch={ value => setAttributes( { [ `image${ i }ShapeStretch` ]: value } ) }
						/>
					</PanelBody>
				)
			} ) }
			{ showProNotice &&
				<PanelBody
					title={ __( 'Fine-Grained Controls', i18n ) }
					initialOpen={ false }
				>
					{ <ProControl type="advanced" /> }
				</PanelBody>
			}
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
		imageShape = '',
		imageWidth = '',
		design = 'basic',
		shadow = 3,
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
					const buttonText = attributes[ `button${ i }Text` ] || __( 'Button text', i18n )
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const price = attributes[ `price${ i }` ]
					const pricePrefix = attributes[ `pricePrefix${ i }` ]
					const priceSuffix = attributes[ `priceSuffix${ i }` ]
					const subPrice = attributes[ `subPrice${ i }` ]
					const overrideButton = attributes[ `overrideButton${ i }` ]

					const itemClasses = classnames( [
						'ugb-pricing-box__item',
						`ugb-pricing-box__item${ i }`,
					], applyFilters( 'stackable.pricing-box.itemclasses', {
						'ugb--has-background-overlay': show.columnBackground && hasBackgroundOverlay( 'column%s', props.attributes ),
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== 3,
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
										shape={ attributes[ `image${ i }Shape` ] || imageShape }
										alt={ imageAlt }
										width={ imageWidth }
									/>
								}
							/>
						</div>
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
							placeholder={ __( 'Description', i18n ) }
							keepPlaceholderOnFocus
						/>
					const buttonComp = (
						<div className="ugb-pricing-box__button">
							<ButtonEditHelper
								attrNameTemplate={ ! overrideButton ? `button%s` : `button${ i }%s` }
								setAttributes={ setAttributes }
								blockAttributes={ props.attributes }
								text={ buttonText }
								icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
								onChange={ value => setAttributes( { [ `button${ i }Text` ]: value } ) }
								onChangeIcon={ value => setAttributes( { [ `button${ i }Icon` ]: value } ) }
								url={ attributes[ `button${ i }Url` ] }
								newWindow={ attributes[ `button${ i }NewWindow` ] }
								noFollow={ attributes[ `button${ i }NoFollow` ] }
								onChangeUrl={ value => setAttributes( { [ `button${ i }Url` ]: value } ) }
								onChangeNewWindow={ value => setAttributes( { [ `button${ i }NewWindow` ]: value } ) }
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
						titleComp,
						priceComp,
						subPriceComp,
						buttonComp,
						descriptionComp,
					}

					return (
						<div className={ itemClasses } key={ i }>
							{ show.columnBackground && createVideoBackground( 'column%s', props ) }
							{ applyFilters( 'stackable.pricing-box.edit.output', (
								<Fragment>
									{ showImage && imageComp }
									{ showTitle && titleComp }
									{ showPrice && priceComp }
									{ showSubPrice && subPriceComp }
									{ showButton && buttonComp }
									{ showDescription && descriptionComp }
								</Fragment>
							), design, comps, i, props ) }
						</div>
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
)( edit )

const ImageControlsHelperWithData_ = props => {
	return (
		<ImageControlsHelper
			attrNameTemplate="image%s"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.attributes }
			onChangeImage={ false }
			onChangeAlt={ false }
			onChangeBlendMode={ false }
			onChangeSize={ size => {
				const currentSelectedSize = size || 'medium'
				const attributes = {
					imageSize: size,
				}
				if ( props.image1Data ) {
					attributes.image1Url = props.image1Data.media_details.sizes[ currentSelectedSize ] ? props.image1Data.media_details.sizes[ currentSelectedSize ].source_url : props.image1Data.source_url
				}
				if ( props.image2Data ) {
					attributes.image2Url = props.image2Data.media_details.sizes[ currentSelectedSize ] ? props.image2Data.media_details.sizes[ currentSelectedSize ].source_url : props.image2Data.source_url
				}
				if ( props.image3Data ) {
					attributes.image3Url = props.image3Data.media_details.sizes[ currentSelectedSize ] ? props.image3Data.media_details.sizes[ currentSelectedSize ].source_url : props.image3Data.source_url
				}

				props.setAttributes( attributes )
			} }
		/>
	)
}

const ImageControlsHelperWithData = compose(
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' )
		return {
			image1Data: props.image1Id ? getMedia( props.image1Id ) : null,
			image2Data: props.image2Id ? getMedia( props.image2Id ) : null,
			image3Data: props.image3Id ? getMedia( props.image3Id ) : null,
		}
	} ),
)( ImageControlsHelperWithData_ )
