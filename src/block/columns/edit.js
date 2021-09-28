/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	AdvancedRangeControl,
	AdvancedToggleControl,
	AdvancedToolbarControl,
	ColumnInnerBlocks,
	GroupPlaceholder,
	InspectorStyleControls,
	InspectorTabs, PanelAdvancedSettings,
} from '~stackable/components'
import {
	BlockDiv,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	getSeparatorClasses,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { useBlockContext, useBlockHoverClass } from '~stackable/hooks'
import { __ } from '@wordpress/i18n'
import { select, dispatch } from '@wordpress/data'
import { ColumnsControl } from './column-settings-button'
import { getAttributeName } from '~stackable/util'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		clientId,
		className,
		setAttributes,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
	const blockHoverClass = useBlockHoverClass()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-columns',
		rowClass,
		blockHoverClass,
		separatorClass,
		columnTooltipClass,
		'stk-block-columns__inner-container', // `*inner-container` class is required for inner block widths to work properly.
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		`stk-${ props.attributes.uniqueId }-column`,
	], {
		'stk--fit-content': props.attributes.columnFit,
		alignwide: props.attributes.contentAlign === 'alignwide', // This will align the columns inside.
		alignfull: props.attributes.contentAlign === 'alignfull', // This will align the columns inside.
		'wp-block': !! props.attributes.contentAlign, // Only in the backend.
	} )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<ColumnsControl />
					<AdvancedToolbarControl
						label={ __( 'Content Alignment', i18n ) }
						attribute="contentAlign"
						controls={ [
							{
								value: '',
								title: __( 'Align Center', i18n ),
								icon: 'align-center',
							},
							{
								value: 'alignwide',
								title: __( 'Align Wide', i18n ),
								icon: 'align-wide',
							},
							{
								value: 'alignfull',
								title: __( 'Align Full', i18n ),
								icon: 'align-full-width',
							},
						] }
					/>
					<AdvancedToggleControl
						label={ __( 'Fit all columns to content', i18n ) }
						checked={ props.attributes.columnFit }
						onChange={ value => {
							setAttributes( { columnFit: value ? true : '' } )

							// When columnFit is changed, remove all column widths.
							if ( value ) {
								const { getBlock } = select( 'core/block-editor' )
								const { updateBlockAttributes } = dispatch( 'core/block-editor' )

								getBlock( clientId ).innerBlocks.forEach( block => {
									if ( block.name === 'stackable/column' ) {
										updateBlockAttributes( block.clientId, {
											[ getAttributeName( 'columnWidth', 'desktop' ) ]: '',
											[ getAttributeName( 'columnWidth', 'tablet' ) ]: '',
											[ getAttributeName( 'columnWidth', 'mobile' ) ]: '',
										} )
									}
								} )
							}
						} }
					/>
					{ props.attributes.columnFit &&
						<AdvancedToolbarControl
							label={ __( 'Columns Alignment', i18n ) }
							attribute="columnFitAlign"
							responsive="all"
							controls="flex-horizontal"
						/>
					}
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						attribute="columnGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<BlockDiv
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<BlockStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div
						className={ contentClassNames }
						data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							: props.attributes.contentAlign === 'alignwide' ? 'wide'
								: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
					>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							template={ TEMPLATE }
							templateLock={ props.attributes.templateLock || false }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default Edit
