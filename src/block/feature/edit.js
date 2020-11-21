/**
 * External dependencies
 */
import { i18n, showProNotice } from 'stackable'
import {
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	BlockContainer,
	ContentAlignControl,
	BackgroundControlsHelper,
	ButtonIconPopoverControl,
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
	ImageControlsHelper,
	Image,
	ImageBackgroundControlsHelper,
	ButtonEditHelper,
	DivBackground,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
	cacheImageData,
} from '~stackable/util'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
	withDesignLayoutSelector,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignHalf from './images/half.png'
import ImageDesignOverlap from './images/overlap.png'
import ImageDesignOverlap2 from './images/overlap2.png'
import ImageDesignOverlap3 from './images/overlap3.png'
import ImageDesignOverlap4 from './images/overlap4.png'
import ImageDesignOverlap5 from './images/overlap5.png'
import ImageDesignOverlapShape from './images/overlap-shape.png'
import ImageDesignOverlapShape2 from './images/overlap-shape2.png'
import ImageDesignOverlapShape3 from './images/overlap-shape3.png'
import ImageDesignOverlapShape4 from './images/overlap-shape4.png'
import ImageDesignOverlapShape5 from './images/overlap-shape5.png'
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import {
	ToggleControl,
} from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.feature.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			image: ImageDesignBasic, label: __( 'Basic', i18n ), value: 'basic',
		},
		{
			image: ImageDesignPlain, label: __( 'Plain', i18n ), value: 'plain',
		},
		{
			label: __( 'Half Background', i18n ), value: 'half', image: ImageDesignHalf, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Shape %s', i18n ), 1 ), value: 'overlap', image: ImageDesignOverlapShape, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Shape %s', i18n ), 2 ), value: 'overlap2', image: ImageDesignOverlapShape2, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Shape %s', i18n ), 3 ), value: 'overlap3', image: ImageDesignOverlapShape3, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Shape %s', i18n ), 4 ), value: 'overlap4', image: ImageDesignOverlapShape4, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Shape %s', i18n ), 5 ), value: 'overlap5', image: ImageDesignOverlapShape5, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Background %s', i18n ), 1 ), value: 'overlap-bg', image: ImageDesignOverlap, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Background %s', i18n ), 2 ), value: 'overlap-bg2', image: ImageDesignOverlap2, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Background %s', i18n ), 3 ), value: 'overlap-bg3', image: ImageDesignOverlap3, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Background %s', i18n ), 4 ), value: 'overlap-bg4', image: ImageDesignOverlap4, premium: true,
		},
		{
			label: sprintf( __( 'Overlap Background %s', i18n ), 5 ), value: 'overlap-bg5', image: ImageDesignOverlap5, premium: true,
		},
	]

	return [
		...layouts,
		...newLayouts,
	]
} )

