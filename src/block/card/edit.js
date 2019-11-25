/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	BlockContainer,
	ContentAlignControl,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	ColorPaletteControl,
	HeadingButtonsControl,
	AlignButtonsControl,
	ResponsiveControl,
	ControlSeparator,
	ButtonControlsHelper,
	PanelSpacingBody,
	AdvancedRangeControl,
	ButtonEditHelper,
	ImageBackgroundControlsHelper,
	WhenResponsiveScreen,
	DivBackground,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
	cacheImageData,
	getImageUrlFromCache,
	createImageBackgroundAttributeNames,
} from '~stackable/util'
import classnames from 'classnames'
import { range } from 'lodash'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { i18n, showProNotice } from 'stackable'
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import {
	PanelBody,
	RangeControl,
} from '@wordpress/components'
import {
	__,
} from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.card.edit.inspector.layout.before', 'stackable/card', ( output, props ) => {
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
				options={ applyFilters( 'stackable.card.edit.layouts', [
					{
						label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
					},
					{
						label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
					},
				] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.card.edit.inspector.style.before', 'stackable/card', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		borderRadius = '',
		shadow = '',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
		imageBackgroundWidth = '',
		imageBackgroundTabletWidth = '',
		imageBackgroundMobileWidth = '',
		imageBackgroundWidthUnit = '%',
		imageBackgroundTabletWidthUnit = '%',
		imageBackgroundMobileWidthUnit = '%',
		titleTag = '',
		titleColor = '',
		descriptionColor = '',
		subtitleColor = true,
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
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
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
					...createImageBackgroundAttributeNames( 'image%s' ),
					...createResponsiveAttributeNames( 'imageBackground%sHeight' ),
					...createResponsiveAttributeNames( 'imageBackground%sWidth' ),
				] }
				toggleAttributeName="showImage"
			>
				<ImageBackgroundControlsHelper
					attrNameTemplate="image%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					onChangeImage={ null }
					onChangeSize={ size => {
						setAttributes( {
							imageSize: size,
							image1Url: getImageUrlFromCache( image1Id, size || 'large' ),
							image2Url: getImageUrlFromCache( image2Id, size || 'large' ),
							image3Url: getImageUrlFromCache( image3Id, size || 'large' ),
						} )
					} }
				/>
				{ show.imageHeight &&
					<ResponsiveControl
						attrNameTemplate="imageBackground%sHeight"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image Height', i18n ) }
							min={ 50 }
							max={ 1000 }
							allowReset={ true }
							placeholder="300"
						/>
					</ResponsiveControl>
				}
				{ show.imageWidth &&
					<Fragment>
						<WhenResponsiveScreen>
							<AdvancedRangeControl
								label={ __( 'Image Width', i18n ) }
								units={ [ 'px', '%' ] }
								min={ [ 50, 10 ] }
								max={ [ 1000, 90 ] }
								step={ [ 1, 1 ] }
								allowReset={ true }
								value={ imageBackgroundWidth }
								unit={ imageBackgroundWidthUnit }
								onChange={ imageBackgroundWidth => setAttributes( { imageBackgroundWidth } ) }
								onChangeUnit={ imageBackgroundWidthUnit => setAttributes( { imageBackgroundWidthUnit } ) }
								placeholder="50"
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<AdvancedRangeControl
								label={ __( 'Image Width', i18n ) }
								units={ [ 'px', '%' ] }
								min={ [ 50, 10 ] }
								max={ [ 1000, 90 ] }
								step={ [ 1, 1 ] }
								allowReset={ true }
								value={ imageBackgroundTabletWidth }
								unit={ imageBackgroundTabletWidthUnit }
								onChange={ imageBackgroundTabletWidth => setAttributes( { imageBackgroundTabletWidth } ) }
								onChangeUnit={ imageBackgroundTabletWidthUnit => setAttributes( { imageBackgroundTabletWidthUnit } ) }
								placeholder="50"
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<AdvancedRangeControl
								label={ __( 'Image Width', i18n ) }
								units={ [ 'px', '%' ] }
								min={ [ 50, 10 ] }
								max={ [ 1000, 90 ] }
								step={ [ 1, 1 ] }
								allowReset={ true }
								value={ imageBackgroundMobileWidth }
								unit={ imageBackgroundMobileWidthUnit }
								onChange={ imageBackgroundMobileWidth => setAttributes( { imageBackgroundMobileWidth } ) }
								onChangeUnit={ imageBackgroundMobileWidthUnit => setAttributes( { imageBackgroundMobileWidthUnit } ) }
								placeholder="50"
							/>
						</WhenResponsiveScreen>
					</Fragment>
				}
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
					value={ titleTag || 'h4' }
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
				title={ __( 'Subtitle', i18n ) }
				checked={ showSubtitle }
				onChange={ showSubtitle => setAttributes( { showSubtitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'subtitle%s' ),
					'subtitleColor',
					...createResponsiveAttributeNames( 'subtitle%sAlign' ),
				] }
				toggleAttributeName="showSubtitle"
			>
				<TypographyControlHelper
					attrNameTemplate="subtitle%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ subtitleColor }
					onChange={ subtitleColor => setAttributes( { subtitleColor } ) }
					label={ __( 'Subtitle Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="subtitle%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
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

			<PanelAdvancedSettings
				title={ __( 'Button', i18n ) }
				checked={ showButton }
				onChange={ showButton => setAttributes( { showButton } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button%s' ),
					...createResponsiveAttributeNames( 'button%sAlign' ),
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
					attrNameTemplate="Button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
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
				{ show.titleSpacing &&
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
				}
				{ show.subtitleSpacing &&
					<ResponsiveControl
						attrNameTemplate="subtitle%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Subtitle', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				}
				{ show.descriptionSpacing &&
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
						/>
					</ResponsiveControl>
				}
				{ show.buttonSpacing &&
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
				}
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
		columns = 2,
		design = 'basic',
		shadow = '',
		imageSize = '',
		titleTag = 'h4',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
		buttonIcon = '',
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-card--v2',
		`ugb-card--design-${ design }`,
		`ugb-card--columns-${ columns }`,
	], applyFilters( 'stackable.card.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const title = attributes[ `title${ i }` ]
					const subtitle = attributes[ `subtitle${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ]

					const itemClasses = classnames( [
						'ugb-card__item',
						`ugb-card__item${ i }`,
					], applyFilters( 'stackable.card.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props ) )

					const imageClasses = classnames( [
						'ugb-card__image',
					], applyFilters( 'stackable.card.imageclasses', {
						[ `ugb--shadow-${ shadow }` ]: ! show.columnBackground,
					}, props ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ showImage &&
								<ImageUploadPlaceholder
									imageID={ imageId }
									imageURL={ imageUrl }
									imageSize={ imageSize }
									className={ imageClasses }
									onRemove={ () => {
										setAttributes( {
											[ `image${ i }Url` ]: '',
											[ `image${ i }Id` ]: '',
										} )
									} }
									onChange={ image => {
										setAttributes( {
											[ `image${ i }Url` ]: image.url,
											[ `image${ i }Id` ]: image.id,
										} )
									} }
								/>
							}
							<div className="ugb-card__content">
								{ showTitle &&
									<RichText
										tagName={ titleTag || 'h4' }
										value={ title }
										className="ugb-card__title"
										placeholder={ __( 'Title for This Block', i18n ) }
										onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showSubtitle &&
									<RichText
										tagName="p"
										value={ subtitle }
										className="ugb-card__subtitle"
										onChange={ value => setAttributes( { [ `subtitle${ i }` ]: value } ) }
										placeholder={ __( 'Subtitle for this block', i18n ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showDescription &&
									<RichText
										tagName="p"
										value={ description }
										className="ugb-card__description"
										onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
										placeholder={ descriptionPlaceholder( 'medium' ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showButton &&
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
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Title%sAlign', 'Subtitle%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
	} ),
)( edit )
