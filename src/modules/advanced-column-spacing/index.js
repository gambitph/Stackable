import * as deepmerge from 'deepmerge'
import { addFilter, applyFilters, doAction } from '@wordpress/hooks'
import { AdvancedRangeControl, AdvancedSelectControl, FourNumberControl, WhenResponsiveScreen } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { createAllCombinationAttributes } from '@stackable/util'
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

const inspectorControls = ( blockName, options ) => ( output, props ) => {
	const { setAttributes } = props
	const {
		columnPaddingTop = '',
		columnPaddingBottom = '',
		columnPaddingRight = '',
		columnPaddingLeft = '',
		columnPaddingUnit = 'px',

		tabletColumnPaddingTop = '',
		tabletColumnPaddingBottom = '',
		tabletColumnPaddingRight = '',
		tabletColumnPaddingLeft = '',
		tabletColumnPaddingUnit = 'px',

		mobileColumnPaddingTop = '',
		mobileColumnPaddingBottom = '',
		mobileColumnPaddingRight = '',
		mobileColumnPaddingLeft = '',
		mobileColumnPaddingUnit = 'px',

		columnGap = '',
		tabletColumnGap = '',
		mobileColumnGap = '',

		columnHeight = '',
		tabletColumnHeight = '',
		mobileColumnHeight = '',

		columnVerticalAlign = '',
		tabletColumnVerticalAlign = '',
		mobileColumnVerticalAlign = '',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody
				title={ __( 'Column Spacing' ) }
				initialOpen={ false }
			>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.column-spacing.before`, null, props ) }
				{ options.paddings && <Fragment>
					<WhenResponsiveScreen screen="desktop">
						<FourNumberControl
							label={ __( 'Block Paddings' ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							top={ columnPaddingTop }
							bottom={ columnPaddingBottom }
							right={ columnPaddingRight }
							left={ columnPaddingLeft }
							unit={ columnPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									columnPaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									columnPaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									columnPaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									columnPaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ columnPaddingUnit => setAttributes( { columnPaddingUnit } ) }
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
							top={ tabletColumnPaddingTop }
							bottom={ tabletColumnPaddingBottom }
							right={ tabletColumnPaddingRight }
							left={ tabletColumnPaddingLeft }
							unit={ tabletColumnPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									tabletColumnPaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									tabletColumnPaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									tabletColumnPaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									tabletColumnPaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ tabletColumnPaddingUnit => setAttributes( { tabletColumnPaddingUnit } ) }
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
							top={ mobileColumnPaddingTop }
							bottom={ mobileColumnPaddingBottom }
							right={ mobileColumnPaddingRight }
							left={ mobileColumnPaddingLeft }
							unit={ mobileColumnPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									mobileColumnPaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									mobileColumnPaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									mobileColumnPaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									mobileColumnPaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ mobileColumnPaddingUnit => setAttributes( { mobileColumnPaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.columnGap && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Column Gap' ) }
							min={ 0 }
							max={ 200 }
							value={ columnGap }
							onChange={ columnGap => setAttributes( { columnGap } ) }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Column Gap' ) }
							min={ 0 }
							max={ 200 }
							value={ tabletColumnGap }
							onChange={ tabletColumnGap => setAttributes( { tabletColumnGap } ) }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Column Gap' ) }
							min={ 0 }
							max={ 200 }
							value={ mobileColumnGap }
							onChange={ mobileColumnGap => setAttributes( { mobileColumnGap } ) }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.height && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Column Height' ) }
							min={ 100 }
							max={ 1000 }
							value={ columnHeight }
							onChange={ columnHeight => setAttributes( { columnHeight } ) }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Column Height' ) }
							min={ 100 }
							max={ 1000 }
							value={ tabletColumnHeight }
							onChange={ tabletColumnHeight => setAttributes( { tabletColumnHeight } ) }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Column Height' ) }
							min={ 100 }
							max={ 1000 }
							value={ mobileColumnHeight }
							onChange={ mobileColumnHeight => setAttributes( { mobileColumnHeight } ) }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.verticalAlign && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Content Vertical Align' ) }
							options={ verticalAlignOptions }
							value={ columnVerticalAlign }
							onChange={ columnVerticalAlign => setAttributes( { columnVerticalAlign } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Content Vertical Align' ) }
							options={ verticalAlignOptions }
							value={ tabletColumnVerticalAlign }
							onChange={ tabletColumnVerticalAlign => setAttributes( { tabletColumnVerticalAlign } ) }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Content Vertical Align' ) }
							options={ verticalAlignOptions }
							value={ mobileColumnVerticalAlign }
							onChange={ mobileColumnVerticalAlign => setAttributes( { mobileColumnVerticalAlign } ) }
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ applyFilters( `stackable.${ blockName }.edit.advanced.column-spacing.after`, null, props ) }
			</PanelBody>
		</Fragment>
	)
}

const addToStyleObject = blockName => ( styleObject, props ) => {
	const {
		columnPaddingTop = '',
		columnPaddingBottom = '',
		columnPaddingRight = '',
		columnPaddingLeft = '',
		columnPaddingUnit = 'px',

		tabletColumnPaddingTop = '',
		tabletColumnPaddingBottom = '',
		tabletColumnPaddingRight = '',
		tabletColumnPaddingLeft = '',
		tabletColumnPaddingUnit = 'px',

		mobileColumnPaddingTop = '',
		mobileColumnPaddingBottom = '',
		mobileColumnPaddingRight = '',
		mobileColumnPaddingLeft = '',
		mobileColumnPaddingUnit = 'px',

		columnGap = '',
		tabletColumnGap = '',
		mobileColumnGap = '',

		columnHeight = '',
		tabletColumnHeight = '',
		mobileColumnHeight = '',

		columnVerticalAlign = '',
		tabletColumnVerticalAlign = '',
		mobileColumnVerticalAlign = '',
	} = props.attributes

	const styles = applyFilters( `stackable.${ blockName }.advanced-column-spacing.styles`, {
		'.ugb-inner-block': {
			columnGap: columnGap !== '' ? `${ columnGap }px` : undefined,
		},
		'.ugb-inner-block > *': {
			paddingTop: columnPaddingTop !== '' ? `${ columnPaddingTop }${ columnPaddingUnit } !important` : undefined,
			paddingRight: columnPaddingRight !== '' ? `${ columnPaddingRight }${ columnPaddingUnit } !important` : undefined,
			paddingBottom: columnPaddingBottom !== '' ? `${ columnPaddingBottom }${ columnPaddingUnit } !important` : undefined,
			paddingLeft: columnPaddingLeft !== '' ? `${ columnPaddingLeft }${ columnPaddingUnit } !important` : undefined,
			minHeight: columnHeight !== '' ? `${ columnHeight }px` : undefined,
			justifyContent: columnVerticalAlign !== '' ? columnVerticalAlign : undefined,
		},
		tablet: {
			'.ugb-inner-block': {
				columnGap: tabletColumnGap !== '' ? `${ tabletColumnGap }px` : undefined,
			},
			'.ugb-inner-block > *': {
				paddingTop: tabletColumnPaddingTop !== '' ? `${ tabletColumnPaddingTop }${ tabletColumnPaddingUnit } !important` : undefined,
				paddingRight: tabletColumnPaddingRight !== '' ? `${ tabletColumnPaddingRight }${ tabletColumnPaddingUnit } !important` : undefined,
				paddingBottom: tabletColumnPaddingBottom !== '' ? `${ tabletColumnPaddingBottom }${ tabletColumnPaddingUnit } !important` : undefined,
				paddingLeft: tabletColumnPaddingLeft !== '' ? `${ tabletColumnPaddingLeft }${ tabletColumnPaddingUnit } !important` : undefined,
				minHeight: tabletColumnHeight !== '' ? `${ tabletColumnHeight }px` : undefined,
				justifyContent: tabletColumnVerticalAlign !== '' ? tabletColumnVerticalAlign : undefined,
			},
		},
		mobile: {
			'.ugb-inner-block': {
				columnGap: mobileColumnGap !== '' ? `${ mobileColumnGap }px` : undefined,
			},
			'.ugb-inner-block > *': {
				paddingTop: mobileColumnPaddingTop !== '' ? `${ mobileColumnPaddingTop }${ mobileColumnPaddingUnit } !important` : undefined,
				paddingRight: mobileColumnPaddingRight !== '' ? `${ mobileColumnPaddingRight }${ mobileColumnPaddingUnit } !important` : undefined,
				paddingBottom: mobileColumnPaddingBottom !== '' ? `${ mobileColumnPaddingBottom }${ mobileColumnPaddingUnit } !important` : undefined,
				paddingLeft: mobileColumnPaddingLeft !== '' ? `${ mobileColumnPaddingLeft }${ mobileColumnPaddingUnit } !important` : undefined,
				minHeight: mobileColumnHeight !== '' ? `${ mobileColumnHeight }px` : undefined,
				justifyContent: mobileColumnVerticalAlign !== '' ? mobileColumnVerticalAlign : undefined,
			},
		},
	} )

	return deepmerge( styleObject, styles )
}

const addAttributes = attributes => {
	return {
		...attributes,

		...createAllCombinationAttributes(
			'%sColumnPadding%s',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Top', 'Right', 'Bottom', 'Left' ]
		),

		...createAllCombinationAttributes(
			'%sColumnPaddingUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ],
		),

		...createAllCombinationAttributes(
			'%sColumnGap',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sColumnHeight',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sColumn%sAlign',
			{
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Vertical', 'Horizontal' ]
		),
	}
}

const advancedColumnSpacing = ( blockName, options = {} ) => {
	const optionsToPass = {
		paddings: true,
		columnGap: true,
		height: true,
		verticalAlign: true,
		modifyStyles: true,
		enablePaddingTop: true,
		enablePaddingRight: true,
		enablePaddingBottom: true,
		enablePaddingLeft: true,
		...options,
	}

	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-column-spacing`, inspectorControls( blockName, optionsToPass ), 6 )
	if ( optionsToPass.modifyStyles ) {
		addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/advanced-column-spacing`, addToStyleObject( blockName, optionsToPass ) )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-column-spacing`, addAttributes )
	doAction( `stackable.module.advanced-column-spacing`, blockName )
}

export default advancedColumnSpacing
