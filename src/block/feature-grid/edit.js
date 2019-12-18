/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	BlockContainer,
	ContentAlignControl,
	Image,
	BackgroundControlsHelper,
	ImageControlsHelper,
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
	DivBackground,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
	cacheImageData,
	getImageUrlFromCache,
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
	withClickOpenInspector,
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
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { PanelBody } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.feature-grid.edit.inspector.layout.before', 'stackable/feature-grid', ( output, props ) => {
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
					...applyFilters( 'stackable.feature-grid.edit.layouts', [] ),
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

addFilter( 'stackable.feature-grid.edit.inspector.style.before', 'stackable/feature-grid', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		borderRadius = '',
		shadow = '',
		showTitle = true,
		showDescription = true,
		titleTag = '',
		titleColor = '',
		descriptionColor = '',
		showImage = true,
		showButton = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
		image4Id = '',
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
					max={ 4 }
					className="ugb--help-tip-general-columns"
				/>
				{ show.columnBackground &&
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
				{ show.columnBackground &&
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

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Column Background', i18n ) }
					initialOpen={ false }
					id="column-background"
					className="ugb--help-tip-column-background-on-off"
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelAdvancedSettings>
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
							image4Url: getImageUrlFromCache( image4Id, size || 'medium' ),
						} )
					} }
				/>
				<ResponsiveControl
					attrNameTemplate="Image%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-image"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

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
					value={ titleTag || 'h2' }
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
						className="ugb--help-tip-alignment-title"
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
						className="ugb--help-tip-alignment-description"
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
					design={ props.attributes.buttonDesign || 'plain' }
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
						className="ugb--help-tip-alignment-button"
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
							className="ugb--help-tip-spacing-image"
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
							className="ugb--help-tip-spacing-title"
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
							className="ugb--help-tip-spacing-description"
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
							className="ugb--help-tip-spacing-button"
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
		columns = 3,
		titleTag = '',
		imageSize,
		imageShape = '',
		imageShapeStretch = false,
		imageWidth = '',
		imageShadow = '',
		design = 'basic',
		shadow = '',
		showImage = true,
		showTitle = true,
		showDescription = true,
		showButton = true,
		buttonIcon = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		`ugb-feature-grid--v2`,
		`ugb-feature-grid--columns-${ columns }`,
		`ugb-feature-grid--design-${ design }`,
	], applyFilters( 'stackable.feature-grid.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ]

					const itemClasses = classnames( [
						'ugb-feature-grid__item',
						`ugb-feature-grid__item${ i }`,
					], applyFilters( 'stackable.feature-grid.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground && show[ `columnBackground${ i }` ] }
							key={ i }
						>
							{ showImage &&
								<div className="ugb-feature-grid__image">
									<ImageUploadPlaceholder
										imageID={ imageId }
										imageURL={ imageUrl }
										imageSize={ imageSize }
										onRemove={ () => {
											setAttributes( {
												[ `image${ i }Url` ]: '',
												[ `image${ i }Id` ]: '',
											} )
										} }
										onChange={ ( {
											url, id,
										} ) => {
											setAttributes( {
												[ `image${ i }Url` ]: url,
												[ `image${ i }Id` ]: id,
											} )
										} }
										render={
											<Image
												imageId={ imageId }
												src={ imageUrl }
												size={ imageSize }
												shape={ attributes[ `image${ i }Shape` ] || imageShape }
												shapeStretch={ attributes[ `image${ i }ShapeStretch` ] || imageShapeStretch }
												alt={ imageAlt }
												shadow={ imageShadow }
												width={ imageWidth }
											/>
										}
									/>
								</div>
							}
							<div className="ugb-feature-grid__content">
								{ showTitle &&
									<RichText
										tagName={ titleTag || 'h5' }
										className="ugb-feature-grid__title"
										value={ title }
										onChange={ title => setAttributes( { [ `title${ i }` ]: title } ) }
										placeholder={ __( 'Title', i18n ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showDescription &&
									<RichText
										tagName="p"
										className="ugb-feature-grid__description"
										value={ description }
										onChange={ description => setAttributes( { [ `description${ i }` ]: description } ) }
										placeholder={ descriptionPlaceholder( 'short' ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showButton &&
									<ButtonEditHelper
										attrNameTemplate={ `button%s` }
										setAttributes={ setAttributes }
										blockAttributes={ props.attributes }
										designDefault="plain"
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
	withContentAlignReseter( [ 'Image%sAlign', 'Title%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-feature-grid__item', 'column-background' ],
		[ '.ugb-feature-grid__title', 'title' ],
		[ '.ugb-feature-grid__description', 'description' ],
		[ '.ugb-button', 'button' ],
	] ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
		cacheImageData( props.attributes.image4Id, select )
	} ),
)( edit )
