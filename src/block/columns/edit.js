/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions, getColumnCountFromDesign } from './util'
import ImageDesignGrid from './images/grid.png'
import ImageDesignPlain from './images/plain.png'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DesignPanelBody,
	ProControlButton,
	ContentAlignControl,
	ResponsiveControl,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	WhenResponsiveScreen,
	AdvancedRangeControl,
	ControlSeparator,
	BackgroundControlsHelper,
	ColorPaletteControl,
	PanelAdvancedSettings,
	DesignControl,
	ColumnsWidthControl,
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'
// import { cacheImageData } from '~stackable/util'
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { i18n, showProNotice } from 'stackable'
import { faTextHeight } from '@fortawesome/free-solid-svg-icons'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

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
			<PanelBody
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
					placeholder="2"
					className="ugb--help-tip-general-columns"
				/>
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
					options={ applyFilters( 'stackable.columns.edit.layouts', [
						{
							label: __( 'Grid', i18n ), value: 'grid', image: ImageDesignGrid,
						},
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => {
						const columnCount = getColumnCountFromDesign( columns, design )
						setAttributes( {
							design,
							...COLUMN_DEFAULTS[ columnCount ],
						} )
					} }
				/>
				{ showProNotice && <ProControlButton /> }
			</PanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.columns.edit.inspector.style.before', 'stackable/columns', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
		columns = 2,
		noPaddings = '',
		headingColor = '',
		bodyTextColor = '',
		linkColor = '',
		linkHoverColor = '',
		borderRadius = '',
		shadow = '',
		showTitle = true,
		showDescription = true,
		titleTag = '',
		titleColor = '',
		descriptionColor = '',
		showImage = true,
		showButton = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
		image4Id = '',
	} = props.attributes

	const show = showOptions( props )
	const columnCount = getColumnCountFromDesign( columns, design )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
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
					placeholder="2"
					className="ugb--help-tip-general-columns"
				/>

				{ applyFilters( 'stackable.columns.edit.inspector.style.general.columns.after', null, props ) }

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

				<ResponsiveControl
					attrNameTemplate="%sHorizontalGap"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Column Horizontal Gap', i18n ) }
						min={ 0 }
						max={ 500 }
						allowReset={ true }
						placeholder="35"
						className="ugb--help-tip-advanced-column-gap"
					/>
				</ResponsiveControl>
				{ show.verticalGap &&
					<ResponsiveControl
						attrNameTemplate="%sVerticalGap"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Column Vertical Gap', i18n ) }
							min={ 0 }
							max={ 500 }
							allowReset={ true }
							placeholder="35"
						/>
					</ResponsiveControl>
				}
				<ResponsiveControl
					attrNameTemplate="%sHeight"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedSelectControl
						label={ __( 'Height', i18n ) }
						options={ [
							{ label: __( 'Normal', i18n ), value: '' },
							{ label: __( 'Tall', i18n ), value: 'tall' },
							{ label: __( 'Half-screen height', i18n ), value: 'half' },
							{ label: __( 'Full-screen height', i18n ), value: 'full' },
						] }
					/>
				</ResponsiveControl>
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
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelBody
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
			</PanelBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
	} = props

	const {
		design = 'plain',
		columns = 2,
		reverseColumns = '',
		// shadow = '',
		// contentWidth = 100,
		// restrictContentWidth = false,
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-columns--design-${ design }`,
		`ugb-columns--columns-${ columns }`,
	], applyFilters( 'stackable.columns.mainclasses', {
		'ugb-columns--reverse': show.reverseColumns && reverseColumns,
		// 'ugb-container--width-small': contentWidth <= 50,
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

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
