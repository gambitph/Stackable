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
import {
	BlockContainer,
	ColorPaletteControl,
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	Image,
	ContentAlignControl,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	ResponsiveControl,
	AlignButtonsControl,
	ControlSeparator,
	ImageControlsHelper,
	HeadingButtonsControl,
	PanelSpacingBody,
	AdvancedRangeControl,
	DivBackground,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	cacheImageData,
	getImageUrlFromCache,
} from '~stackable/util'
import { range } from 'lodash'
import { i18n, showProNotice } from 'stackable'
import classnames from 'classnames'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import {
	PanelBody, RangeControl,
} from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.testimonial.edit.inspector.layout.before', 'stackable/testimonial', ( output, props ) => {
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
					...applyFilters( 'stackable.testimonial.edit.layouts', [] ),
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

addFilter( 'stackable.testimonial.edit.inspector.style.before', 'stackable/testimonial', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
		columns = 2,
		borderRadius = '',
		shadow = '',
		nameTag = 'h4',
		testimonialColor = '',
		nameColor = '',
		positionColor = '',
		showTestimonial = true,
		showImage = true,
		showName = true,
		showPosition = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
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
						placeholder={ design !== 'basic2' ? 3 : '' }
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ applyFilters( 'stackable.testimonial.edit.inspector.style.general.after', null, props ) }

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
				title={ __( 'Testimonial', i18n ) }
				checked={ showTestimonial }
				onChange={ showTestimonial => setAttributes( { showTestimonial } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'testimonial%s' ),
					'testimonialColor',
					...createResponsiveAttributeNames( 'testimonial%sAlign' ),
				] }
				toggleAttributeName="showTestimonial"
			>
				<TypographyControlHelper
					attrNameTemplate="testimonial%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ testimonialColor }
					onChange={ testimonialColor => setAttributes( { testimonialColor } ) }
					label={ __( 'Testimonial Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="testimonial%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			{ applyFilters( 'stackable.testimonial.edit.inspector.style.testimonial.after', null, props ) }

			{ ! show.imageAsBackground &&
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
						widthMax={ 300 }
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
						<AlignButtonsControl label={ __( 'Align', i18n ) } />
					</ResponsiveControl>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Name', i18n ) }
				checked={ showName }
				onChange={ showName => setAttributes( { showName } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'name%s' ),
					'nameTag',
					'nameColor',
					...createResponsiveAttributeNames( 'Name%sAlign' ),
				] }
				toggleAttributeName="showName"
			>
				<TypographyControlHelper
					attrNameTemplate="name%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<HeadingButtonsControl
					label={ sprintf( _x( '%s HTML Tag', 'component' ), __( 'Name', i18n ) ) }
					value={ nameTag || 'h4' }
					onChange={ nameTag => setAttributes( { nameTag } ) }
				/>
				<ColorPaletteControl
					value={ nameColor }
					onChange={ nameColor => setAttributes( { nameColor } ) }
					label={ __( 'Name Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Name%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Position', i18n ) }
				checked={ showPosition }
				onChange={ showPosition => setAttributes( { showPosition } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'position%s' ),
					'positionColor',
					...createResponsiveAttributeNames( 'position%sAlign' ),
				] }
				toggleAttributeName="showPosition"
			>
				<TypographyControlHelper
					attrNameTemplate="position%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ positionColor }
					onChange={ positionColor => setAttributes( { positionColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="position%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ show.testimonialSpacing &&
					<ResponsiveControl
						attrNameTemplate="testimonial%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Testimonial', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				}
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
				{ show.nameSpacing && (
					<ResponsiveControl
						attrNameTemplate="name%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Name', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
				{ show.positionSpacing && (
					<ResponsiveControl
						attrNameTemplate="position%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Position', i18n ) }
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
		nameTag = 'h4',
		imageSize = 'thumbnail',
		imageShadow = '',
		imageShape = 'circle',
		imageShapeStretch = false,
		imageWidth = '',
		showTestimonial = true,
		showImage = true,
		showName = true,
		showPosition = true,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial--v3',
		`ugb-testimonial--columns-${ columns }`,
		`ugb-testimonial--design-${ design }`,
	], applyFilters( 'stackable.testimonial.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const name = attributes[ `name${ i }` ]
					const position = attributes[ `position${ i }` ]
					const testimonial = attributes[ `testimonial${ i }` ]

					const itemClasses = classnames( [
						'ugb-testimonial__item',
						`ugb-testimonial__item${ i }`,
					], applyFilters( 'stackable.testimonial.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props, i ) )

					const bodyWrapperClasses = classnames( [
						'ugb-testimonial__body-wrapper',
					], applyFilters( 'stackable.testimonial.bodywrapperclasses', {}, props, i ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							<div className={ bodyWrapperClasses }>
								{ showTestimonial &&
									<RichText
										tagName="p"
										className="ugb-testimonial__body"
										value={ testimonial }
										onChange={ testimonial => setAttributes( { [ `testimonial${ i }` ]: testimonial } ) }
										placeholder={ descriptionPlaceholder( 'medium' ) }
										keepPlaceholderOnFocus
									/>
								}
							</div>
							<div className="ugb-testimonial__person">
								{ ! show.imageAsBackground && showImage &&
									<div className="ugb-testimonial__image">
										<ImageUploadPlaceholder
											imageID={ imageId }
											imageURL={ imageUrl }
											imageSize={ imageSize }
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
								}
								{ show.imageAsBackground && showImage &&
									<ImageUploadPlaceholder
										imageID={ imageId }
										imageURL={ imageUrl }
										imageSize={ imageSize }
										className="ugb-testimonial__image"
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
								}
								{ showName &&
									<RichText
										tagName={ nameTag || 'h4' }
										className="ugb-testimonial__name"
										value={ name }
										onChange={ name => setAttributes( { [ `name${ i }` ]: name } ) }
										placeholder={ __( 'Name', i18n ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showPosition &&
									<RichText
										tagName="p"
										className="ugb-testimonial__position"
										value={ position }
										onChange={ position => setAttributes( { [ `position${ i }` ]: position } ) }
										placeholder={ __( 'Position', i18n ) }
										keepPlaceholderOnFocus
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
	withContentAlignReseter( [ 'Testimonial%sAlign', 'Image%sAlign', 'Name%sAlign', 'Position%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
	} ),
)( edit )
