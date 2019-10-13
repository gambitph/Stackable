/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AdvancedToolbarControl,
	FourRangeControl,
	ResponsiveControl,
	WhenResponsiveScreen,
} from '~stackable/components'
import { appendImportant, createAllCombinationAttributes } from '~stackable/util'
import deepmerge from 'deepmerge'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'

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
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody
				title={ __( 'Column Spacing', i18n ) }
				initialOpen={ false }
			>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.column-spacing.before`, null, props ) }
				{ options.paddings && <Fragment>
					<WhenResponsiveScreen screen="desktop">
						<FourRangeControl
							label={ __( 'Block Paddings', i18n ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							min={ 0 }
							max={ 500 }
							top={ columnPaddingTop }
							bottom={ columnPaddingBottom }
							right={ columnPaddingRight }
							left={ columnPaddingLeft }
							unit={ columnPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									columnPaddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
									columnPaddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
									columnPaddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
									columnPaddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
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
						<FourRangeControl
							label={ __( 'Block Paddings', i18n ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							min={ 0 }
							max={ 500 }
							top={ tabletColumnPaddingTop }
							bottom={ tabletColumnPaddingBottom }
							right={ tabletColumnPaddingRight }
							left={ tabletColumnPaddingLeft }
							unit={ tabletColumnPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									tabletColumnPaddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
									tabletColumnPaddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
									tabletColumnPaddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
									tabletColumnPaddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
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
						<FourRangeControl
							label={ __( 'Block Paddings', i18n ) }
							units={ [ 'px', 'em', '%' ] }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							min={ 0 }
							max={ 500 }
							top={ mobileColumnPaddingTop }
							bottom={ mobileColumnPaddingBottom }
							right={ mobileColumnPaddingRight }
							left={ mobileColumnPaddingLeft }
							unit={ mobileColumnPaddingUnit }
							onChange={ paddings => {
								setAttributes( {
									mobileColumnPaddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
									mobileColumnPaddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
									mobileColumnPaddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
									mobileColumnPaddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
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

				{ options.columnGap &&
					<ResponsiveControl
						attrNameTemplate="%sColumnGap"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Column Gap', i18n ) }
							min={ 0 }
							max={ 200 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				}

				{ options.verticalColumnAlign &&
					<ResponsiveControl
						attrNameTemplate="%sColumnVerticalAlign"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedToolbarControl
							label={ __( 'Column Vertical Align', i18n ) }
							controls="flex-vertical-with-stretch"
						/>
					</ResponsiveControl>
				}

				{ options.height &&
					<ResponsiveControl
						attrNameTemplate="%sColumnHeight"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Min. Column Height', i18n ) }
							min={ 100 }
							max={ 1000 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				}

				{ options.verticalContentAlign &&
					<ResponsiveControl
						attrNameTemplate="%sColumnContentVerticalAlign"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedToolbarControl
							label={ __( 'Content Vertical Align', i18n ) }
							controls="flex-vertical"
						/>
					</ResponsiveControl>
				}

				{ applyFilters( `stackable.${ blockName }.edit.advanced.column-spacing.after`, null, props ) }
			</PanelBody>
		</Fragment>
	)
}

const addToStyleObject = blockName => ( styleObject, props ) => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const {
		columnPaddingUnit = 'px',
		tabletColumnPaddingUnit = 'px',
		mobileColumnPaddingUnit = 'px',
	} = props.attributes

	const styles = applyFilters( `stackable.${ blockName }.advanced-column-spacing.styles`, {
		'.ugb-block-content': {
			columnGap: appendImportant( getValue( 'columnGap', '%spx' ) ),
			alignItems: getValue( 'columnVerticalAlign' ),
		},
		'> .ugb-inner-block > .ugb-block-content > *': {
			minHeight: getValue( 'columnHeight', '%spx' ),
		},
		tablet: {
			'.ugb-block-content': {
				columnGap: appendImportant( getValue( 'tabletColumnGap', '%spx' ) ),
				alignItems: getValue( 'tabletColumnVerticalAlign' ),
			},
			'> .ugb-inner-block > .ugb-block-content > *': {
				minHeight: getValue( 'tabletColumnHeight', '%spx' ),
			},
		},
		mobile: {
			'.ugb-block-content': {
				columnGap: appendImportant( getValue( 'mobileColumnGap', '%spx' ) ),
				alignItems: getValue( 'mobileColumnVerticalAlign' ),
			},
			'> .ugb-inner-block > .ugb-block-content > *': {
				minHeight: getValue( 'mobileColumnHeight', '%spx' ),
			},
		},
	} )

	const verticalAlignSelector = applyFilters( `stackable.${ blockName }.advanced-column-spacing.vertical-align.selector`, '> .ugb-inner-block > .ugb-block-content > *', props )
	const verticalAlign = {
		[ verticalAlignSelector ]: {
			justifyContent: getValue( 'columnContentVerticalAlign' ),
		},
		tablet: {
			[ verticalAlignSelector ]: {
				justifyContent: getValue( 'tabletColumnContentVerticalAlign' ),
			},
		},
		mobile: {
			[ verticalAlignSelector ]: {
				justifyContent: getValue( 'mobileColumnContentVerticalAlign' ),
			},
		},
	}

	const paddingSelector = applyFilters( `stackable.${ blockName }.advanced-column-spacing.paddings.selector`, '> .ugb-inner-block > .ugb-block-content > *', props )
	const paddings = applyFilters( `stackable.${ blockName }.advanced-column-spacing.paddings`, {
		[ paddingSelector ]: {
			paddingTop: appendImportant( getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ) ),
			paddingRight: appendImportant( getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ) ),
			paddingBottom: appendImportant( getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ) ),
			paddingLeft: appendImportant( getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ) ),
		},
		tablet: {
			[ paddingSelector ]: {
				paddingTop: appendImportant( getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ) ),
				paddingRight: appendImportant( getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ) ),
				paddingBottom: appendImportant( getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ) ),
				paddingLeft: appendImportant( getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ) ),
			},
		},
		mobile: {
			[ paddingSelector ]: {
				paddingTop: appendImportant( getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ) ),
				paddingRight: appendImportant( getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ) ),
				paddingBottom: appendImportant( getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ) ),
				paddingLeft: appendImportant( getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ) ),
			},
		},
	} )

	return deepmerge.all( [ styleObject, styles, verticalAlign, paddings ] )
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
			'%sColumnContent%sAlign',
			{
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Vertical', 'Horizontal' ]
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
		verticalColumnAlign: false,
		height: true,
		verticalContentAlign: true,
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
