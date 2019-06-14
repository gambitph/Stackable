import { ColorPaletteControl, DesignPanelBody, ProControl } from '@stackable/components'
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components'
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
import { InspectorControls } from '@wordpress/block-editor'
import { showProNotice } from 'stackable'

const edit = props => {
	const { className, setAttributes } = props
	const {
		height,
		design = 'wave-1',
		marginTop = 0,
		marginBottom = 0,
		paddingTop = 0,
		paddingBottom = 0,
		backgroundColor = '',
		flipVertically = false,
		flipHorizontally = false,
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,
		layer1Shadow = false,
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
		marginTop: `${ marginTop - 1 }px`, // -1 to prevent white lines.
		marginBottom: `${ marginBottom - 1 }px`, // -1 to prevent white lines.
	}

	const bottomPadStyle = {
		height: `${ paddingBottom }px`,
		background: layer1Color ? layer1Color : undefined,
	}

	const topPadStyle = {
		height: `${ paddingTop }px`,
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
				<PanelBody
					title={ __( 'General Settings' ) }
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
				<PanelBody
					title={ __( 'Separator Settings' ) }
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
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Layer 2 Settings' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Gorgeous Separators 👋' ) }
							description={ __( 'Add a second layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Layer 3 Settings' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Gorgeous Separators 👋' ) }
							description={ __( 'Add a third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.separator.edit.inspector.after', null, design, props ) }
			</InspectorControls>
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
