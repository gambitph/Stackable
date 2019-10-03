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
	ImageAltControl,
	ImageShapeControls,
	ProControl,
	ButtonEditHelper,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
	createVideoBackground,
	hasBackgroundOverlay,
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
	__, sprintf, _x,
} from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
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
					...applyFilters( 'stackable.feature-grid.edit.designs', [] ),
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
		borderRadius = 12,
		shadow = 3,
		showTitle = true,
		showDescription = true,
		titleTag = '',
		titleColor = '',
		descriptionColor = '',
		showImage = true,
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
					max={ 4 }
				/>
				{ show.columnBackground &&
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
					/>
				}
				{ show.columnBackground &&
					<RangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
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
					image4Id={ props.attributes.image4Id }
					setAttributes={ props.setAttributes }
					attributes={ props.attributes }
				/>
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
				] }
				toggleAttributeName="showButton"
			>
				<ButtonControlsHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					design={ props.attributes.buttonDesign || 'plain' }
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

addFilter( 'stackable.feature-grid.edit.inspector.advanced.before', 'stackable/feature-grid', ( output, props ) => {
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
		textTag = '',
		imageSize,
		imageShape = '',
		imageWidth = '',
		imageShadow = '',
		design = 'basic',
		shadow = 3,
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
					const buttonText = attributes[ `button${ i }Text` ] || __( 'Button text', i18n )

					const itemClasses = classnames( [
						'ugb-feature-grid__item',
						`ugb-feature-grid__item${ i }`,
					], applyFilters( 'stackable.feature-grid.itemclasses', {
						'ugb--has-background-overlay': show.columnBackground && hasBackgroundOverlay( 'column%s', props.attributes ),
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== 3,
					}, props, i ) )

					return (
						<div className={ itemClasses } key={ i }>
							{ show.columnBackground && createVideoBackground( 'column%s', props ) }
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
										tagName={ textTag || 'h5' }
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
										newWindow={ attributes[ `button${ i }NewWindow` ] }
										noFollow={ attributes[ `button${ i }NoFollow` ] }
										onChangeUrl={ value => setAttributes( { [ `button${ i }Url` ]: value } ) }
										onChangeNewWindow={ value => setAttributes( { [ `button${ i }NewWindow` ]: value } ) }
										onChangeNoFollow={ value => setAttributes( { [ `button${ i }NoFollow` ]: value } ) }
									/>
								}
							</div>
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
	withContentAlignReseter( [ 'Image%sAlign', 'Title%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
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
				if ( props.image4Data ) {
					attributes.image4Url = props.image4Data.media_details.sizes[ currentSelectedSize ] ? props.image4Data.media_details.sizes[ currentSelectedSize ].source_url : props.image4Data.source_url
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
			image4Data: props.image4Id ? getMedia( props.image4Id ) : null,
		}
	} ),
)( ImageControlsHelperWithData_ )
