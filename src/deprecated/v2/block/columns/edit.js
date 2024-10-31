/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions, getColumnCountFromDesign } from './util'
import ImageDesignGrid from './images/grid.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignUneven from './images/uneven.png'
import ImageDesignUneven2 from './images/uneven-2.png'
import ImageDesignTiled from './images/tiled.png'

/**
 * External dependencies
 */
import {
	AdvancedToggleControl,
	BlockContainer,
	ProControlButton,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	WhenResponsiveScreen,
	AdvancedRangeControl,
	ControlSeparator,
	ColorPaletteControl,
	DesignControl,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	ColumnsWidthControl,
	ContentAlignControl,
	ResponsiveControl,
} from '../../components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '../../higher-order'
import classnames from 'classnames'
import { range } from 'lodash'
import { i18n, showProNotice } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { select, dispatch } from '@wordpress/data'
import { createBlock } from '@wordpress/blocks'

const COLUMN_DEFAULTS = {
	2: {
		columns1: 50,
		columns2: 50,
		columns3: '',
		columns4: '',
		columns5: '',
		columns6: '',
	},
	3: {
		columns1: 33,
		columns2: 33,
		columns3: 34,
		columns4: '',
		columns5: '',
		columns6: '',
	},
	4: {
		columns1: 25,
		columns2: 25,
		columns3: 25,
		columns4: 25,
		columns5: '',
		columns6: '',
	},
	5: {
		columns1: 20,
		columns2: 20,
		columns3: 20,
		columns4: 20,
		columns5: 20,
		columns6: '',
	},
	6: {
		columns1: 16,
		columns2: 17,
		columns3: 17,
		columns4: 17,
		columns5: 17,
		columns6: 16,
	},
}

addFilter( 'stackable.columns.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			label: __( 'Grid', i18n ), value: 'grid', image: ImageDesignGrid,
		},
		{
			label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
		},
		{
			label: __( 'Uneven', i18n ), value: 'uneven', image: ImageDesignUneven, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Uneven', i18n ), 2 ), value: 'uneven-2', image: ImageDesignUneven2, premium: true,
		},
		{
			label: __( 'Tiled', i18n ), value: 'tiled', image: ImageDesignTiled, premium: true,
		},
	]

	return [
		...layouts,
		...newLayouts,
	]
} )

addFilter( 'stackable.columns.edit.inspector.layout.attributes', 'stackable/columns', attributes => {
	const {
		design,
		columns = 2,
	} = attributes
	const columnCount = getColumnCountFromDesign( columns, design )
	return {
		design,
		columns,
		...COLUMN_DEFAULTS[ columnCount ],
	}
} )

addFilter( 'stackable.columns.edit.inspector.layout.before', 'stackable/columns', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
		columns = 2,
	} = props.attributes

	const columnCount = getColumnCountFromDesign( columns, design )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				initialOpen={ true }
				title={ __( 'Layout', i18n ) }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => {
						const columnCount = getColumnCountFromDesign( columns, design )
						setAttributes( {
							columns,
							...COLUMN_DEFAULTS[ columnCount ],
							...range( 6 ).reduce( ( cols, i ) => {
								return { ...cols, [ `tabletCoumns${ i + 1 }` ]: '' }
							}, {} ),
						} )
					} }
					min={ 2 }
					max={ design !== 'grid' ? 6 : 8 }
					default={ 2 }
					className="ugb--help-tip-general-columns"
				/>

				{ applyFilters( 'stackable.columns.edit.inspector.columns.after', null, props ) }

				<WhenResponsiveScreen screens={ [ 'desktop', 'tablet' ] }>
					<ColumnsWidthControl
						columns={ columnCount }
						design={ design }
						values={ range( columnCount ).map( i => {
							return props.attributes[ `columns${ i + 1 }` ]
						} ) }
						onChange={ columnWidths => {
							const atts = columnWidths.reduce( ( atts, width, i ) => {
								atts[ `columns${ i + 1 }` ] = width
								return atts
							}, {} )
							setAttributes( atts )
						} }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet" screens={ [ 'desktop', 'tablet' ] }>
					<ColumnsWidthControl
						columns={ columnCount }
						design={ design }
						values={ range( columnCount ).map( i => {
							return props.attributes[ `tabletColumns${ i + 1 }` ]
						} ) }
						onChange={ columnWidths => {
							const atts = columnWidths.reduce( ( atts, width, i ) => {
								atts[ `tabletColumns${ i + 1 }` ] = width
								return atts
							}, {} )
							setAttributes( atts )
						} }
						forceBlank={ true }
					/>
				</WhenResponsiveScreen>

				<ControlSeparator />

				<DesignControl
					selected={ design }
					label={ __( 'Layouts', i18n ) }
					options={ applyFilters( 'stackable.columns.edit.layouts', [] ) }
					onChange={ design => {
						setAttributes( applyFilters( 'stackable.columns.edit.inspector.layout.attributes', { design, columns } ) )
					} }
				/>
				{ showProNotice && <ProControlButton
					// Generic label, no translations to keep old text out of the translation files.
					title="Upgrade to Premium"
					description="Get more layouts, effects, designs and options for this block if you upgrade to Stackable Premium."
				/> }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

