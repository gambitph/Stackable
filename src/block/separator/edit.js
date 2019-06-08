import './pro'
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	AdvancedRangeControl,
	BlockContainer,
	ColorPaletteControl,
	DesignPanelBody,
	DesignSeparatorControl,
	Separator,
	WhenResponsiveScreen,
} from '@stackable/components'
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components'
import { withBlockStyles, withGoogleFont, withSetAttributeHook, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'

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
			<PanelBody
				title={ __( 'Separator' ) }
			>
				<ColorPaletteControl
					label={ __( 'Separator Color' ) }
					value={ layer1Color }
					onChange={ layer1Color => setAttributes( { layer1Color } ) }
				/>
				<RangeControl
					label={ __( 'Separator Width' ) }
					value={ layer1Width }
					min="1"
					max="4"
					step="0.1"
					onChange={ layer1Width => setAttributes( { layer1Width } ) }
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally' ) }
					checked={ layer1Flip }
					onChange={ layer1Flip => setAttributes( { layer1Flip } ) }
				/>
				<ToggleControl
					label={ __( 'Shadow' ) }
					checked={ layer1Shadow }
					onChange={ layer1Shadow => setAttributes( { layer1Shadow } ) }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'General' ) }
				initialOpen={ false }
			>
				<WhenResponsiveScreen screen="desktop">
					<AdvancedRangeControl
						label={ __( 'Height' ) }
						value={ height }
						min="30"
						max="400"
						onChange={ height => {
							props.setAttributes( { height } )
						} }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<AdvancedRangeControl
						label={ __( 'Height' ) }
						value={ tabletHeight }
						min="30"
						max="400"
						onChange={ tabletHeight => {
							props.setAttributes( { tabletHeight } )
						} }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<AdvancedRangeControl
						label={ __( 'Height' ) }
						value={ mobileHeight }
						min="30"
						max="400"
						onChange={ mobileHeight => {
							props.setAttributes( { mobileHeight } )
						} }
					/>
				</WhenResponsiveScreen>
				<ToggleControl
					label={ __( 'Flip Vertically' ) }
					checked={ flipVertically }
					onChange={ flipVertically => setAttributes( { flipVertically } ) }
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally' ) }
					checked={ flipHorizontally }
					onChange={ flipHorizontally => setAttributes( { flipHorizontally } ) }
				/>
				<ColorPaletteControl
					label={ __( 'Background Color' ) }
					value={ backgroundColor }
					onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'Spacing' ) }
				initialOpen={ false }
			>
				<WhenResponsiveScreen screen="desktop">
					<AdvancedRangeControl
						label={ __( 'Padding Top' ) }
						value={ paddingTop }
						min="0"
						max="400"
						onChange={ paddingTop => setAttributes( { paddingTop } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ paddingUnit }
						onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Padding Bottom' ) }
						value={ paddingBottom }
						min="0"
						max="400"
						onChange={ paddingBottom => setAttributes( { paddingBottom } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ paddingUnit }
						onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Top' ) }
						value={ marginTop }
						min={ -height - paddingTop - 100 }
						max="400"
						onChange={ marginTop => setAttributes( { marginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
						units={ [ 'px', '%' ] }
						unit={ marginUnit }
						onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Bottom' ) }
						value={ marginBottom }
						min={ -height - paddingBottom - 100 }
						max="400"
						onChange={ marginBottom => setAttributes( { marginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
						units={ [ 'px', '%' ] }
						unit={ marginUnit }
						onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<AdvancedRangeControl
						label={ __( 'Padding Top' ) }
						value={ tabletPaddingTop }
						min="0"
						max="400"
						onChange={ tabletPaddingTop => setAttributes( { tabletPaddingTop } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ tabletPaddingUnit }
						onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Padding Bottom' ) }
						value={ tabletPaddingBottom }
						min="0"
						max="400"
						onChange={ tabletPaddingBottom => setAttributes( { tabletPaddingBottom } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ tabletPaddingUnit }
						onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Top' ) }
						value={ tabletMarginTop }
						min={ -tabletHeight - tabletPaddingTop - 100 }
						max="400"
						onChange={ tabletMarginTop => setAttributes( { tabletMarginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
						units={ [ 'px', '%' ] }
						unit={ tabletMarginUnit }
						onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Bottom' ) }
						value={ tabletMarginBottom }
						min={ -tabletHeight - tabletPaddingBottom - 100 }
						max="400"
						onChange={ tabletMarginBottom => setAttributes( { tabletMarginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
						units={ [ 'px', '%' ] }
						unit={ tabletMarginUnit }
						onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<AdvancedRangeControl
						label={ __( 'Padding Top' ) }
						value={ mobilePaddingTop }
						min="0"
						max="400"
						onChange={ mobilePaddingTop => setAttributes( { mobilePaddingTop } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ mobilePaddingUnit }
						onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Padding Bottom' ) }
						value={ mobilePaddingBottom }
						min="0"
						max="400"
						onChange={ mobilePaddingBottom => setAttributes( { mobilePaddingBottom } ) }
						units={ [ 'px', 'em', '%' ] }
						unit={ mobilePaddingUnit }
						onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Top' ) }
						value={ mobileMarginTop }
						min={ -mobileHeight - mobilePaddingTop - 100 }
						max="400"
						onChange={ mobileMarginTop => setAttributes( { mobileMarginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
						units={ [ 'px', '%' ] }
						unit={ mobileMarginUnit }
						onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Margin Bottom' ) }
						value={ mobileMarginBottom }
						min={ -mobileHeight - mobilePaddingBottom - 100 }
						max="400"
						onChange={ mobileMarginBottom => setAttributes( { mobileMarginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
						units={ [ 'px', '%' ] }
						unit={ mobileMarginUnit }
						onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
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
)( edit )
