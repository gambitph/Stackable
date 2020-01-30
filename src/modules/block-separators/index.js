/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	ColorPaletteControl,
	DesignSeparatorControl,
	PanelAdvancedSettings,
	ProControlButton,
	ResponsiveControl,
	Separator,
} from '~stackable/components'
import { createAllCombinationAttributes } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import { i18n, showProNotice } from 'stackable'
import { __ } from '@wordpress/i18n'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'
import { ToggleControl } from '@wordpress/components'

const addBlockSeparatorPanels = ( blockName, options = {} ) => ( output, props ) => {
	const { setAttributes } = props
	const {
		showTopSeparator = false,
		topSeparatorDesign = 'wave-1',
		topSeparatorColor = '',
		topSeparatorWidth = '',
		topSeparatorFlipHorizontally = false,
		topSeparatorFlipVertically = false,
		topSeparatorShadow = true,
		topSeparatorBringToFront = false,
		showBottomSeparator = false,
		bottomSeparatorDesign = 'wave-1',
		bottomSeparatorColor = '',
		bottomSeparatorWidth = '',
		bottomSeparatorFlipHorizontally = false,
		bottomSeparatorFlipVertically = false,
		bottomSeparatorShadow = true,
		bottomSeparatorBringToFront = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Top Separator', i18n ) }
				id="top-separator"
				checked={ showTopSeparator }
				onChange={ showTopSeparator => setAttributes( { showTopSeparator } ) }
				toggleOnSetAttributes={ [
					'topSeparatorDesign',
					'topSeparatorColor',
					'topSeparatorHeight',
					'topSeparatorTabletHeight',
					'topSeparatorMobileHeight',
					'topSeparatorWidth',
					'topSeparatorFlipHorizontally',
					'topSeparatorFlipVertically',
					'topSeparatorShadow',
					'topSeparatorBringToFront',
					'showTopSeparatorLayer2',
					'showTopSeparatorLayer3',
					'topSeparatorLayer2Color',
					'topSeparatorLayer3Color',
					'topSeparatorLayer2BlendMode',
					'topSeparatorLayer3BlendMode',
					'topSeparatorLayer2Height',
					'topSeparatorLayer3Height',
					'topSeparatorLayer2Width',
					'topSeparatorLayer3Width',
					'topSeparatorLayer2Opacity',
					'topSeparatorLayer3Opacity',
					'topSeparatorLayer2FlipHorizontally',
					'topSeparatorLayer3FlipHorizontally',
				] }
				toggleAttributeName="showTopSeparator"
				className="ugb-top-block-separator-panel ugb--help-tip-separator-top-on"
			>
				<DesignSeparatorControl
					label={ __( 'Design', i18n ) }
					selected={ topSeparatorDesign }
					onChange={ topSeparatorDesign => setAttributes( { topSeparatorDesign } ) }
				/>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					value={ topSeparatorColor }
					onChange={ topSeparatorColor => setAttributes( { topSeparatorColor } ) }
				/>
				<ResponsiveControl
					attrNameTemplate="topSeparator%sHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						min="30"
						max="400"
						allowReset={ true }
						placeholder="200"
						className="ugb--help-tip-separator-height"
					/>
				</ResponsiveControl>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					min="1"
					max="4"
					step="0.1"
					value={ topSeparatorWidth }
					onChange={ topSeparatorWidth => setAttributes( { topSeparatorWidth } ) }
					allowReset={ true }
					placeholder="1.0"
					className="ugb--help-tip-separator-width"
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					checked={ topSeparatorFlipHorizontally }
					onChange={ topSeparatorFlipHorizontally => setAttributes( { topSeparatorFlipHorizontally } ) }
				/>
				<ToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					checked={ topSeparatorFlipVertically }
					onChange={ topSeparatorFlipVertically => setAttributes( { topSeparatorFlipVertically } ) }
				/>
				<ToggleControl
					label={ __( 'Shadow', i18n ) }
					checked={ topSeparatorShadow }
					onChange={ topSeparatorShadow => setAttributes( { topSeparatorShadow } ) }
					className="ugb--help-tip-separator-shadow"
				/>
				{ options.enableBringToFront &&
					<ToggleControl
						label={ __( 'Bring to Front', i18n ) }
						checked={ topSeparatorBringToFront }
						onChange={ topSeparatorBringToFront => setAttributes( { topSeparatorBringToFront } ) }
						className="ugb--help-tip-separator-bring-to-front"
					/>
				}
				{ applyFilters( 'stackable.block-separators.edit.top', null, props ) }
				{ showProNotice && <ProControlButton
					title={ __( 'Say Hello to Gorgeous Separators 👋', i18n ) }
					description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
				/> }
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Bottom Separator', i18n ) }
				id="bottom-separator"
				checked={ showBottomSeparator }
				onChange={ showBottomSeparator => setAttributes( { showBottomSeparator } ) }
				toggleOnSetAttributes={ [
					'bottomSeparatorDesign',
					'bottomSeparatorColor',
					'bottomSeparatorHeight',
					'bottomSeparatorTabletHeight',
					'bottomSeparatorMobileHeight',
					'bottomSeparatorWidth',
					'bottomSeparatorFlipHorizontally',
					'bottomSeparatorFlipVertically',
					'bottomSeparatorShadow',
					'bottomSeparatorBringToFront',
					'showBottomSeparatorLayer2',
					'showBottomSeparatorLayer3',
					'bottomSeparatorLayer2Color',
					'bottomSeparatorLayer3Color',
					'bottomSeparatorLayer2BlendMode',
					'bottomSeparatorLayer3BlendMode',
					'bottomSeparatorLayer2Height',
					'bottomSeparatorLayer3Height',
					'bottomSeparatorLayer2Width',
					'bottomSeparatorLayer3Width',
					'bottomSeparatorLayer2Opacity',
					'bottomSeparatorLayer3Opacity',
					'bottomSeparatorLayer2FlipHorizontally',
					'bottomSeparatorLayer3FlipHorizontally',
				] }
				toggleAttributeName="showBottomSeparator"
				className="ugb-bottom-block-separator-panel ugb--help-tip-separator-bottom-on"
			>
				<DesignSeparatorControl
					label={ __( 'Design', i18n ) }
					selected={ bottomSeparatorDesign }
					onChange={ bottomSeparatorDesign => setAttributes( { bottomSeparatorDesign } ) }
				/>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					value={ bottomSeparatorColor }
					onChange={ bottomSeparatorColor => setAttributes( { bottomSeparatorColor } ) }
				/>
				<ResponsiveControl
					attrNameTemplate="bottomSeparator%sHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						min="30"
						max="400"
						allowReset={ true }
						placeholder="200"
						className="ugb--help-tip-separator-height"
					/>
				</ResponsiveControl>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					min="1"
					max="4"
					step="0.1"
					value={ bottomSeparatorWidth }
					onChange={ bottomSeparatorWidth => setAttributes( { bottomSeparatorWidth } ) }
					allowReset={ true }
					placeholder="1.0"
					className="ugb--help-tip-separator-width"
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					checked={ bottomSeparatorFlipHorizontally }
					onChange={ bottomSeparatorFlipHorizontally => setAttributes( { bottomSeparatorFlipHorizontally } ) }
				/>
				<ToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					checked={ bottomSeparatorFlipVertically }
					onChange={ bottomSeparatorFlipVertically => setAttributes( { bottomSeparatorFlipVertically } ) }
				/>
				<ToggleControl
					label={ __( 'Shadow', i18n ) }
					checked={ bottomSeparatorShadow }
					onChange={ bottomSeparatorShadow => setAttributes( { bottomSeparatorShadow } ) }
					className="ugb--help-tip-separator-shadow"
				/>
				{ options.enableBringToFront &&
					<ToggleControl
						label={ __( 'Bring to Front', i18n ) }
						checked={ bottomSeparatorBringToFront }
						onChange={ bottomSeparatorBringToFront => setAttributes( { bottomSeparatorBringToFront } ) }
						className="ugb--help-tip-separator-bring-to-front"
					/>
				}
				{ applyFilters( 'stackable.block-separators.edit.bottom', null, props ) }
				{ showProNotice && <ProControlButton
					title={ __( 'Say Hello to Gorgeous Separators 👋', i18n ) }
					description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
				/> }
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const addAttributes = attributes => {
	return {
		...attributes,
		...createAllCombinationAttributes(
			'Show%sSeparator',
			{
				type: 'boolean',
				default: '',
			},
			[ 'Top', 'Bottom' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'string',
				default: 'wave-1',
			},
			[ 'Top', 'Bottom' ],
			[ 'Design' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'string',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'Color' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'number',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'Height', 'TabletHeight', 'MobileHeight', 'Width' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'boolean',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'FlipHorizontally', 'FlipVertically', 'BringToFront' ],
		),
		...createAllCombinationAttributes(
			'%sSeparatorShadow',
			{
				type: 'boolean',
				default: true,
			},
			[ 'Top', 'Bottom' ],
		),

		// Premium attributes.
		...createAllCombinationAttributes(
			'Show%sSeparator%s',
			{
				type: 'boolean',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'Layer2', 'Layer3' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'string',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'Layer2Color', 'Layer3Color', 'Layer2BlendMode', 'Layer3BlendMode' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'number',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'Layer2Height', 'Layer3Height', 'Layer2Width', 'Layer3Width', 'Layer2Opacity', 'Layer3Opacity' ],
		),
		...createAllCombinationAttributes(
			'%sSeparator%s',
			{
				type: 'boolean',
				default: '',
			},
			[ 'Top', 'Bottom' ],
			[ 'Layer2FlipHorizontally', 'Layer3FlipHorizontally' ],
		),
	}
}

const addShapeOutput = ( output, design, blockProps ) => {
	const {
		showTopSeparator = false,
		topSeparatorDesign = 'wave-1',
		topSeparatorFlipVertically = false,
		topSeparatorShadow = true,
		showBottomSeparator = false,
		bottomSeparatorDesign = 'wave-1',
		bottomSeparatorFlipVertically = false,
		bottomSeparatorShadow = true,
	} = blockProps.attributes

	return (
		<Fragment>
			{ output }
			{ showTopSeparator && (
				<Fragment>
					<div className="ugb-top-separator">
						<Separator design={ topSeparatorDesign } shadow={ topSeparatorShadow } inverted={ topSeparatorFlipVertically }>
							{ applyFilters( 'stackable.module.block-separator.output.top.after', null, blockProps ) }
						</Separator>
					</div>
				</Fragment>
			) }
			{ showBottomSeparator && (
				<Fragment>
					<div className="ugb-bottom-separator">
						<Separator design={ bottomSeparatorDesign } shadow={ bottomSeparatorShadow } inverted={ bottomSeparatorFlipVertically }>
							{ applyFilters( 'stackable.module.block-separator.output.bottom.after', null, blockProps ) }
						</Separator>
					</div>
				</Fragment>
			) }
		</Fragment>
	)
}

const addTopStyles = ( blockName, options = {} ) => ( styleObject, props ) => {
	const {
		showTopSeparator = false,
		topSeparatorColor = '',
		topSeparatorHeight = '',
		topSeparatorTabletHeight = '',
		topSeparatorMobileHeight = '',
		topSeparatorWidth = '',
		topSeparatorFlipHorizontally = false,
		topSeparatorBringToFront = false,
	} = props.attributes

	if ( ! showTopSeparator ) {
		return styleObject
	}

	const styles = {
		[ `.ugb-top-separator` ]: {
			zIndex: options.enableBringToFront && topSeparatorBringToFront ? 6 : undefined,
			transform: topSeparatorFlipHorizontally ? 'scale(-1)' : undefined,
		},
		[ `.ugb-top-separator svg` ]: {
			fill: topSeparatorColor !== '' ? topSeparatorColor : undefined,
		},
		[ `.ugb-top-separator .ugb-separator-wrapper` ]: {
			height: topSeparatorHeight !== '' ? `${ topSeparatorHeight }px` : undefined,
			transform: topSeparatorWidth !== '' ? `scaleX(${ topSeparatorWidth })` : undefined,
		},
		tablet: {
			[ `.ugb-top-separator .ugb-separator-wrapper` ]: {
				height: topSeparatorTabletHeight !== '' ? `${ topSeparatorTabletHeight }px` : undefined,
			},
		},
		mobile: {
			[ `.ugb-top-separator .ugb-separator-wrapper` ]: {
				height: topSeparatorMobileHeight !== '' ? `${ topSeparatorMobileHeight }px` : undefined,
			},
		},
	}

	return deepmerge( styleObject, styles )
}

const addBottomStyles = ( blockName, options = {} ) => ( styleObject, props ) => {
	const {
		showBottomSeparator = false,
		bottomSeparatorColor = '',
		bottomSeparatorHeight = '',
		bottomSeparatorTabletHeight = '',
		bottomSeparatorMobileHeight = '',
		bottomSeparatorWidth = '',
		bottomSeparatorFlipHorizontally = false,
		bottomSeparatorBringToFront = false,
	} = props.attributes

	if ( ! showBottomSeparator ) {
		return styleObject
	}

	const styles = {
		[ `.ugb-bottom-separator` ]: {
			zIndex: options.enableBringToFront && bottomSeparatorBringToFront ? 6 : undefined,
			transform: bottomSeparatorFlipHorizontally ? 'scaleX(-1)' : undefined,
		},
		[ `.ugb-bottom-separator svg` ]: {
			fill: bottomSeparatorColor !== '' ? bottomSeparatorColor : undefined,
		},
		[ `.ugb-bottom-separator .ugb-separator-wrapper` ]: {
			height: bottomSeparatorHeight !== '' ? `${ bottomSeparatorHeight }px` : undefined,
			transform: bottomSeparatorWidth !== '' ? `scaleX(${ bottomSeparatorWidth })` : undefined,
		},
		tablet: {
			[ `.ugb-bottom-separator .ugb-separator-wrapper` ]: {
				height: bottomSeparatorTabletHeight !== '' ? `${ bottomSeparatorTabletHeight }px` : undefined,
			},
		},
		mobile: {
			[ `.ugb-bottom-separator .ugb-separator-wrapper` ]: {
				height: bottomSeparatorMobileHeight !== '' ? `${ bottomSeparatorMobileHeight }px` : undefined,
			},
		},
	}

	return deepmerge( styleObject, styles )
}

const addSeparatorClassNames = ( mainClasses, props ) => {
	const {
		showTopSeparator = false,
		showBottomSeparator = false,
	} = props.attributes

	return {
		...mainClasses,
		'ugb--has-top-separator': showTopSeparator,
		'ugb--has-bottom-separator': showBottomSeparator,
	}
}

const blockSeparators = ( blockName, options = {} ) => {
	const optionsToPass = {
		enableBringToFront: true,
		...options,
	}
	addFilter( `stackable.${ blockName }.edit.inspector.style.block`, `stackable/${ blockName }/block-separators`, addBlockSeparatorPanels( blockName, optionsToPass ), 18 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/block-separators`, addAttributes )
	addFilter( `stackable.${ blockName }.edit.output.outer`, `stackable/${ blockName }/block-separators`, addShapeOutput )
	addFilter( `stackable.${ blockName }.save.output.outer`, `stackable/${ blockName }/block-separators`, addShapeOutput )
	addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/block-separators/top`, addTopStyles( blockName, optionsToPass ) )
	addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/block-separators/bottom`, addBottomStyles( blockName, optionsToPass ) )
	addFilter( `stackable.${ blockName }.main-block.classes`, `stackable/${ blockName }/block-separators`, addSeparatorClassNames )
	doAction( `stackable.module.block-separators`, blockName )
}

export default blockSeparators