addFilter( 'stackable.columns.edit.inspector.style.before', 'stackable/columns', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
		columns = 2,
		headingColor = '',
		bodyTextColor = '',
		linkColor = '',
		linkHoverColor = '',
		noPaddings = false,

		height = '',
		tabletHeight = '',
		mobileHeight = '',

		heightNum = '',
		heightNumUnit = 'px',
		tabletHeightNum = '',
		tabletHeightNumUnit = 'px',
		mobileHeightNum = '',
		mobileHeightNumUnit = 'px',
	} = props.attributes

	const show = showOptions( props )
	const columnCount = getColumnCountFromDesign( columns, design )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => {
						const columnCount = getColumnCountFromDesign( columns, design )
						setAttributes( {
							columns,
							...COLUMN_DEFAULTS[ columnCount ],
						} )
					} }
					min={ 2 }
					max={ design !== 'grid' ? 6 : 8 }
					default={ 2 }
					className="ugb--help-tip-general-columns"
				/>

				{ applyFilters( 'stackable.columns.edit.inspector.columns.after', null, props ) }

				<WhenResponsiveScreen screens={ [ 'desktop', 'tablet' ] }>
					<ColumnsWidthControl
						columns={ columnCount }
						design={ design }
						values={ range( columnCount ).map( i => {
							return props.attributes[ `columns${ i + 1 }` ]
						} ) }
						onChange={ columnWidths => {
							const atts = columnWidths.reduce( ( atts, width, i ) => {
								atts[ `columns${ i + 1 }` ] = width
								return atts
							}, {} )
							setAttributes( atts )
						} }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet" screens={ [ 'desktop', 'tablet' ] }>
					<ColumnsWidthControl
						columns={ columnCount }
						design={ design }
						values={ range( columnCount ).map( i => {
							return props.attributes[ `tabletColumns${ i + 1 }` ]
						} ) }
						onChange={ columnWidths => {
							const atts = columnWidths.reduce( ( atts, width, i ) => {
								atts[ `tabletColumns${ i + 1 }` ] = width
								return atts
							}, {} )
							setAttributes( atts )
						} }
						forceBlank={ true }
					/>
				</WhenResponsiveScreen>

				<ControlSeparator />

				{ show.noPaddings &&
					<AdvancedToggleControl
						label={ __( 'No Paddings', i18n ) }
						checked={ noPaddings }
						onChange={ noPaddings => setAttributes( { noPaddings } ) }
						className="ugb--help-tip-no-padding"
					/>
				}

				{ applyFilters( 'stackable.columns.edit.inspector.style.column-widths.after', null, props ) }

				<ResponsiveControl
					attrNameTemplate="%sHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedSelectControl
						label={ __( 'Height', i18n ) }
						options={ [
							{ label: __( 'Normal', i18n ), value: '' },
							{ label: __( 'Half-screen height', i18n ), value: 'half' },
							{ label: __( 'Full-screen height', i18n ), value: 'full' },
							{ label: __( 'Custom height', i18n ), value: 'custom' },
						] }
					/>
				</ResponsiveControl>

				{ height === 'custom' &&
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Custom Height', i18n ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 0, 0 ] }
							max={ [ 1500, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							placeholder="50"
							value={ heightNum }
							unit={ heightNumUnit }
							onChange={ heightNum => setAttributes( { heightNum } ) }
							onChangeUnit={ heightNumUnit => setAttributes( { heightNumUnit } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ tabletHeight === 'custom' &&
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Custom Height', i18n ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 0, 0 ] }
							max={ [ 1500, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							placeholder="50"
							value={ tabletHeightNum }
							unit={ tabletHeightNumUnit }
							onChange={ tabletHeightNum => setAttributes( { tabletHeightNum } ) }
							onChangeUnit={ tabletHeightNumUnit => setAttributes( { tabletHeightNumUnit } ) }
						/>
					</WhenResponsiveScreen>
				}
				{ mobileHeight === 'custom' &&
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Custom Height', i18n ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 0, 0 ] }
							max={ [ 1500, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							placeholder="50"
							value={ mobileHeightNum }
							unit={ mobileHeightNumUnit }
							onChange={ mobileHeightNum => setAttributes( { mobileHeightNum } ) }
							onChangeUnit={ mobileHeightNumUnit => setAttributes( { mobileHeightNumUnit } ) }
						/>
					</WhenResponsiveScreen>
				}

				<ResponsiveControl
					attrNameTemplate="%sColumnVerticalAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedToolbarControl
						label={ __( 'Column Vertical Align', i18n ) }
						controls="__flex-vertical-with-stretch"
					/>
				</ResponsiveControl>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				{ showProNotice && <ProControlButton
					// Generic label, no translations to keep old text out of the translation files.
					title="Upgrade to Premium"
					description="Get more layouts, effects, designs and options for this block if you upgrade to Stackable Premium."
				/> }
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Text Colors', i18n ) }
				initialOpen={ false }
			>
				<ColorPaletteControl
					value={ headingColor }
					onChange={ headingColor => setAttributes( { headingColor } ) }
					label={ __( 'Heading Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ bodyTextColor }
					onChange={ bodyTextColor => setAttributes( { bodyTextColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ linkColor }
					onChange={ linkColor => setAttributes( { linkColor } ) }
					label={ __( 'Link Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ linkHoverColor }
					onChange={ linkHoverColor => setAttributes( { linkHoverColor } ) }
					label={ __( 'Link Hover Color', i18n ) }
				/>
				<p className="components-base-control__help">{ __( 'The colors above might not apply to some nested blocks.', i18n ) }</p>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

addFilter( 'stackable.columns.edit.advanced.responsive.after', 'stackable/columns', output => {
	return (
		<Fragment>
			{ output }
			{ showProNotice && <ProControlButton
				// Generic label, no translations to keep old text out of the translation files.
				title="Upgrade to Premium"
				description="Get more layouts, effects, designs and options for this block if you upgrade to Stackable Premium."
			/> }
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		sortColumnHighlight,
	} = props

	const {
		design = 'plain',
		columns = 2,
		reverseColumns = '',
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-columns--design-${ design }`,
		`ugb-columns--columns-${ columns }`,
	], applyFilters( 'stackable.columns.mainclasses', {
		'ugb-columns--reverse': show.reverseColumns && reverseColumns,
		[ `ugb-columns--highlight-${ sortColumnHighlight + 1 }` ]: sortColumnHighlight !== null,
	}, props ) )

	const wrapperClasses = classnames( [
		'ugb-columns__item',
		`${ uniqueClass }-content-wrapper`,
	] )

	const template = range( columns ).map( () => [ 'ugb/column' ] )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className={ wrapperClasses }>
					<InnerBlocks
						templateLock="all"
						template={ template }
						allowedBlocks={ [ 'ugb/column' ] }
					/>
				</div>
			</Fragment>
		) } />
	)
}

// Change the number of columns. This is needed since in WP 5.5, the template
// argument can't be dynamically changed anymore.
addFilter( 'stackable.columns.setAttributes', 'stackable/columns/columns-change', ( attributes, blockProps ) => {
	if ( typeof attributes.columns === 'undefined' && typeof attributes.design === 'undefined' ) {
		return attributes
	}

	let columns = blockProps.attributes.columns

	// Only do this when there's a change in column number.
	if ( typeof attributes.columns !== 'undefined' ) {
		if ( attributes.columns !== blockProps.attributes.columns ) {
			columns = attributes.columns
		}
	}

	// Only do this when there's a change in the design.
	if ( typeof attributes.design !== 'undefined' ) {
		if ( blockProps.attributes.design === 'grid' && attributes.design !== 'grid' && blockProps.attributes.columns > 6 ) {
			columns = 6
		}
	}

	// Form the new innerBlock list.
	const currentInnerBlocks = select( 'core/block-editor' ).getBlock( blockProps.clientId ).innerBlocks
	const newInnerBlocks = range( columns || 2 ).map( i => {
		return currentInnerBlocks[ i ] || createBlock( 'ugb/column', {}, [] )
	} )

	// Replace the current list of inner blocks.
	dispatch( 'core/block-editor' ).replaceInnerBlocks( blockProps.clientId, newInnerBlocks, false )

	return attributes
} )

// Higher-Order Component to add state to props since withState is deprecated
const withSortColumnHighlight = WrappedComponent => props => {
	const [ sortColumnHighlight, setSortColumnHighlight ] = useState( null )

	return (
		<WrappedComponent
			{ ...props }
			sortColumnHighlight={ sortColumnHighlight }
			setSortColumnHighlight={ setSortColumnHighlight }
		/>
	)
}

export default compose(
	withSortColumnHighlight,
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
