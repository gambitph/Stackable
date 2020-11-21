/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignImage from './images/image.png'
import ImageDesignImage2 from './images/image2.png'
import ImageDesignImage3 from './images/image3.png'

/**
 * External dependencies
 */
import {
	ColumnPaddingControl,
	BlockContainer,
	DesignPanelBody,
	ProControlButton,
	ContentAlignControl,
	ResponsiveControl,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	WhenResponsiveScreen,
	AdvancedRangeControl,
	ControlSeparator,
	BackgroundControlsHelper,
	ColorPaletteControl,
	DivBackground,
	PanelAdvancedSettings,
	ButtonIconPopoverControl,
	PanelSpacingBody,
} from '~stackable/components'
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
import { cacheImageData } from '~stackable/util'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { i18n, showProNotice } from 'stackable'
import { ToggleControl } from '@wordpress/components'
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.container.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
		},
		{
			label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
		},
		{
			label: __( 'Image', i18n ), value: 'image', image: ImageDesignImage, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Image', i18n ), 2 ), value: 'image2', image: ImageDesignImage2, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Image', i18n ), 3 ), value: 'image3', image: ImageDesignImage3, premium: true,
		},
	]

	return [
		...layouts,
		...newLayouts,
	]
} )

addFilter( 'stackable.container.edit.inspector.layout.before', 'stackable/container', ( output, props ) => {
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
				options={ applyFilters( 'stackable.container.edit.layouts', [] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.container.edit.inspector.style.before', 'stackable/container', ( output, props ) => {
	const { setAttributes } = props
	const {
		borderRadius = '',
		shadow = '',
		restrictContentWidth = false,

		height = '',
		tabletHeight = '',
		mobileHeight = '',

		columnContentVerticalAlign = '',
		tabletColumnContentVerticalAlign = '',
		mobileColumnContentVerticalAlign = '',

		contentWidth = '',
		contentTabletWidth = '',
		contentMobileWidth = '',

		contentHorizontalAlign = '',
		contentTabletHorizontalAlign = '',
		contentMobileHorizontalAlign = '',

		headingColor = '',
		bodyTextColor = '',
		linkColor = '',
		linkHoverColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<ResponsiveControl
					attrNameTemplate="%sHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedSelectControl
						label={ __( 'Height', i18n ) }
						options={ [
							{ label: __( 'Short', i18n ), value: 'short' },
							{ label: __( 'Normal', i18n ), value: 'normal' },
							{ label: __( 'Tall', i18n ), value: 'tall' },
							{ label: __( 'Half-screen height', i18n ), value: 'half' },
							{ label: __( 'Full-screen height', i18n ), value: 'full' },
						] }
					/>
				</ResponsiveControl>

				{ ( height === 'half' || height === 'full' ) &&
					<WhenResponsiveScreen>
						<AdvancedToolbarControl
							label={ __( 'Content Vertical Align', i18n ) }
							controls="flex-vertical"
							value={ columnContentVerticalAlign }
							onChange={ value => setAttributes( { columnContentVerticalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ ( height === 'half' || height === 'full' || tabletHeight === 'half' || tabletHeight === 'full' ) &&
					<WhenResponsiveScreen screen="tablet">
						<AdvancedToolbarControl
							label={ __( 'Content Vertical Align', i18n ) }
							controls="flex-vertical"
							value={ tabletColumnContentVerticalAlign }
							onChange={ value => setAttributes( { tabletColumnContentVerticalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}

				{ ( height === 'half' || height === 'full' || tabletHeight === 'half' || tabletHeight === 'full' || mobileHeight === 'half' || mobileHeight === 'full' ) &&
					<WhenResponsiveScreen screen="mobile">
						<AdvancedToolbarControl
							label={ __( 'Content Vertical Align', i18n ) }
							controls="flex-vertical"
							value={ mobileColumnContentVerticalAlign }
							onChange={ value => setAttributes( { mobileColumnContentVerticalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}

				{ show.restrictContent &&
					<ToggleControl
						label={ __( 'Restrict to Content Width', i18n ) }
						checked={ restrictContentWidth }
						onChange={ restrictContentWidth => setAttributes( { restrictContentWidth } ) }
						className="ugb--help-tip-general-restrict-content"
					/>
				}
				<ResponsiveControl
					attrNameTemplate="content%sWidth"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Content Width', i18n ) + ' (%)' }
						min={ 0 }
						max={ 100 }
						allowReset={ true }
						placeholder="100"
					/>
				</ResponsiveControl>

				{ contentWidth && contentWidth < 100 &&
					<WhenResponsiveScreen>
						<AdvancedToolbarControl
							label={ __( 'Content Horizontal Align', i18n ) }
							controls="flex-horizontal"
							value={ contentHorizontalAlign }
							onChange={ value => setAttributes( { contentHorizontalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ ( ( contentWidth && contentWidth < 100 ) || ( contentTabletWidth && contentTabletWidth < 100 ) ) &&
					<WhenResponsiveScreen screen="tablet">
						<AdvancedToolbarControl
							label={ __( 'Content Horizontal Align', i18n ) }
							controls="flex-horizontal"
							value={ contentTabletHorizontalAlign }
							onChange={ value => setAttributes( { contentTabletHorizontalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ ( ( contentWidth && contentWidth < 100 ) || ( contentTabletWidth && contentTabletWidth < 100 ) || ( contentMobileWidth && contentMobileWidth < 100 ) ) &&
					<WhenResponsiveScreen screen="mobile">
						<AdvancedToolbarControl
							label={ __( 'Content Horizontal Align', i18n ) }
							controls="flex-horizontal"
							value={ contentMobileHorizontalAlign }
							onChange={ value => setAttributes( { contentMobileHorizontalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}

				<ControlSeparator />

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

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
			</PanelSpacingBody>

			{ applyFilters( 'stackable.container.edit.inspector.style.column-background.after', null, props ) }

			<PanelAdvancedSettings
				title={ __( 'Text Colors', i18n ) }
				initialOpen={ false }
			>
				<ColorPaletteControl
					value={ headingColor }
					onChange={ headingColor => setAttributes( { headingColor } ) }
					label={ __( 'Heading Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ bodyTextColor }
					onChange={ bodyTextColor => setAttributes( { bodyTextColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ linkColor }
					onChange={ linkColor => setAttributes( { linkColor } ) }
					label={ __( 'Link Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ linkHoverColor }
					onChange={ linkHoverColor => setAttributes( { linkHoverColor } ) }
					label={ __( 'Link Hover Color', i18n ) }
				/>
				<p className="components-base-control__help">{ __( 'The colors above might not apply to some nested blocks.', i18n ) }</p>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
	} = props

	const {
		design = 'basic',
		shadow = '',
		restrictContentWidth = false,
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-container--v2',
		`ugb-container--design-${ design }`,
	], applyFilters( 'stackable.container.mainclasses', {
	}, props ) )

	const wrapperClasses = classnames( [
		'ugb-container__wrapper',
		`${ uniqueClass }-wrapper`,
	], applyFilters( 'stackable.container.wrapperClasses', {
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
		'ugb--restrict-content-width': show.restrictContent && restrictContentWidth,
	}, props ) )

	const contentWrapperClasses = classnames( [
		'ugb-container__content-wrapper',
		`${ uniqueClass }-content-wrapper`,
	], {
		'ugb-content-wrapper': show.restrictContent && restrictContentWidth, // We need this for .ugb--restrict-content-width to work.
	} )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ wrapperClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
					showBackground={ show.columnBackground }
				>
					{ applyFilters( 'stackable.container.edit.wrapper.output', null, props ) }
					<div className="ugb-container__side">
						<div className={ contentWrapperClasses }>
							<InnerBlocks
								templateLock={ false }
								renderAppender={ () => ! props.hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
							/>
						</div>
					</div>
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
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-container__wrapper', 'column-background' ],
	] ),
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps
		const { getBlockOrder } = select( 'core/block-editor' )

		return {
			hasInnerBlocks: getBlockOrder( clientId ).length > 0,
		}
	} ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.imageId, select )
	} ),
)( edit )
