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
	addFilter, applyFilters, doAction, removeFilter,
} from '@wordpress/hooks'
import { i18n, showProNotice } from 'stackable'
import { __ } from '@wordpress/i18n'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'
import { ToggleControl } from '@wordpress/components'

const separatorAddedPadding = 200

// Adjust the padding when the separator is added.
removeFilter( 'stackable.setAttributes', 'stackable/modules/block-separators/top' )
addFilter( 'stackable.setAttributes', 'stackable/modules/block-separators/top', ( attributes, blockProps ) => {
	if ( typeof attributes.showTopSeparator === 'undefined' ) {
		return attributes
	}
	if ( attributes.showTopSeparator ) {
		if ( blockProps.attributes.paddingTop === '' ) {
			attributes.paddingTop = separatorAddedPadding
		}
		if ( blockProps.attributes.tabletPaddingTop === '' ) {
			attributes.tabletPaddingTop = separatorAddedPadding
		}
		if ( blockProps.attributes.mobilePaddingTop === '' ) {
			attributes.mobilePaddingTop = separatorAddedPadding
		}
	} else {
		if ( blockProps.attributes.paddingTop === separatorAddedPadding ) {
			attributes.paddingTop = ''
		}
		if ( blockProps.attributes.tabletPaddingTop === separatorAddedPadding ) {
			attributes.tabletPaddingTop = ''
		}
		if ( blockProps.attributes.mobilePaddingTop === separatorAddedPadding ) {
			attributes.mobilePaddingTop = ''
		}
	}
	return attributes
} )

// Adjust the padding when the separator is added.
removeFilter( 'stackable.setAttributes', 'stackable/modules/block-separators/bottom' )
addFilter( 'stackable.setAttributes', 'stackable/modules/block-separators/bottom', ( attributes, blockProps ) => {
	if ( typeof attributes.showBottomSeparator === 'undefined' ) {
		return attributes
	}
	if ( attributes.showBottomSeparator ) {
		if ( blockProps.attributes.paddingBottom === '' ) {
			attributes.paddingBottom = separatorAddedPadding
		}
		if ( blockProps.attributes.tabletPaddingBottom === '' ) {
			attributes.tabletPaddingBottom = separatorAddedPadding
		}
		if ( blockProps.attributes.mobilePaddingBottom === '' ) {
			attributes.mobilePaddingBottom = separatorAddedPadding
		}
	} else {
		if ( blockProps.attributes.paddingBottom === separatorAddedPadding ) {
			attributes.paddingBottom = ''
		}
		if ( blockProps.attributes.tabletPaddingBottom === separatorAddedPadding ) {
			attributes.tabletPaddingBottom = ''
		}
		if ( blockProps.attributes.mobilePaddingBottom === separatorAddedPadding ) {
			attributes.mobilePaddingBottom = ''
		}
	}
	return attributes
} )

