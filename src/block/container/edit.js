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
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '~stackable/higher-order'
import { cacheImageData } from '~stackable/util'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { i18n, showProNotice } from 'stackable'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

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
				options={ applyFilters( 'stackable.container.edit.layouts', [
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
			<PanelBody title={ __( 'General', i18n ) }>
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
					/>
				}
				<ResponsiveControl
					attrNameTemplate="content%sWidth"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Content Width', i18n ) + ' (%)' }
						min={ 10 }
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
				{ show.columnBackground &&
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
					title={ __( 'Container Background', i18n ) }
					initialOpen={ false }
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelBody>
			}

			{ applyFilters( 'stackable.container.edit.inspector.style.column-background.after', null, props ) }

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
	} = props

	const {
		design = 'basic',
		shadow = '',
		contentWidth = 100,
		restrictContentWidth = false,
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-container--v2',
		`ugb-container--design-${ design }`,
	], applyFilters( 'stackable.container.mainclasses', {
		'ugb-container--width-small': contentWidth <= 50,
	}, props ) )

	const wrapperClasses = classnames( [
		'ugb-container__wrapper',
		`${ uniqueClass }-wrapper`,
	], applyFilters( 'stackable.container.wrapperClasses', {
		[ `ugb--shadow-${ shadow }` ]: shadow !== '',
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
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' )

		const block = getBlock( clientId )

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		}
	} ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.imageId, select )
	} ),
)( edit )
