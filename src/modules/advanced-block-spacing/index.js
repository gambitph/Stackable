import { addFilter, applyFilters, doAction, removeFilter } from '@wordpress/hooks'
import { AdvancedRangeControl, AdvancedSelectControl, FourNumberControl, WhenResponsiveScreen } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { createAllCombinationAttributes } from '@stackable/util'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'

const verticalAlignOptions = [
	{ value: '', label: __( 'Default' ) },
	{ value: 'stretch', label: __( 'Stretch' ) },
	{ value: 'flex-start', label: __( 'Top' ) },
	{ value: 'flex-end', label: __( 'Bottom' ) },
	{ value: 'center', label: __( 'Center' ) },
	// { value: 'baseline', label: __( 'Baseline' ) },
]

const horizontalAlignOptions = [
	{ value: '', label: __( 'Default' ) },
	{ value: 'flex-start', label: __( 'Left' ) },
	{ value: 'center', label: __( 'Center' ) },
	{ value: 'flex-end', label: __( 'Right' ) },
	// { value: 'space-between', label: __( 'Space Between' ) },
	// { value: 'space-around', label: __( 'Space Around' ) },
	// { value: 'space-evenly', label: __( 'Space Evenly' ) },
]

removeFilter( 'stackable.setAttributes', 'stackable/module/block-spacing' )
addFilter( 'stackable.setAttributes', 'stackable/module/block-spacing', ( attributes, blockProps ) => {
	if ( typeof attributes.align === 'undefined' ) {
		return attributes
	}
	if ( attributes.align === 'full' && blockProps.align !== 'full' ) {
		attributes.marginRight = ''
		attributes.marginLeft = ''
		attributes.tabletMarginRight = ''
		attributes.tabletMarginLeft = ''
		attributes.tabletPaddingRight = ''
		attributes.tabletPaddingLeft = ''
	}
	return attributes
} )

