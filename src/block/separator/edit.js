/**
 * Internal dependencies
 */
import './pro'

/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	BlockContainer,
	ColorPaletteControl,
	DesignPanelBody,
	DesignSeparatorControl,
	Separator,
	WhenResponsiveScreen,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	withBlockStyles, withGoogleFont, withSetAttributeHook, withTabbedInspector, withUniqueClass, withClickOpenInspector,
} from '~stackable/higher-order'
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	PanelBody, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'

addFilter( 'stackable.separator.edit.inspector.layout.before', 'stackable/separator', ( output, props ) => {
	const { setAttributes } = props

	const {
		design = 'wave-1',
	} = props.attributes
	return (
		<Fragment>
			{ output }
			<DesignPanelBody>
				<DesignSeparatorControl
					onChange={ design => setAttributes( { design } ) }
					selected={ design }
					excludeDesigns={ [ 'straight-1' ] }
				/>
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.separator.edit.inspector.style.before', 'stackable/separator', ( output, props ) => {
	const { setAttributes } = props
	const {
		height,
		tabletHeight = '',
		mobileHeight = '',
		marginTop = 0,
		marginBottom = 0,
		marginUnit = 'px',
		tabletMarginTop = '',
		tabletMarginBottom = '',
		tabletMarginUnit = 'px',
		mobileMarginTop = '',
		mobileMarginBottom = '',
		mobileMarginUnit = 'px',
		backgroundColor = '',
		flipVertically = false,
		flipHorizontally = false,
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,
		layer1Shadow = false,
		paddingTop = 0,
		paddingBottom = 0,
		paddingUnit = 'px',
		tabletPaddingTop = '',
		tabletPaddingBottom = '',
		tabletPaddingUnit = 'px',
		mobilePaddingTop = '',
		mobilePaddingBottom = '',
		mobilePaddingUnit = 'px',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Separator', i18n ) }
				id="separator"
			>
				<ColorPaletteControl
					label={ __( 'Separator Color', i18n ) }
					value={ layer1Color }
					onChange={ layer1Color => setAttributes( { layer1Color } ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Separator Width', i18n ) }
					value={ layer1Width }
					min="1"
					max="4"
					step="0.1"
					onChange={ layer1Width => setAttributes( { layer1Width } ) }
					allowReset={ true }
					placeholder="1"
					className="ugb--help-tip-separator-width"
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					checked={ layer1Flip }
					onChange={ layer1Flip => setAttributes( { layer1Flip } ) }
				/>
				<ToggleControl
					label={ __( 'Shadow', i18n ) }
					checked={ layer1Shadow }
					onChange={ layer1Shadow => setAttributes( { layer1Shadow } ) }
					className="ugb--help-tip-separator-shadow"
				/>
			</PanelAdvancedSettings>
			<PanelBody
				title={ __( 'General', i18n ) }
				initialOpen={ false }
			>
				<WhenResponsiveScreen screen="desktop">
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						value={ height }
						min="30"
						max="400"
						onChange={ height => {
							props.setAttributes( { height } )
						} }
						allowReset={ true }
						placeholder="200"
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						value={ tabletHeight }
						min="30"
						max="400"
						onChange={ tabletHeight => {
							props.setAttributes( { tabletHeight } )
						} }
						allowReset={ true }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						value={ mobileHeight }
						min="30"
						max="400"
						onChange={ mobileHeight => {
							props.setAttributes( { mobileHeight } )
						} }
						allowReset={ true }
					/>
				</WhenResponsiveScreen>
				<ToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					checked={ flipVertically }
					onChange={ flipVertically => setAttributes( { flipVertically } ) }
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					checked={ flipHorizontally }
					onChange={ flipHorizontally => setAttributes( { flipHorizontally } ) }
				/>
				<ColorPaletteControl
					label={ __( 'Background Color', i18n ) }
					value={ backgroundColor }
					onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'Spacing', i18n ) }
				initialOpen={ false }
			>
				<WhenResponsiveScreen screen="desktop">
					<AdvancedRangeControl
						label={ __( 'Padding Top', i18n ) }
						value={ paddingTop }
						min="0"
						max="400"
						onChange={ paddingTop => setAttributes( { paddingTop } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ paddingUnit }
						onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
						allowReset={ true }
						placeholder="0"
					/>
					<AdvancedRangeControl
						label={ __( 'Padding Bottom', i18n ) }
						value={ paddingBottom }
						min="0"
						max="400"
						onChange={ paddingBottom => setAttributes( { paddingBottom } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ paddingUnit }
						onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
						allowReset={ true }
						placeholder="0"
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Top', i18n ) }
						value={ marginTop }
						min={ -height - paddingTop - 100 }
						max="400"
						onChange={ marginTop => setAttributes( { marginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it', i18n ) }
						units={ [ 'px', '%' ] }
						unit={ marginUnit }
						onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
						allowReset={ true }
						placeholder="0"
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Bottom', i18n ) }
						value={ marginBottom }
						min={ -height - paddingBottom - 100 }
						max="400"
						onChange={ marginBottom => setAttributes( { marginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it', i18n ) }
						units={ [ 'px', '%' ] }
						unit={ marginUnit }
						onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
						allowReset={ true }
						placeholder="0"
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<AdvancedRangeControl
						label={ __( 'Padding Top', i18n ) }
						value={ tabletPaddingTop }
						min="0"
						max="400"
						onChange={ tabletPaddingTop => setAttributes( { tabletPaddingTop } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ tabletPaddingUnit }
						onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
						allowReset={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Padding Bottom', i18n ) }
						value={ tabletPaddingBottom }
						min="0"
						max="400"
						onChange={ tabletPaddingBottom => setAttributes( { tabletPaddingBottom } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ tabletPaddingUnit }
						onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
						allowReset={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Top', i18n ) }
						value={ tabletMarginTop }
						min={ -tabletHeight - tabletPaddingTop - 100 }
						max="400"
						onChange={ tabletMarginTop => setAttributes( { tabletMarginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it', i18n ) }
						units={ [ 'px', '%' ] }
						unit={ tabletMarginUnit }
						onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
						allowReset={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Bottom', i18n ) }
						value={ tabletMarginBottom }
						min={ -tabletHeight - tabletPaddingBottom - 100 }
						max="400"
						onChange={ tabletMarginBottom => setAttributes( { tabletMarginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it', i18n ) }
						units={ [ 'px', '%' ] }
						unit={ tabletMarginUnit }
						onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
						allowReset={ true }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<AdvancedRangeControl
						label={ __( 'Padding Top', i18n ) }
						value={ mobilePaddingTop }
						min="0"
						max="400"
						onChange={ mobilePaddingTop => setAttributes( { mobilePaddingTop } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ mobilePaddingUnit }
						onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
						allowReset={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Padding Bottom', i18n ) }
						value={ mobilePaddingBottom }
						min="0"
						max="400"
						onChange={ mobilePaddingBottom => setAttributes( { mobilePaddingBottom } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ mobilePaddingUnit }
						onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
						allowReset={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Top', i18n ) }
						value={ mobileMarginTop }
						min={ -mobileHeight - mobilePaddingTop - 100 }
						max="400"
						onChange={ mobileMarginTop => setAttributes( { mobileMarginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it', i18n ) }
						units={ [ 'px', '%' ] }
						unit={ mobileMarginUnit }
						onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
						allowReset={ true }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Bottom', i18n ) }
						value={ mobileMarginBottom }
						min={ -mobileHeight - mobilePaddingBottom - 100 }
						max="400"
						onChange={ mobileMarginBottom => setAttributes( { mobileMarginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it', i18n ) }
						units={ [ 'px', '%' ] }
						unit={ mobileMarginUnit }
						onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
						allowReset={ true }
					/>
				</WhenResponsiveScreen>
			</PanelBody>
		</Fragment>
	)
} )

const edit = props => {
	const { className } = props
	const {
		design = 'wave-1',
		flipVertically = false,
		flipHorizontally = false,
		layer1Shadow = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-separator--v2',
		`ugb-separator--design-${ design }`,
	], applyFilters( 'stackable.separator.mainclasses', {
		'ugb-separator--flip-vertical': flipVertically,
		'ugb-separator--flip-horizontal': flipHorizontally,
	}, design, props ) )

	return (
		<BlockContainer.Edit mainClass={ false } className={ mainClasses } aria-hidden="true" blockProps={ props } render={ () => (
			<Fragment>
				<div className="ugb-separator__top-pad" />
				<div className="ugb-separator__svg-wrapper">
					<Separator
						design={ design }
						shadow={ layer1Shadow }
						className="ugb-separator__svg-inner"
					>
						{ applyFilters( 'stackable.separator.edit.output.layers', null, design, props ) }
					</Separator>
				</div>
				<div className="ugb-separator__bottom-pad" />
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-separator__layer-1', 'separator' ],
	] ),
)( edit )
