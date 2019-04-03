import './pro'
import {
	ColorPaletteControl, DesignPanelBody, FourNumberControl, InspectorPanelControls, PanelTabs, WhenResponsiveScreen,
} from '@stackable/components'
import {
	PanelBody, RangeControl, ToggleControl,
} from '@wordpress/components'
import { separators, shadows } from './separators'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import ImageDesignCurve1 from './images/curve-1.png'
import ImageDesignCurve2 from './images/curve-2.png'
import ImageDesignCurve3 from './images/curve-3.png'
import ImageDesignRounded1 from './images/rounded-1.png'
import ImageDesignRounded2 from './images/rounded-2.png'
import ImageDesignSlant1 from './images/slant-1.png'
import ImageDesignSlant2 from './images/slant-2.png'
import ImageDesignWave1 from './images/wave-1.png'
import ImageDesignWave2 from './images/wave-2.png'
import ImageDesignWave3 from './images/wave-3.png'
import { InspectorControls } from '@wordpress/editor'

const edit = props => {
	const { className, setAttributes } = props
	const {
		height,
		design = 'wave-1',
		marginTop = 0,
		backgroundColor = '',
		flipVertically = false,
		flipHorizontally = false,
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,
		layer1Shadow = false,

		marginRight = '',
		marginBottom = 0,
		marginLeft = '',
		marginUnit = 'px',
		paddingTop = 0,
		paddingBottom = 0,
		paddingRight = '',
		paddingLeft = '',
		paddingUnit = 'px',

		tabletMarginTop = '',
		tabletMarginRight = '',
		tabletMarginBottom = '',
		tabletMarginLeft = '',
		tabletMarginUnit = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-separator',
		`ugb-separator--design-${ design }`,
	], applyFilters( 'stackable.separator.mainclasses', {
		'ugb-separator--flip-vertical': flipVertically,
		'ugb-separator--flip-horizontal': flipHorizontally,
	}, design, props ) )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		marginTop: `${ marginTop - 1 }${ marginUnit }`, // -1 to prevent white lines.
		marginBottom: `${ marginBottom - 1 }${ marginUnit }`, // -1 to prevent white lines.
		marginRight: marginRight !== '' ? `${ marginRight }${ marginUnit }` : undefined,
		marginLeft: marginLeft !== '' ? `${ marginLeft }${ marginUnit }` : undefined,
		paddingLeft: paddingLeft !== '' ? `${ paddingLeft }${ paddingUnit }` : undefined,
		paddingRight: paddingRight !== '' ? `${ paddingRight }${ paddingUnit }` : undefined,
	}

	const bottomPadStyle = {
		height: `${ paddingBottom }${ paddingUnit }`,
		background: layer1Color ? layer1Color : undefined,
	}

	const topPadStyle = {
		height: `${ paddingTop }${ paddingUnit }`,
		background: backgroundColor ? backgroundColor : undefined,
	}

	const svgWrapperStyle = {
		height: height + 'px',
	}

	const layer1Style = {
		fill: layer1Color ? layer1Color : undefined,
		transform: layer1Width ? `scaleX(${ layer1Width })` : undefined,
	}

	if ( layer1Flip ) {
		layer1Style.transform = layer1Style.transform ? `${ layer1Style.transform } scaleX(-1)` : 'scaleX(-1)'
	}

	const Separator = separators[ design ]
	const Shadow = shadows[ design ]

	return (
		<Fragment>
			<InspectorControls>
				<PanelTabs />
			</InspectorControls>

			<InspectorPanelControls>
				<DesignPanelBody
					initialOpen={ true }
					selected={ design }
					options={ [
						{
							image: ImageDesignWave1, label: __( 'Wave 1' ), value: 'wave-1',
						},
						{
							image: ImageDesignWave2, label: __( 'Wave 2' ), value: 'wave-2',
						},
						{
							image: ImageDesignWave3, label: __( 'Wave 3' ), value: 'wave-3',
						},
						{
							image: ImageDesignSlant1, label: __( 'Slant 1' ), value: 'slant-1',
						},
						{
							image: ImageDesignSlant2, label: __( 'Slant 2' ), value: 'slant-2',
						},
						{
							image: ImageDesignCurve1, label: __( 'Curve 1' ), value: 'curve-1',
						},
						{
							image: ImageDesignCurve2, label: __( 'Curve 2' ), value: 'curve-2',
						},
						{
							image: ImageDesignCurve3, label: __( 'Curve 3' ), value: 'curve-3',
						},
						{
							image: ImageDesignRounded1, label: __( 'Rounded 1' ), value: 'rounded-1',
						},
						{
							image: ImageDesignRounded2, label: __( 'Rounded 2' ), value: 'rounded-2',
						},
						...applyFilters( 'stackable.separator.edit.designs', [] ),
					] }
					onChange={ design => setAttributes( { design } ) }
				/>
				{ applyFilters( 'stackable.separator.edit.inspector.layout.after', null, design, props ) }
			</InspectorPanelControls>

			<InspectorPanelControls tab="style">
				{ applyFilters( 'stackable.separator.edit.inspector.style.before', null, design, props ) }
				<PanelBody
					title={ __( 'General' ) }
				>
					<RangeControl
						label={ __( 'Height' ) }
						value={ height }
						min="30"
						max="400"
						onChange={ height => {
							props.setAttributes( { height } )
						} }
					/>
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
					title={ __( 'Separator' ) }
					initialOpen={ false }
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
					title={ __( 'Spacing' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Padding Top' ) }
						value={ paddingTop }
						min="0"
						max="400"
						onChange={ paddingTop => setAttributes( { paddingTop } ) }
					/>
					<RangeControl
						label={ __( 'Padding Bottom' ) }
						value={ paddingBottom }
						min="0"
						max="400"
						onChange={ paddingBottom => setAttributes( { paddingBottom } ) }
					/>
					<RangeControl
						label={ __( 'Margin Top' ) }
						value={ marginTop }
						min={ -height - paddingTop - 100 }
						max="400"
						onChange={ marginTop => setAttributes( { marginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
					/>
					<RangeControl
						label={ __( 'Margin Bottom' ) }
						value={ marginBottom }
						min={ -height - paddingBottom - 100 }
						max="400"
						onChange={ marginBottom => setAttributes( { marginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
					/>
				</PanelBody>
				{ applyFilters( 'stackable.separator.edit.inspector.style.after', null, design, props ) }
			</InspectorPanelControls>

			<InspectorPanelControls tab="advanced">
				{ applyFilters( 'stackable.separator.edit.inspector.advanced.before', null, design, props ) }
				<PanelBody
					title={ __( 'Spacing' ) }
					initialOpen={ true }
				>
					<WhenResponsiveScreen screen="desktop">
						<FourNumberControl
							label={ __( 'Margins' ) }
							units={ [ 'px', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ marginTop }
							bottom={ marginBottom }
							right={ marginRight }
							left={ marginLeft }
							unit={ marginUnit }
							onChange={ ( { top, right, bottom, left } ) => {
								setAttributes( {
									marginTop: top,
									marginRight: right,
									marginBottom: bottom,
									marginLeft: left,
								} )
							} }
							onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FourNumberControl
							label={ __( 'Margins' ) }
							units={ [ 'px', '%' ] }
							unit="px"
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FourNumberControl
							label={ __( 'Margins' ) }
							units={ [ 'px', '%' ] }
							unit="px"
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="desktop">
						<FourNumberControl
							label={ __( 'Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ paddingTop }
							bottom={ paddingBottom }
							right={ paddingRight }
							left={ paddingLeft }
							unit={ paddingUnit }
							onChange={ ( { top, right, bottom, left } ) => {
								setAttributes( {
									paddingTop: top,
									paddingRight: right,
									paddingBottom: bottom,
									paddingLeft: left,
								} )
							} }
							onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FourNumberControl
							label={ __( 'Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							unit="px"
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FourNumberControl
							label={ __( 'Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							unit="px"
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
						/>
					</WhenResponsiveScreen>
				</PanelBody>
				{ applyFilters( 'stackable.separator.edit.inspector.after', null, design, props ) }
				{ applyFilters( 'stackable.separator.edit.inspector.advanced.after', null, design, props ) }
			</InspectorPanelControls>

			{ applyFilters( 'stackable.separator.edit.output.before', null, design, props ) }

			<div className={ mainClasses } style={ mainStyle } aria-hidden="true">
				<div className="ugb-separator__top-pad" style={ topPadStyle }></div>
				<div className="ugb-separator__svg-wrapper" style={ svgWrapperStyle }>
					<div className="ugb-separator__svg-inner">
						{ layer1Shadow && (
							<Shadow
								className="ugb-separator__shadow"
								preserveAspectRatio="none"
								style={ layer1Style }
							/>
						) }
						<Separator
							className="ugb-separator__layer-1"
							preserveAspectRatio="none"
							style={ layer1Style }
						/>
						{ applyFilters( 'stackable.separator.edit.output.layers', null, design, props ) }
					</div>
				</div>
				<div className="ugb-separator__bottom-pad" style={ bottomPadStyle }></div>
			</div>
		</Fragment>
	)
}

export default edit
