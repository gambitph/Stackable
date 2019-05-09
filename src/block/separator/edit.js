import './pro'
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	BlockContainer, ColorPaletteControl, DesignPanelBody, PanelDesignLibrary, PanelDesignUserLibrary, ResponsiveRangeControl, WhenResponsiveScreen,
} from '@stackable/components'
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components'
import { separators, shadows } from './separators'
import { withBlockStyles, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
import { __ } from '@wordpress/i18n'
import { name as blockName } from './'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
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

addFilter( 'stackable.separator.edit.inspector.layout.before', 'stackable/separator', ( output, props ) => {
	const { setAttributes } = props

	const {
		design = 'wave-1',
	} = props.attributes
	return (
		<Fragment>
			{ output }
			<DesignPanelBody
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
			<PanelDesignLibrary
				options={ [
					...applyFilters( 'stackable.separator.edit.templates', [] ),
				] }
			/>
			<PanelDesignUserLibrary
				initialOpen={ false }
				block={ blockName }
				ignoredAttributes={ [] }
			/>
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
		tabletMarginTop = '',
		tabletMarginBottom = '',
		mobileMarginTop = '',
		mobileMarginBottom = '',
		backgroundColor = '',
		flipVertically = false,
		flipHorizontally = false,
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,
		layer1Shadow = false,
		paddingTop = 0,
		paddingBottom = 0,
		tabletPaddingTop = '',
		tabletPaddingBottom = '',
		mobilePaddingTop = '',
		mobilePaddingBottom = '',
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
					<ResponsiveRangeControl
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
					<ResponsiveRangeControl
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
					<ResponsiveRangeControl
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
					<ResponsiveRangeControl
						label={ __( 'Padding Top' ) }
						value={ paddingTop }
						min="0"
						max="400"
						onChange={ paddingTop => setAttributes( { paddingTop } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<ResponsiveRangeControl
						label={ __( 'Padding Top' ) }
						value={ tabletPaddingTop }
						min="0"
						max="400"
						onChange={ tabletPaddingTop => setAttributes( { tabletPaddingTop } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<ResponsiveRangeControl
						label={ __( 'Padding Top' ) }
						value={ mobilePaddingTop }
						min="0"
						max="400"
						onChange={ mobilePaddingTop => setAttributes( { mobilePaddingTop } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="desktop">
					<ResponsiveRangeControl
						label={ __( 'Padding Bottom' ) }
						value={ paddingBottom }
						min="0"
						max="400"
						onChange={ paddingBottom => setAttributes( { paddingBottom } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<ResponsiveRangeControl
						label={ __( 'Padding Bottom' ) }
						value={ tabletPaddingBottom }
						min="0"
						max="400"
						onChange={ tabletPaddingBottom => setAttributes( { tabletPaddingBottom } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<ResponsiveRangeControl
						label={ __( 'Padding Bottom' ) }
						value={ mobilePaddingBottom }
						min="0"
						max="400"
						onChange={ mobilePaddingBottom => setAttributes( { mobilePaddingBottom } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="desktop">
					<ResponsiveRangeControl
						label={ __( 'Margin Top' ) }
						value={ marginTop }
						min={ -height - paddingTop - 100 }
						max="400"
						onChange={ marginTop => setAttributes( { marginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<ResponsiveRangeControl
						label={ __( 'Margin Top' ) }
						value={ tabletMarginTop }
						min={ -tabletHeight - tabletPaddingTop - 100 }
						max="400"
						onChange={ tabletMarginTop => setAttributes( { tabletMarginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<ResponsiveRangeControl
						label={ __( 'Margin Top' ) }
						value={ mobileMarginTop }
						min={ -mobileHeight - mobilePaddingTop - 100 }
						max="400"
						onChange={ mobileMarginTop => setAttributes( { mobileMarginTop } ) }
						help={ __( 'Use this to pull up/down the separator to the block above it' ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="desktop">
					<ResponsiveRangeControl
						label={ __( 'Margin Bottom' ) }
						value={ marginBottom }
						min={ -height - paddingBottom - 100 }
						max="400"
						onChange={ marginBottom => setAttributes( { marginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<ResponsiveRangeControl
						label={ __( 'Margin Bottom' ) }
						value={ tabletMarginBottom }
						min={ -tabletHeight - tabletPaddingBottom - 100 }
						max="400"
						onChange={ tabletMarginBottom => setAttributes( { tabletMarginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<ResponsiveRangeControl
						label={ __( 'Margin Bottom' ) }
						value={ mobileMarginBottom }
						min={ -mobileHeight - mobilePaddingBottom - 100 }
						max="400"
						onChange={ mobileMarginBottom => setAttributes( { mobileMarginBottom } ) }
						help={ __( 'Use this to pull up/down the separator to the block below it' ) }
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
	}, props ) )

	const Separator = separators[ design ]
	const Shadow = shadows[ design ]

	return (
		<BlockContainer.Edit className={ mainClasses } aria-hidden="true" blockProps={ props } render={ () => (
			<Fragment>
				<div className="ugb-separator__top-pad" />
				<div className="ugb-separator__svg-wrapper">
					<div className="ugb-separator__svg-inner">
						{ layer1Shadow && (
							<Shadow className="ugb-separator__shadow" preserveAspectRatio="none" />
						) }
						<Separator
							className="ugb-separator__layer-1"
							preserveAspectRatio="none"
						/>
						{ applyFilters( 'stackable.separator.edit.output.layers', null, design, props ) }
					</div>
				</div>
				<div className="ugb-separator__bottom-pad" />
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withTabbedInspector,
	withBlockStyles( createStyles ),
)( edit )