const inspectorControls = ( blockName, options ) => ( output, props ) => {
	const { setAttributes } = props
	const {
		align = false,

		marginTop = '',
		marginRight = '',
		marginBottom = '',
		marginLeft = '',
		marginUnit = 'px',

		tabletMarginTop = '',
		tabletMarginRight = '',
		tabletMarginBottom = '',
		tabletMarginLeft = '',
		tabletMarginUnit = 'px',

		mobileMarginTop = '',
		mobileMarginRight = '',
		mobileMarginBottom = '',
		mobileMarginLeft = '',
		mobileMarginUnit = 'px',

		paddingTop = '',
		paddingBottom = '',
		paddingRight = '',
		paddingLeft = '',
		paddingUnit = 'px',

		tabletPaddingTop = '',
		tabletPaddingBottom = '',
		tabletPaddingRight = '',
		tabletPaddingLeft = '',
		tabletPaddingUnit = 'px',

		mobilePaddingTop = '',
		mobilePaddingBottom = '',
		mobilePaddingRight = '',
		mobilePaddingLeft = '',
		mobilePaddingUnit = 'px',

		blockHeight = '',
		blockHeightUnit = 'px',
		tabletBlockHeight = '',
		tabletBlockHeightUnit = 'px',
		mobileBlockHeight = '',
		mobileBlockHeightUnit = 'px',

		blockWidth = '',
		blockWidthUnit = 'px',
		tabletBlockWidth = '',
		tabletBlockWidthUnit = 'px',
		mobileBlockWidth = '',
		mobileBlockWidthUnit = 'px',

		blockHorizontalAlign = '',
		tabletBlockHorizontalAlign = '',
		mobileBlockHorizontalAlign = '',

		blockVerticalAlign = '',
		tabletBlockVerticalAlign = '',
		mobileBlockVerticalAlign = '',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody
				title={ __( 'Block Spacing' ) }
				initialOpen={ false }
			>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.block-spacing.before`, null, props ) }
				{ options.margins && <Fragment>
					<WhenResponsiveScreen screen="desktop">
						<FourNumberControl
							label={ __( 'Block Margins' ) }
							units={ [ 'px', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ marginTop }
							bottom={ marginBottom }
							right={ marginRight }
							left={ marginLeft }
							unit={ marginUnit }
							onChange={ margins => {
								setAttributes( {
									marginTop: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
									marginRight: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
									marginBottom: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
									marginLeft: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ align !== 'full' && options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ align !== 'full' && options.enableMarginLeft }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FourNumberControl
							label={ __( 'Block Margins' ) }
							units={ [ 'px', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ tabletMarginTop }
							bottom={ tabletMarginBottom }
							right={ tabletMarginRight }
							left={ tabletMarginLeft }
							unit={ tabletMarginUnit }
							onChange={ margins => {
								setAttributes( {
									tabletMarginTop: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
									tabletMarginRight: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
									tabletMarginBottom: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
									tabletMarginLeft: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ align !== 'full' && options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ align !== 'full' && options.enableMarginLeft }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FourNumberControl
							label={ __( 'Block Margins' ) }
							units={ [ 'px', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ mobileMarginTop }
							bottom={ mobileMarginBottom }
							right={ mobileMarginRight }
							left={ mobileMarginLeft }
							unit={ mobileMarginUnit }
							onChange={ margins => {
								setAttributes( {
									mobileMarginTop: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
									mobileMarginRight: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
									mobileMarginBottom: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
									mobileMarginLeft: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ align !== 'full' && options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ align !== 'full' && options.enableMarginLeft }
						/>
					</WhenResponsiveScreen>
				</Fragment> }
				{ options.paddings && <Fragment>
					<WhenResponsiveScreen screen="desktop">
						<FourNumberControl
							label={ __( 'Block Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ paddingTop }
							bottom={ paddingBottom }
							right={ paddingRight }
							left={ paddingLeft }
							unit={ paddingUnit }
							onChange={ paddings => {
								setAttributes( {
									paddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									paddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									paddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									paddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FourNumberControl
							label={ __( 'Block Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ tabletPaddingTop }
							bottom={ tabletPaddingBottom }
							right={ tabletPaddingRight }
							left={ tabletPaddingLeft }
							unit={ tabletPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									tabletPaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									tabletPaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									tabletPaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									tabletPaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FourNumberControl
							label={ __( 'Block Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ mobilePaddingTop }
							bottom={ mobilePaddingBottom }
							right={ mobilePaddingRight }
							left={ mobilePaddingLeft }
							unit={ mobilePaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									mobilePaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									mobilePaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									mobilePaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									mobilePaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.height && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Min. Block Height' ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 100, 10 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ blockHeight }
							unit={ blockHeightUnit }
							onChange={ blockHeight => setAttributes( { blockHeight } ) }
							onChangeUnit={ blockHeightUnit => setAttributes( { blockHeightUnit } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Min. Block Height' ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 100, 10 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ tabletBlockHeight }
							unit={ tabletBlockHeightUnit }
							onChange={ tabletBlockHeight => setAttributes( { tabletBlockHeight } ) }
							onChangeUnit={ tabletBlockHeightUnit => setAttributes( { tabletBlockHeightUnit } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Min. Block Height' ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 100, 10 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ mobileBlockHeight }
							unit={ mobileBlockHeightUnit }
							onChange={ mobileBlockHeight => setAttributes( { mobileBlockHeight } ) }
							onChangeUnit={ mobileBlockHeightUnit => setAttributes( { mobileBlockHeightUnit } ) }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.width && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Max. Content Width' ) }
							units={ [ 'px', '%' ] }
							min={ [ 100, 10 ] }
							max={ [ 2000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ blockWidth }
							unit={ blockWidthUnit }
							onChange={ blockWidth => setAttributes( { blockWidth } ) }
							onChangeUnit={ blockWidthUnit => setAttributes( { blockWidthUnit } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Max. Content Width' ) }
							units={ [ 'px', '%' ] }
							min={ [ 100, 10 ] }
							max={ [ 1500, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ tabletBlockWidth }
							unit={ tabletBlockWidthUnit }
							onChange={ tabletBlockWidth => setAttributes( { tabletBlockWidth } ) }
							onChangeUnit={ tabletBlockWidthUnit => setAttributes( { tabletBlockWidthUnit } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Max. Content Width' ) }
							units={ [ 'px', '%' ] }
							min={ [ 100, 10 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ mobileBlockWidth }
							unit={ mobileBlockWidthUnit }
							onChange={ mobileBlockWidth => setAttributes( { mobileBlockWidth } ) }
							onChangeUnit={ mobileBlockWidthUnit => setAttributes( { mobileBlockWidthUnit } ) }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.horizontalAlign && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Content Horizontal Align' ) }
							options={ horizontalAlignOptions }
							value={ blockHorizontalAlign }
							onChange={ blockHorizontalAlign => setAttributes( { blockHorizontalAlign } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Content Horizontal Align' ) }
							options={ horizontalAlignOptions }
							value={ tabletBlockHorizontalAlign }
							onChange={ tabletBlockHorizontalAlign => setAttributes( { tabletBlockHorizontalAlign } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Content Horizontal Align' ) }
							options={ horizontalAlignOptions }
							value={ mobileBlockHorizontalAlign }
							onChange={ mobileBlockHorizontalAlign => setAttributes( { mobileBlockHorizontalAlign } ) }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.verticalAlign && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Content Vertical Align' ) }
							options={ verticalAlignOptions }
							value={ blockVerticalAlign }
							onChange={ blockVerticalAlign => setAttributes( { blockVerticalAlign } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Content Vertical Align' ) }
							options={ verticalAlignOptions }
							value={ tabletBlockVerticalAlign }
							onChange={ tabletBlockVerticalAlign => setAttributes( { tabletBlockVerticalAlign } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Content Vertical Align' ) }
							options={ verticalAlignOptions }
							value={ mobileBlockVerticalAlign }
							onChange={ mobileBlockVerticalAlign => setAttributes( { mobileBlockVerticalAlign } ) }
						/>
					</WhenResponsiveScreen>
				</Fragment> }
				{ applyFilters( `stackable.${ blockName }.edit.advanced.block-spacing.after`, null, props ) }
			</PanelBody>
		</Fragment>
	)
}

const addToStyleObject = blockName => ( styleObject, props ) => {
	const {
		marginTop = '',
		marginRight = '',
		marginBottom = '',
		marginLeft = '',
		marginUnit = 'px',

		tabletMarginTop = '',
		tabletMarginRight = '',
		tabletMarginBottom = '',
		tabletMarginLeft = '',
		tabletMarginUnit = 'px',

		mobileMarginTop = '',
		mobileMarginRight = '',
		mobileMarginBottom = '',
		mobileMarginLeft = '',
		mobileMarginUnit = 'px',

		paddingTop = '',
		paddingBottom = '',
		paddingRight = '',
		paddingLeft = '',
		paddingUnit = 'px',

		tabletPaddingTop = '',
		tabletPaddingBottom = '',
		tabletPaddingRight = '',
		tabletPaddingLeft = '',
		tabletPaddingUnit = 'px',

		mobilePaddingTop = '',
		mobilePaddingBottom = '',
		mobilePaddingRight = '',
		mobilePaddingLeft = '',
		mobilePaddingUnit = 'px',

		blockHeight = '',
		blockHeightUnit = 'px',
		tabletBlockHeight = '',
		tabletBlockHeightUnit = 'px',
		mobileBlockHeight = '',
		mobileBlockHeightUnit = 'px',

		blockWidth = '',
		blockWidthUnit = 'px',
		tabletBlockWidth = '',
		tabletBlockWidthUnit = 'px',
		mobileBlockWidth = '',
		mobileBlockWidthUnit = 'px',

		blockHorizontalAlign = '',
		tabletBlockHorizontalAlign = '',
		mobileBlockHorizontalAlign = '',

		blockVerticalAlign = '',
		tabletBlockVerticalAlign = '',
		mobileBlockVerticalAlign = '',
	} = props.attributes

	const blockClass = `.${ props.mainClassName }`
	const margins = applyFilters( `stackable.${ blockName }.advanced-block-spacing.margins`, {
		[ blockClass ]: {
			marginTop: marginTop !== '' ? `${ marginTop }${ marginUnit } !important` : undefined,
			marginRight: marginRight !== '' ? `${ marginRight }${ marginUnit } !important` : undefined,
			marginBottom: marginBottom !== '' ? `${ marginBottom }${ marginUnit } !important` : undefined,
			marginLeft: marginLeft !== '' ? `${ marginLeft }${ marginUnit } !important` : undefined,
		},
		tablet: {
			[ blockClass ]: {
				marginTop: tabletMarginTop !== '' ? `${ tabletMarginTop }${ tabletMarginUnit } !important` : undefined,
				marginRight: tabletMarginRight !== '' ? `${ tabletMarginRight }${ tabletMarginUnit } !important` : undefined,
				marginBottom: tabletMarginBottom !== '' ? `${ tabletMarginBottom }${ tabletMarginUnit } !important` : undefined,
				marginLeft: tabletMarginLeft !== '' ? `${ tabletMarginLeft }${ tabletMarginUnit } !important` : undefined,
			},
		},
		mobile: {
			[ blockClass ]: {
				marginTop: mobileMarginTop !== '' ? `${ mobileMarginTop }${ mobileMarginUnit } !important` : undefined,
				marginRight: mobileMarginRight !== '' ? `${ mobileMarginRight }${ mobileMarginUnit } !important` : undefined,
				marginBottom: mobileMarginBottom !== '' ? `${ mobileMarginBottom }${ mobileMarginUnit } !important` : undefined,
				marginLeft: mobileMarginLeft !== '' ? `${ mobileMarginLeft }${ mobileMarginUnit } !important` : undefined,
			},
		},
	} )
	const paddings = applyFilters( `stackable.${ blockName }.advanced-block-spacing.paddings`, {
		[ blockClass ]: {
			paddingTop: paddingTop !== '' ? `${ paddingTop }${ paddingUnit } !important` : undefined,
			paddingRight: paddingRight !== '' ? `${ paddingRight }${ paddingUnit } !important` : undefined,
			paddingBottom: paddingBottom !== '' ? `${ paddingBottom }${ paddingUnit } !important` : undefined,
			paddingLeft: paddingLeft !== '' ? `${ paddingLeft }${ paddingUnit } !important` : undefined,
		},
		tablet: {
			[ blockClass ]: {
				paddingTop: tabletPaddingTop !== '' ? `${ tabletPaddingTop }${ tabletPaddingUnit } !important` : undefined,
				paddingRight: tabletPaddingRight !== '' ? `${ tabletPaddingRight }${ tabletPaddingUnit } !important` : undefined,
				paddingBottom: tabletPaddingBottom !== '' ? `${ tabletPaddingBottom }${ tabletPaddingUnit } !important` : undefined,
				paddingLeft: tabletPaddingLeft !== '' ? `${ tabletPaddingLeft }${ tabletPaddingUnit } !important` : undefined,
			},
		},
		mobile: {
			[ blockClass ]: {
				paddingTop: mobilePaddingTop !== '' ? `${ mobilePaddingTop }${ mobilePaddingUnit } !important` : undefined,
				paddingRight: mobilePaddingRight !== '' ? `${ mobilePaddingRight }${ mobilePaddingUnit } !important` : undefined,
				paddingBottom: mobilePaddingBottom !== '' ? `${ mobilePaddingBottom }${ mobilePaddingUnit } !important` : undefined,
				paddingLeft: mobilePaddingLeft !== '' ? `${ mobilePaddingLeft }${ mobilePaddingUnit } !important` : undefined,
			},
		},
	} )

	const others = {
		[ blockClass ]: {
			minHeight: blockHeight !== '' ? `${ blockHeight }${ blockHeightUnit }` : undefined,
			justifyContent: blockHorizontalAlign !== '' ? blockHorizontalAlign : undefined,
			alignItems: blockVerticalAlign !== '' ? blockVerticalAlign : undefined,
		},
		[ `${ blockClass } .ugb-inner-block` ]: {
			width: blockWidth !== '' ? `${ blockWidth }${ blockWidthUnit } !important` : undefined,
		},
		tablet: {
			[ blockClass ]: {
				minHeight: tabletBlockHeight !== '' ? `${ tabletBlockHeight }${ tabletBlockHeightUnit }` : undefined,
				justifyContent: tabletBlockHorizontalAlign !== '' ? tabletBlockHorizontalAlign : undefined,
				alignItems: tabletBlockVerticalAlign !== '' ? tabletBlockVerticalAlign : undefined,
			},
			[ `${ blockClass } .ugb-inner-block` ]: {
				width: tabletBlockWidth !== '' ? `${ tabletBlockWidth }${ tabletBlockWidthUnit } !important` : undefined,
			},
		},
		mobile: {
			[ blockClass ]: {
				minHeight: mobileBlockHeight !== '' ? `${ mobileBlockHeight }${ mobileBlockHeightUnit } !important` : undefined,
				justifyContent: mobileBlockHorizontalAlign !== '' ? mobileBlockHorizontalAlign : undefined,
				alignItems: mobileBlockVerticalAlign !== '' ? mobileBlockVerticalAlign : undefined,
			},
			[ `${ blockClass } .ugb-inner-block` ]: {
				width: mobileBlockWidth !== '' ? `${ mobileBlockWidth }${ mobileBlockWidthUnit } !important` : undefined,
			},
		},
	}

	return deepmerge.all( [ styleObject, margins, paddings, others ] )
}

const addAttributes = attributes => {
	return {
		...attributes,

		...createAllCombinationAttributes(
			'%sMargin%s',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Top', 'Right', 'Bottom', 'Left' ]
		),

		...createAllCombinationAttributes(
			'%sMarginUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ],
		),

		...createAllCombinationAttributes(
			'%sPadding%s',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Top', 'Right', 'Bottom', 'Left' ]
		),

		...createAllCombinationAttributes(
			'%sPaddingUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ],
		),

		...createAllCombinationAttributes(
			'%sBlockHeight',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlockHeightUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlockWidth',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlockWidthUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlock%sAlign',
			{
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Vertical', 'Horizontal' ]
		),
	}
}

const advancedBlockSpacing = ( blockName, options = {} ) => {
	const optionsToPass = {
		margins: true,
		paddings: true,
		height: true,
		width: true,
		horizontalAlign: true,
		verticalAlign: true,
		modifyStyles: true,
		enableMarginTop: true,
		enableMarginRight: true,
		enableMarginBottom: true,
		enableMarginLeft: true,
		enablePaddingTop: true,
		enablePaddingRight: true,
		enablePaddingBottom: true,
		enablePaddingLeft: true,
		...options,
	}

	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-block-spacing`, inspectorControls( blockName, optionsToPass ), 5 )
	if ( optionsToPass.modifyStyles ) {
		addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/advanced-block-spacing`, addToStyleObject( blockName, optionsToPass ) )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-block-spacing`, addAttributes )
	doAction( `stackable.module.advanced-block-spacing`, blockName )
}

export default advancedBlockSpacing