addFilter( 'stackable.feature.edit.inspector.layout.before', 'stackable/feature', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				initialOpen={ true }
				selected={ design }
				options={ applyFilters( 'stackable.feature.edit.layouts', [] ) }
				onChange={ design => {
					setAttributes( { design } )
				} }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.feature.edit.inspector.style.before', 'stackable/feature', ( output, props ) => {
	const { setAttributes } = props
	const {
		borderRadius = '',
		shadow = '',
		showTitle = true,
		titleTag = '',
		titleColor = '',
		invert = false,
		showButton = true,
		showDescription = true,
		descriptionColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				{ show.imageColumnWidth &&
					<ResponsiveControl
						attrNameTemplate="imageColumn%sWidth"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
						screens={ [ 'desktop', 'tablet' ] }
					>
						<AdvancedRangeControl
							label={ __( 'Image Column Width', i18n ) }
							min={ 0 }
							max={ 100 }
							allowReset={ true }
							placeholder="50"
							className="ugb--help-tip-image-column-width"
						/>
					</ResponsiveControl>
				}
				{ show.reverseHorizontally &&
					<ToggleControl
						label={ __( 'Reverse Horizontally', i18n ) }
						checked={ invert }
						onChange={ invert => setAttributes( { invert } ) }
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="column-background"
					initialOpen={ false }
					className="ugb--help-tip-column-background-on-off"
				>
					<ButtonIconPopoverControl
						label={ __( 'Background', i18n ) }
						popoverLabel={ __( 'Background', i18n ) }
						onReset={ () => {
							setAttributes( {
								columnBackgroundColorType: '',
								columnBackgroundColor: '',
								columnBackgroundColor2: '',
								columnBackgroundColorOpacity: '',
								columnBackgroundMediaID: '',
								columnBackgroundMediaUrl: '',
								columnBackgroundTintStrength: '',
								columnFixedBackground: '',
							} )
						} }
						allowReset={ props.attributes.columnBackgroundColor || props.attributes.columnBackgroundMediaUrl }
						hasColorPreview={ props.attributes.columnBackgroundColor }
						hasImagePreview={ props.attributes.columnBackgroundMediaUrl }
						colorPreview={ props.attributes.columnBackgroundColorType === 'gradient' ? [ props.attributes.columnBackgroundColor, props.attributes.columnBackgroundColor2 ] : props.attributes.columnBackgroundColor }
						imageUrlPreview={ props.attributes.columnBackgroundMediaUrl }
					>
						<BackgroundControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
					</ButtonIconPopoverControl>
					{ show.containerWidth &&
					<ResponsiveControl
						attrNameTemplate="container%sWidth"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Container Width', i18n ) }
							min={ 0 }
							max={ 1000 }
							allowReset={ true }
							className="ugb--help-tip-feature-container-width"
						/>
					</ResponsiveControl>
					}
					{ show.containerOffset &&
					<ResponsiveControl
						attrNameTemplate="container%sOffset"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Container Offset', i18n ) }
							min={ 0 }
							max={ 300 }
							allowReset={ true }
							className="ugb--help-tip-feature-container-offset"
						/>
					</ResponsiveControl>
					}
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
				</PanelAdvancedSettings>
			}

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
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
							placeholder="16"
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
							placeholder="16"
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
							placeholder="0"
							allowReset={ true }
							className="ugb--help-tip-spacing-button"
						/>
					</ResponsiveControl>
				}
			</PanelSpacingBody>

			<PanelAdvancedSettings
				title={ __( 'Image', i18n ) }
				initialOpen={ false }
			>
				{ ! show.featuredImageAsBackground &&
					<ImageControlsHelper
						attrNameTemplate="image%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
						onChangeBlendMode={ false }
					/>
				}
				{ show.featuredImageAsBackground &&
					<Fragment>
						<ImageBackgroundControlsHelper
							attrNameTemplate="image%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
						<ResponsiveControl
							attrNameTemplate="imageBackground%sHeight"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						>
							<AdvancedRangeControl
								label={ __( 'Image Height', i18n ) }
								min={ 0 }
								max={ 1000 }
								allowReset={ true }
								className="ugb--help-tip-image-height-crop"
							/>
						</ResponsiveControl>
					</Fragment>
				}
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
				<HeadingButtonsControl
					value={ titleTag || 'h2' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					htmlTag={ titleTag || 'h2' }
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
					...createResponsiveAttributeNames( 'button%sAlign' ),
				] }
				toggleAttributeName="showButton"
			>
				<ButtonControlsHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					placeholder="21"
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

		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		title,
		design = 'basic',
		shadow = '',
		invert = false,
		showTitle = true,
		titleTag = '',
		showDescription = true,
		description = '',

		// Image.
		imageId = '',
		imageUrl = '',
		imageAlt = '',
		imageSize = 'large',
		imageShape = '',
		imageShapeStretch = false,
		imageHeight = '',
		imageShadow = '',

		// Button.
		showButton = true,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-feature--v2',
		`ugb-feature--design-${ design }`,
	], applyFilters( 'stackable.feature.mainclasses', {
		'ugb-feature--invert': show.reverseHorizontally && invert,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-feature__item',
	], applyFilters( 'stackable.feature.itemclasses', {
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && ( design === 'basic' || design === 'half' ) && shadow !== '',
	}, props ) )

	const contentClasses = classnames( [
		'ugb-feature__content',
	], applyFilters( 'stackable.feature.contentclasses', {
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && design !== 'basic' && design !== 'half' && shadow !== '',
	}, props ) )

	const imageClasses = classnames( [
		'ugb-feature__image',
	], applyFilters( 'stackable.feature.imageclasses', {
		[ `ugb--shadow-${ imageShadow }` ]: show.columnBackground && design === 'plain' && imageShape === '',
		[ `ugb-feature__image-has-shape` ]: imageShape !== '',
	}, design, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
					showBackground={ show.columnBackground && design === 'basic' }
				>
					<DivBackground
						className={ contentClasses }
						backgroundAttrName="column%s"
						blockProps={ props }
						showBackground={ show.columnBackground && design !== 'basic' }
					>
						{ showTitle &&
							<RichText
								tagName={ titleTag || 'h2' }
								className="ugb-feature__title"
								value={ title }
								onChange={ title => setAttributes( { title } ) }
								placeholder={ __( 'Title for This Block', i18n ) }
								keepPlaceholderOnFocus
							/>
						}
						{ showDescription &&
							<RichText
								tagName="p"
								className="ugb-feature__description"
								value={ description }
								onChange={ description => setAttributes( { description } ) }
								placeholder={ descriptionPlaceholder( 'medium' ) }
								keepPlaceholderOnFocus
							/>
						}
						{ showButton &&
							<ButtonEditHelper
								attrNameTemplate="button%s"
								setAttributes={ setAttributes }
								blockAttributes={ props.attributes }
							/>
						}
					</DivBackground>
					{ ! show.featuredImageAsBackground &&
						<div className="ugb-feature__image-side">
							<ImageUploadPlaceholder
								imageID={ imageId }
								imageURL={ imageUrl }
								imageSize={ imageSize }
								className={ imageClasses }
								onRemove={ () => {
									setAttributes( {
										imageUrl: '',
										imageId: '',
										imageAlt: '',
										imageWidth: '',
										imageHeight: '',
									} )
								} }
								onChange={ image => {
									setAttributes( {
										imageUrl: image.url,
										imageId: image.id,
										imageAlt: image.alt,
										imageWidth: image.width,
										imageHeight: image.height,
									} )
								} }
								render={
									<Image
										imageId={ imageId }
										src={ imageUrl }
										size={ imageSize }
										shape={ imageShape }
										shapeStretch={ imageShapeStretch }
										alt={ imageAlt }
										height={ imageHeight }
										shadow={ imageShadow }
									/>
								}
							/>
						</div>
					}
					{ show.featuredImageAsBackground &&
						<ImageUploadPlaceholder
							imageID={ imageId }
							imageURL={ imageUrl }
							imageSize={ imageSize }
							className={ imageClasses }
							onRemove={ () => {
								setAttributes( {
									imageUrl: '',
									imageId: '',
									imageAlt: '',
									imageWidth: '',
									imageHeight: '',
								} )
							} }
							onChange={ image => {
								setAttributes( {
									imageUrl: image.url,
									imageId: image.id,
									imageAlt: image.alt,
									imageWidth: image.width,
									imageHeight: image.height,
								} )
							} }
						/>
					}
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withDesignLayoutSelector,
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Title%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-feature__item', 'column-background' ],
		[ '.ugb-feature__title', 'title' ],
		[ '.ugb-feature__description', 'description' ],
		[ '.ugb-button', 'button' ],
	] ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.imageId, select )
	} ),
)( edit )