const addBlockSeparatorPanels = ( output, props ) => {
	const { setAttributes } = props
	const {
		showTopSeparator = false,
		topSeparatorDesign = 'wave-1',
		topSeparatorColor = '',
		topSeparatorWidth = '',
		topSeparatorFlipHorizontally = false,
		topSeparatorShadow = true,
		topSeparatorBringToFront = false,
		showBottomSeparator = false,
		bottomSeparatorDesign = 'wave-1',
		bottomSeparatorColor = '',
		bottomSeparatorWidth = '',
		bottomSeparatorFlipHorizontally = false,
		bottomSeparatorShadow = true,
		bottomSeparatorBringToFront = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Top Separator', i18n ) }
				checked={ showTopSeparator }
				onChange={ showTopSeparator => setAttributes( { showTopSeparator } ) }
				className="ugb-top-block-separator-panel"
				toggleOnSetAttributes={ [
					'topSeparatorDesign',
					'topSeparatorColor',
					'topSeparatorHeight',
					'topSeparatorTabletHeight',
					'topSeparatorMobileHeight',
					'topSeparatorWidth',
					'topSeparatorFlipHorizontally',
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
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					checked={ topSeparatorFlipHorizontally }
					onChange={ topSeparatorFlipHorizontally => setAttributes( { topSeparatorFlipHorizontally } ) }
				/>
				<ToggleControl
					label={ __( 'Shadow', i18n ) }
					checked={ topSeparatorShadow }
					onChange={ topSeparatorShadow => setAttributes( { topSeparatorShadow } ) }
				/>
				<ToggleControl
					label={ __( 'Bring to Front', i18n ) }
					checked={ topSeparatorBringToFront }
					onChange={ topSeparatorBringToFront => setAttributes( { topSeparatorBringToFront } ) }
				/>
				{ applyFilters( 'stackable.block-separators.edit.top', null, props ) }
				{ showProNotice && <ProControlButton
					title={ __( 'Say Hello to Gorgeous Separators 👋', i18n ) }
					description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
				/> }
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Bottom Separator', i18n ) }
				checked={ showBottomSeparator }
				onChange={ showBottomSeparator => setAttributes( { showBottomSeparator } ) }
				className="ugb-bottom-block-separator-panel"
				toggleOnSetAttributes={ [
					'bottomSeparatorDesign',
					'bottomSeparatorColor',
					'bottomSeparatorHeight',
					'bottomSeparatorTabletHeight',
					'bottomSeparatorMobileHeight',
					'bottomSeparatorWidth',
					'bottomSeparatorFlipHorizontally',
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
				/>
				<ToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					checked={ bottomSeparatorFlipHorizontally }
					onChange={ bottomSeparatorFlipHorizontally => setAttributes( { bottomSeparatorFlipHorizontally } ) }
				/>
				<ToggleControl
					label={ __( 'Shadow', i18n ) }
					checked={ bottomSeparatorShadow }
					onChange={ bottomSeparatorShadow => setAttributes( { bottomSeparatorShadow } ) }
				/>
				<ToggleControl
					label={ __( 'Bring to Front', i18n ) }
					checked={ bottomSeparatorBringToFront }
					onChange={ bottomSeparatorBringToFront => setAttributes( { bottomSeparatorBringToFront } ) }
				/>
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
			[ 'FlipHorizontally', 'BringToFront' ],
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
		topSeparatorShadow = true,
		showBottomSeparator = false,
		bottomSeparatorDesign = 'wave-1',
		bottomSeparatorShadow = true,
	} = blockProps.attributes

	return (
		<Fragment>
			{ output }
			{ showTopSeparator && (
				<Fragment>
					<div className="ugb-top-separator">
						<Separator design={ topSeparatorDesign } shadow={ topSeparatorShadow }>
							{ applyFilters( 'stackable.module.block-separator.output.top.after', null, blockProps ) }
						</Separator>
					</div>
				</Fragment>
			) }
			{ showBottomSeparator && (
				<Fragment>
					<div className="ugb-bottom-separator">
						<Separator design={ bottomSeparatorDesign } shadow={ bottomSeparatorShadow }>
							{ applyFilters( 'stackable.module.block-separator.output.bottom.after', null, blockProps ) }
						</Separator>
					</div>
				</Fragment>
			) }
		</Fragment>
	)
}

const addTopStyles = ( styleObject, props ) => {
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
			zIndex: topSeparatorBringToFront ? 6 : undefined,
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

const addBottomStyles = ( styleObject, props ) => {
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
			zIndex: bottomSeparatorBringToFront ? 6 : undefined,
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

const blockSeparators = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.style.block`, `stackable/${ blockName }/block-separators`, addBlockSeparatorPanels, 18 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/block-separators`, addAttributes )
	addFilter( `stackable.${ blockName }.edit.output.outer`, `stackable/${ blockName }/block-separators`, addShapeOutput )
	addFilter( `stackable.${ blockName }.save.output.outer`, `stackable/${ blockName }/block-separators`, addShapeOutput )
	addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/block-separators/top`, addTopStyles )
	addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/block-separators/bottom`, addBottomStyles )
	doAction( `stackable.module.block-separators`, blockName )
}

export default blockSeparators
