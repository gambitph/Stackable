/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	ContentAlignControl,
	BlockContainer,
	ColorPaletteControl,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	ResponsiveControl,
	AlignButtonsControl,
	HeadingButtonsControl,
	PanelSpacingBody,
	AdvancedRangeControl,
	ImageBackgroundControlsHelper,
	AdvancedToolbarControl,
	UrlInputPopover,
} from '~stackable/components'
import {
	createTypographyAttributeNames,
	createBackgroundAttributeNames,
	createResponsiveAttributeNames,
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
} from '~stackable/higher-order'
import classnames from 'classnames'
import { i18n, showProNotice } from 'stackable'
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import SVGArrow from './images/arrow.svg'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import {
	PanelBody,
	RangeControl,
	SelectControl,
	withFocusOutside,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Component, Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.image-box.edit.inspector.layout.before', 'stackable/image-box', ( output, props ) => {
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
					...applyFilters( 'stackable.image-box.edit.layouts', [] ),
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

addFilter( 'stackable.image-box.edit.inspector.style.before', 'stackable/image-box', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
		columns = 3,
		titleColor,
		descriptionColor,
		borderRadius = '',
		shadow = '',
		showTitle = true,
		showDescription = true,
		titleTag = '',
		image1Id = '',
		image2Id = '',
		image3Id = '',
		image4Id = '',
		imageHoverEffect = '',
		showOverlay = false,
		showOverlayHover = true,
		overlayOpacity = 0.7,
		overlayHoverOpacity = 0.7,
		showSubtitle = true,
		subtitleColor = '',
		lineColor = '',
		lineSize = '',
		showArrow = false,
		arrowColor = '',
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
				{ /**
				* The "height" option is really the "columnHeight" option. @see edit.js
				* But we need to use height instead of min-height. @see index.js
				*/ }
				<ResponsiveControl
					attrNameTemplate="%sColumnHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						min="100"
						max="700"
						allowReset={ true }
						placeholder="350"
					/>
				</ResponsiveControl>
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
				<ResponsiveControl
					attrNameTemplate="columnContent%sVerticalAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedToolbarControl
						label={ __( 'Content Vertical Align', i18n ) }
						controls="flex-vertical"
					/>
				</ResponsiveControl>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelBody
				title={ __( 'Image', i18n ) }
				initialOpen={ false }
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
							image4Url: getImageUrlFromCache( image4Id, size || 'large' ),
						} )
					} }
				/>
			</PanelBody>

			<PanelAdvancedSettings
				title={ __( 'Overlay Color', i18n ) }
				checked={ showOverlay }
				onChange={ showOverlay => setAttributes( { showOverlay } ) }
				toggleOnSetAttributes={ [
					...createBackgroundAttributeNames( 'overlay%s' ),
					'overlayOpacity',
				] }
				toggleAttributeName="showOverlay"
			>
				<BackgroundControlsHelper
					attrNameTemplate="overlay%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					labelBackgroundColorType={ __( 'Overlay Color Type', i18n ) }
					labelBackgroundColor={ __( 'Overlay Color', i18n ) }
					onChangeImage={ null }
					onChangeBackgroundMedia={ null }
					onChangeBackgroundColorOpacity={ null }
				/>
				<AdvancedRangeControl
					label={ __( 'Opacity', i18n ) }
					value={ overlayOpacity }
					onChange={ overlayOpacity => setAttributes( { overlayOpacity } ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="0.7"
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Overlay Hover Color', i18n ) }
				checked={ showOverlayHover }
				onChange={ showOverlayHover => setAttributes( { showOverlayHover } ) }
				toggleOnSetAttributes={ [
					...createBackgroundAttributeNames( 'overlayHover%s' ),
					'overlayHoverOpacity',
				] }
				toggleAttributeName="showOverlayHover"
			>
				<BackgroundControlsHelper
					attrNameTemplate="overlayHover%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					labelBackgroundColorType={ __( 'Overlay Color Type', i18n ) }
					labelBackgroundColor={ __( 'Overlay Color', i18n ) }
					onChangeImage={ null }
					onChangeBackgroundMedia={ null }
					onChangeBackgroundColorOpacity={ null }
				/>
				<AdvancedRangeControl
					label={ __( 'Opacity', i18n ) }
					value={ overlayHoverOpacity }
					onChange={ overlayHoverOpacity => setAttributes( { overlayHoverOpacity } ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="0.7"
				/>
			</PanelAdvancedSettings>

			<PanelBody
				title={ __( 'Effects', i18n ) }
				initialOpen={ false }
			>
				<SelectControl
					label={ __( 'Image Hover Effect', i18n ) }
					options={ applyFilters( 'stackable.image-box.edit.image-hover-effects', [
						{ label: __( 'None', i18n ), value: '' },
						{ label: __( 'Zoom In', i18n ), value: 'zoom-in' },
						{ label: __( 'Zoom Out', i18n ), value: 'zoom-out' },
					] ) }
					value={ imageHoverEffect }
					onChange={ imageHoverEffect => setAttributes( { imageHoverEffect } ) }
				/>
				{ applyFilters( 'stackable.image-box.edit.panel.image-hover-effects', null, props ) }
				{ showProNotice && <ProControlButton type="effect" /> }
			</PanelBody>

			{ show.line &&
				<PanelAdvancedSettings
					title={ __( 'Line', i18n ) }
					hasToggle={ false }
				>
					<ColorPaletteControl
						value={ lineColor }
						onChange={ lineColor => setAttributes( { lineColor } ) }
						label={ __( 'Color', i18n ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						min="0"
						max="10"
						value={ lineSize }
						onChange={ lineSize => setAttributes( { lineSize } ) }
						allowReset={ true }
						placeholder={ design === 'box' ? 1 : 12 }
					/>
				</PanelAdvancedSettings>
			}

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
				title={ __( 'Arrow', i18n ) }
				checked={ showArrow }
				onChange={ showArrow => setAttributes( { showArrow } ) }
				toggleOnSetAttributes={ [
					'arrowColor',
					...createResponsiveAttributeNames( 'Arrow%sSize' ),
					...createResponsiveAttributeNames( 'Arrow%sAlign' ),
				] }
				toggleAttributeName="showArrow"
			>
				<ColorPaletteControl
					value={ arrowColor }
					onChange={ arrowColor => setAttributes( { arrowColor } ) }
					label={ __( 'Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Arrow%sSize"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						min="0"
						max="50"
						allowReset={ true }
					/>
				</ResponsiveControl>
				<ResponsiveControl
					attrNameTemplate="Arrow%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ show.subtitleSpacing && (
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
				) }
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
				{ show.lineSpacing && (
					<ResponsiveControl
						attrNameTemplate="line%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Line', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
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
						/>
					</ResponsiveControl>
				) }
				{ show.arrowSpacing && (
					<ResponsiveControl
						attrNameTemplate="arrow%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Arrow', i18n ) }
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

class Edit extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			selectedBox: null,
		}
		this.handleFocusOutside = this.handleFocusOutside.bind( this )
	}

	handleFocusOutside() {
		this.setState( {
			selectedBox: null,
		} )
	}

	render() {
		const {
			className,
			setAttributes,
			attributes,
		} = this.props

		const {
			columns = 3,
			contentAlign = '',
			design = 'basic',
			shadow = '',
			imageSize = 'large',
			imageHoverEffect = '',
			showSubtitle = true,
			showTitle = true,
			showDescription = true,
			showArrow = false,
			titleTag = '',
			showOverlay = false,
			showOverlayHover = true,
		} = attributes

		const mainClasses = classnames( [
			className,
			'ugb-image-box--v4',
			`ugb-image-box--columns-${ columns }`,
			`ugb-image-box--design-${ design }`,
		], applyFilters( 'stackable.image-box.mainclasses', {
			[ `ugb-image-box--effect-${ imageHoverEffect }` ]: imageHoverEffect,
			'ugb-image-box--with-arrow': showArrow,
			[ `ugb-image-box--align-${ contentAlign }` ]: contentAlign,
		}, this.props ) )

		const show = showOptions( this.props )

		return (
			<BlockContainer.Edit className={ mainClasses } blockProps={ this.props } render={ () => (
				<Fragment>
					{ range( 1, columns + 1 ).map( i => {
						const itemClasses = classnames( [
							'ugb-image-box__item',
							`ugb-image-box__item${ i }`,
							'ugb-image-box__box',
						], applyFilters( 'stackable.image-box.itemclasses', {
							[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
						}, this.props, i ) )

						return (
							<div
								className={ itemClasses }
								key={ i }
								onMouseDown={ () => this.setState( { selectedBox: i } ) }
								role="button"
								tabIndex="0"
							>
								<div className="ugb-image-box__box ugb-image-box__image-wrapper">
									<ImageUploadPlaceholder
										imageID={ attributes[ `image${ i }Id` ] }
										imageURL={ attributes[ `image${ i }Url` ] }
										imageSize={ imageSize }
										className="ugb-image-box__box ugb-image-box__image"
										onRemove={ () => {
											setAttributes( {
												[ `image${ i }Id` ]: '',
												[ `image${ i }Url` ]: '',
												[ `image${ i }FullWidth` ]: '',
												[ `image${ i }FullHeight` ]: '',
												[ `image${ i }FullUrl` ]: '',
											} )
										} }
										onChange={ image => {
											setAttributes( {
												[ `image${ i }Id` ]: image.id,
												[ `image${ i }Url` ]: image.url,
												[ `image${ i }FullWidth` ]: image.sizes.full.width,
												[ `image${ i }FullHeight` ]: image.sizes.full.height,
												[ `image${ i }FullUrl` ]: image.sizes.full.url,
											} )
										} }
									/>
								</div>
								{ showOverlay &&
									<div className="ugb-image-box__box ugb-image-box__overlay"></div>
								}
								{ showOverlayHover &&
									<div className="ugb-image-box__box ugb-image-box__overlay-hover"></div>
								}
								<div className="ugb-image-box__content">
									{ ( showSubtitle || showTitle ) &&
										<div className="ugb-image-box__header">
											{ showSubtitle &&
												<RichText
													tagName="div"
													className="ugb-image-box__subtitle"
													value={ attributes[ `subtitle${ i }` ] }
													onChange={ subtitle => setAttributes( { [ `subtitle${ i }` ]: subtitle } ) }
													placeholder={ __( 'Subtitle', i18n ) }
													keepPlaceholderOnFocus
												/>
											}
											{ showTitle &&
												<RichText
													tagName={ titleTag || 'h4' }
													className="ugb-image-box__title"
													value={ attributes[ `title${ i }` ] }
													onChange={ title => setAttributes( { [ `title${ i }` ]: title } ) }
													placeholder={ __( 'Title', i18n ) }
													keepPlaceholderOnFocus
												/>
											}
										</div>
									}
									{ showDescription &&
										<RichText
											tagName="p"
											className="ugb-image-box__description"
											value={ attributes[ `description${ i }` ] }
											onChange={ description => setAttributes( { [ `description${ i }` ]: description } ) }
											placeholder={ __( 'Description', i18n ) }
											keepPlaceholderOnFocus
										/>
									}
								</div>
								{ showArrow &&
									<div className="ugb-image-box__arrow">
										<SVGArrow />
									</div>
								}
								{ this.state.selectedBox === i &&
									<UrlInputPopover
										value={ attributes[ `link${ i }Url` ] }
										onChange={ value => setAttributes( { [ `link${ i }Url` ]: value } ) }
										newTab={ attributes[ `link${ i }NewTab` ] }
										noFollow={ attributes[ `link${ i }NoFollow` ] }
										onChangeNewTab={ value => setAttributes( { [ `link${ i }NewTab` ]: value } ) }
										onChangeNoFollow={ value => setAttributes( { [ `link${ i }NoFollow` ]: value } ) }
									/>
								}
							</div>
						)
					} ) }
				</Fragment>
			) } />
		)
	}
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Line%sAlign', 'Subtitle%sAlign', 'Title%sAlign', 'Description%sAlign', 'Arrow%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
		cacheImageData( props.attributes.image4Id, select )
	} ),
	withFocusOutside,
)( Edit )
