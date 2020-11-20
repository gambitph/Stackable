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
	PanelSpacingBody,
	AdvancedRangeControl,
	ImageBackgroundControlsHelper,
	ImageControlsHelper,
	SocialControlsHelper,
	Image,
	SocialButtonEditHelper,
	DivBackground,
	ButtonIconPopoverControl,
	ColumnPaddingControl,
	BorderControlsHelper,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
	cacheImageData,
	getImageUrlFromCache,
	SOCIAL_SITES,
} from '~stackable/util'
import classnames from 'classnames'
import { upperFirst, range } from 'lodash'
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
import {
	ToggleControl,
} from '@wordpress/components'
import {
	__,
} from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.team-member.edit.inspector.layout.before', 'stackable/team-member', ( output, props ) => {
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
				options={ applyFilters( 'stackable.team-member.edit.layouts', [
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

addFilter( 'stackable.team-member.edit.inspector.style.before', 'stackable/team-member', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		borderRadius = '',
		shadow = '',
		showImage = true,
		showName = true,
		showDescription = true,
		showSocial = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
		showPosition = true,
		positionColor = '',
		nameTag = 'h4',
		nameColor = '',
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
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
					className="ugb--help-tip-general-columns"
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					initialOpen={ false }
					id="column-background"
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
					{ show.border &&
						<BorderControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
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
				</PanelAdvancedSettings>
			}

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
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
							placeholder="24"
							allowReset={ true }
							className="ugb--help-tip-spacing-image"
						/>
					</ResponsiveControl>
				}
				{ show.nameSpacing &&
					<ResponsiveControl
						attrNameTemplate="name%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Name', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="8"
							allowReset={ true }
							className="ugb--help-tip-spacing-name"
						/>
					</ResponsiveControl>
				}
				{ show.positionSpacing &&
					<ResponsiveControl
						attrNameTemplate="position%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Position', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-name"
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
				{ show.socialSpacing &&
					<ResponsiveControl
						attrNameTemplate="social%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Social', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="4"
							allowReset={ true }
							className="ugb--help-tip-spacing-button"
						/>
					</ResponsiveControl>
				}
				{ show.socialSpacing &&
					<ResponsiveControl
						attrNameTemplate="social%sGap"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Social Button Gap', i18n ) }
							min={ -20 }
							max={ 30 }
							placeholder="0"
							allowReset={ true }
							className="ugb--help-tip-spacing-button-gap"
						/>
					</ResponsiveControl>
				}
			</PanelSpacingBody>

			<PanelAdvancedSettings
				title={ __( 'Image', i18n ) }
				checked={ showImage }
				onChange={ showImage => setAttributes( { showImage } ) }
				toggleOnSetAttributes={ [
					'imageSize',
					'imageBackgroundPosition',
					...createResponsiveAttributeNames( 'imageBackground%sHeight' ),
					...createResponsiveAttributeNames( 'imageBackground%sWidth' ),
					// 'imageSize',
					'imageShape',
					'imageShapeFlipX',
					'imageShapeFlipY',
					'imageShapeStretch',
					'imageWidth',
					...createResponsiveAttributeNames( 'image%sWidth' ),
					'imageBorderRadius',
					'imageShadow',
					'imageBlendMode',
					...createResponsiveAttributeNames( 'image%sHeight' ),
				] }
				toggleAttributeName="showImage"
				hasToggle={ ! show.imageAsBackground }
			>
				{ ! show.imageAsBackground &&
					<Fragment>
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
									image1Url: getImageUrlFromCache( image1Id, size || 'large' ),
									image2Url: getImageUrlFromCache( image2Id, size || 'large' ),
									image3Url: getImageUrlFromCache( image3Id, size || 'large' ),
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
								className="ugb--help-tip-alignment-image"
							/>
						</ResponsiveControl>
					</Fragment>
				}
				{ show.imageAsBackground &&
					<Fragment>
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
						{ show.imageBackgroundHeight &&
							<ResponsiveControl
								attrNameTemplate="Image%sBackgroundHeight"
								setAttributes={ setAttributes }
								blockAttributes={ props.attributes }
							>
								<AdvancedRangeControl
									label={ __( 'Image Height', i18n ) }
									min={ 0 }
									max={ 800 }
									allowReset={ true }
									className="ugb--help-tip-image-height-crop"
								/>
							</ResponsiveControl>
						}
						{ show.imageBackgroundWidth &&
							<ResponsiveControl
								attrNameTemplate="Image%sBackgroundWidth"
								setAttributes={ setAttributes }
								blockAttributes={ props.attributes }
							>
								<AdvancedRangeControl
									label={ __( 'Image Width', i18n ) + ' (%)' }
									min={ 0 }
									max={ 90 }
									allowReset={ true }
									placeholder="50"
									className="ugb--help-tip-image-width-crop"
								/>
							</ResponsiveControl>
						}
					</Fragment>
				}
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Name', i18n ) }
				id="name"
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
				<HeadingButtonsControl
					value={ nameTag || 'h4' }
					onChange={ nameTag => setAttributes( { nameTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="name%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					htmlTag={ nameTag || 'h4' }
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
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-name"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Position', i18n ) }
				id="position"
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
					label={ __( 'Position Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="position%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-name"
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

			{ show.social &&
				<PanelAdvancedSettings
					title={ __( 'Social', i18n ) }
					id="social"
					checked={ showSocial }
					onChange={ showSocial => setAttributes( { showSocial } ) }
					toggleOnSetAttributes={ [
						...createButtonAttributeNames( 'social%s' ),
						...createResponsiveAttributeNames( 'social%sAlign' ),
					] }
					toggleAttributeName="showSocial"
				>
					<div className="components-base-control">
						<div className="components-base-control__label">{ __( 'Social Buttons', i18n ) }</div>
						{ Object.keys( SOCIAL_SITES ).map( socialId => {
							return (
								<ToggleControl
									key={ socialId }
									className="ugb-team-member-setting__social"
									label={ SOCIAL_SITES[ socialId ].label }
									checked={ props.attributes[ `show${ upperFirst( socialId ) }` ] }
									onChange={ value => setAttributes( { [ `show${ upperFirst( socialId ) }` ]: value } ) }
								/>
							)
						} ) }
					</div>
					<ControlSeparator />
					<SocialControlsHelper
						attrNameTemplate="social%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
						socialUrlFields={ false }
					/>
					<ResponsiveControl
						attrNameTemplate="Social%sAlign"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							className="ugb--help-tip-alignment-button"
						/>
					</ResponsiveControl>
				</PanelAdvancedSettings>
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
		columns = 2,
		design = 'basic',
		shadow = '',
		imageSize = '',
		imageShadow = '',
		imageShape = '',
		imageShapeStretch = false,
		nameTag = 'h4',
		showImage = true,
		showName = true,
		showPosition = true,
		showDescription = true,
		showSocial = true,
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-team-member--v3',
		`ugb-team-member--design-${ design }`,
		`ugb-team-member--columns-${ columns }`,
	], applyFilters( 'stackable.team-member.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const name = attributes[ `name${ i }` ]
					const position = attributes[ `position${ i }` ]
					const description = attributes[ `description${ i }` ]

					const itemClasses = classnames( [
						'ugb-team-member__item',
						`ugb-team-member__item${ i }`,
					], applyFilters( 'stackable.team-member.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ showImage && ! show.imageAsBackground &&
								<div className="ugb-team-member__image">
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
											/>
										}
									/>
								</div>
							}
							{ show.imageAsBackground &&
								<ImageUploadPlaceholder
									imageID={ imageId }
									imageURL={ imageUrl }
									imageSize={ imageSize }
									className="ugb-team-member__image"
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
							<div className="ugb-team-member__content">
								{ ( showName || showPosition ) &&
									<div className="ugb-team-member__title">
										{ showName &&
											<RichText
												tagName={ nameTag || 'h4' }
												value={ name }
												className="ugb-team-member__name"
												placeholder={ __( 'Name', i18n ) }
												onChange={ value => setAttributes( { [ `name${ i }` ]: value } ) }
												keepPlaceholderOnFocus
											/>
										}
										{ showPosition &&
											<RichText
												tagName="p"
												value={ position }
												className="ugb-team-member__position"
												onChange={ value => setAttributes( { [ `position${ i }` ]: value } ) }
												placeholder={ __( 'Position', i18n ) }
												keepPlaceholderOnFocus
											/>
										}
									</div>
								}
								{ showDescription &&
									<RichText
										tagName="p"
										value={ description }
										className="ugb-team-member__description"
										onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
										placeholder={ descriptionPlaceholder( 'medium' ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showSocial && show.social &&
									<div className="ugb-team-member__buttons">
										<SocialButtonEditHelper
											attrNameTemplate={ `social%s` }
											setAttributes={ setAttributes }
											blockAttributes={ props.attributes }
											onChangeNewTab={ false }
											// Pass the show* props
											{ ...Object.keys( SOCIAL_SITES ).reduce( ( propsToPass, socialId ) => {
												return {
													...propsToPass,
													[ `${ socialId }Url` ]: attributes[ `social${ i }${ upperFirst( socialId ) }Url` ],
													[ `onChange${ upperFirst( socialId ) }Url` ]: value => setAttributes( { [ `social${ i }${ upperFirst( socialId ) }Url` ]: value } ),
													[ `show${ upperFirst( socialId ) }` ]: attributes[ `show${ upperFirst( socialId ) }` ],
												}
											}, {} ) }
										/>
									</div>
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
	withContentAlignReseter( [ 'Image%sAlign', 'Name%sAlign', 'Position%sAlign', 'Description%sAlign', 'Social%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-team-member__item', 'column-background' ],
		[ '.ugb-team-member__name', 'name' ],
		[ '.ugb-team-member__position', 'position' ],
		[ '.ugb-team-member__description', 'description' ],
		[ '.ugb-button', 'social' ],
	] ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
	} ),
)( edit )
