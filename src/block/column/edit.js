/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'

/**
 * External dependencies
 */
import {
	BlockContainer,
	ContentAlignControl,
	ResponsiveControl,
	AdvancedToolbarControl,
	WhenResponsiveScreen,
	AdvancedRangeControl,
	ControlSeparator,
	BackgroundControlsHelper,
	ColorPaletteControl,
	DivBackground,
	PanelAdvancedSettings,
	DesignControl,
	ButtonIconPopoverControl,
	ColumnPaddingControl,
	PanelSpacingBody,
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.column.edit.inspector.layout.before', 'stackable/column', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody
				initialOpen={ true }
				title={ __( 'Layout', i18n ) }
			>
				<DesignControl
					selected={ design }
					options={ applyFilters( 'stackable.column.edit.layouts', [
						{
							label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				 />
			</PanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.column.edit.inspector.style.before', 'stackable/column', ( output, props ) => {
	const { setAttributes } = props
	const {
		contentWidth = '',
		contentWidthUnit = '%',
		contentTabletWidth = '',
		contentTabletWidthUnit = '%',
		contentMobileWidth = '',
		contentMobileWidthUnit = '%',

		contentHorizontalAlign = '',
		contentTabletHorizontalAlign = '',
		contentMobileHorizontalAlign = '',

		borderRadius = '',
		shadow = '',

		headingColor = '',
		bodyTextColor = '',
		linkColor = '',
		linkHoverColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<ResponsiveControl
					attrNameTemplate="%sColumnContentVerticalAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedToolbarControl
						label={ __( 'Content Vertical Align', i18n ) }
						controls="flex-vertical"
					/>
				</ResponsiveControl>

				<WhenResponsiveScreen>
					<AdvancedRangeControl
						label={ __( 'Content Width', i18n ) }
						allowReset={ true }
						placeholder="100"
						units={ [ '%', 'px' ] }
						min={ [ 0, 0 ] }
						max={ [ 100, 1000 ] }
						step={ [ 1, 1 ] }
						value={ contentWidth }
						unit={ contentWidthUnit }
						onChange={ contentWidth => setAttributes( { contentWidth } ) }
						onChangeUnit={ contentWidthUnit => setAttributes( { contentWidthUnit } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<AdvancedRangeControl
						label={ __( 'Content Width', i18n ) }
						allowReset={ true }
						placeholder="100"
						units={ [ '%', 'px' ] }
						min={ [ 0, 0 ] }
						max={ [ 100, 1000 ] }
						step={ [ 1, 1 ] }
						value={ contentTabletWidth }
						unit={ contentTabletWidthUnit }
						onChange={ contentTabletWidth => setAttributes( { contentTabletWidth } ) }
						onChangeUnit={ contentTabletWidthUnit => setAttributes( { contentTabletWidthUnit } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<AdvancedRangeControl
						label={ __( 'Content Width', i18n ) }
						allowReset={ true }
						placeholder="100"
						units={ [ '%', 'px' ] }
						min={ [ 0, 0 ] }
						max={ [ 100, 1000 ] }
						step={ [ 1, 1 ] }
						value={ contentMobileWidth }
						unit={ contentMobileWidthUnit }
						onChange={ contentMobileWidth => setAttributes( { contentMobileWidth } ) }
						onChangeUnit={ contentMobileWidthUnit => setAttributes( { contentMobileWidthUnit } ) }
					/>
				</WhenResponsiveScreen>

				{ contentWidth !== '' &&
					<WhenResponsiveScreen>
						<AdvancedToolbarControl
							label={ __( 'Content Horizontal Align', i18n ) }
							controls="flex-horizontal"
							value={ contentHorizontalAlign }
							onChange={ value => setAttributes( { contentHorizontalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ ( contentWidth !== '' || contentTabletWidth ) &&
					<WhenResponsiveScreen screen="tablet">
						<AdvancedToolbarControl
							label={ __( 'Content Horizontal Align', i18n ) }
							controls="flex-horizontal"
							value={ contentTabletHorizontalAlign }
							onChange={ value => setAttributes( { contentTabletHorizontalAlign: value } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ ( contentWidth !== '' || contentTabletWidth || contentMobileWidth ) &&
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
			</PanelBody>

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

			<PanelBody
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
			</PanelBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		hasInnerBlocks,
	} = props

	const {
		design = 'plain',
		shadow = '',
		// contentWidth = 100,
		// restrictContentWidth = false,
		uniqueClass = '',
	} = props.attributes

	// const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-column--design-${ design }`,
	], applyFilters( 'stackable.columns.mainclasses', {
	}, props ) )

	const itemClasses = classnames( [
		'ugb-column__item',
		`${ uniqueClass }-column-wrapper`,
	], {
		[ `ugb--shadow-${ shadow }` ]: shadow !== '',
	} )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
				>
					<div className="ugb-column__content-wrapper">
						<InnerBlocks
							templateLock={ false }
							renderAppender={
								hasInnerBlocks ?
									undefined :
									() => <InnerBlocks.ButtonBlockAppender />
							}
						/>
					</div>
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps
		const { getBlockOrder } = select( 'core/block-editor' )

		return {
			hasInnerBlocks: getBlockOrder( clientId ).length > 0,
		}
	} ),
)( edit )
