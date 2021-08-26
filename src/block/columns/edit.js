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
	ColumnInnerBlocks,
	GroupPlaceholder,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { useBlockContext, useBlockHoverClass } from '~stackable/hooks'
import { __ } from '@wordpress/i18n'
import { ColumnsControl } from './column-settings-button'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
	const blockHoverClass = useBlockHoverClass()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-columns',
		rowClass,
		blockHoverClass,
		columnTooltipClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], {
		'stk--fit-content': props.attributes.columnFit,
	} )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
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
					<AdvancedToggleControl
						label={ __( 'Fit all columns to content', i18n ) }
						attribute="columnFit"
					/>
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

			<BlockDiv className={ blockClassNames }>
				<BlockStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<>
					<div className={ contentClassNames }>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							template={ TEMPLATE }
							templateLock={ props.attributes.templateLock || false }
						/>
					</div>
				</>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default Edit
