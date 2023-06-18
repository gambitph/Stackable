/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	AdvancedToggleControl,
	FourRangeControl,
	InspectorLayoutControls,
	InspectorTabs,
} from '~stackable/components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import {
	Column,
	getColumnClasses,
	BlockDiv,
	useGeneratedCss,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	Linking,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	BlockLink,
	ContainerDiv,
	Transform,
	getBlockOrientation,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const Edit = props => {
	const {
		hasInnerBlocks, isOnlyBlock,
	} = useBlockContext()

	const {
		className,
		isHovered,
		clientId,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const blockOrientation = getBlockOrientation( props.attributes )
	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const ALLOWED_INNER_BLOCKS = applyFilters( 'stackable.block.column.allowed-inner-blocks', undefined, props )

	const blockClassNames = classnames( [
		className,
		'stk-block-column',
		columnClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		columnWrapperClass,
		blockAlignmentClass,
		'stk-block-column__content',
		`stk-${ props.attributes.uniqueId }-inner-blocks`,
		{ 'stk--align-last-block-to-bottom': props.attributes.alignLastBlockToBottom },
	] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<InspectorLayoutControls>
						<FourRangeControl
							label={ __( 'Column Spacing', i18n ) }
							attribute="columnSpacing"
							responsive="all"
							units={ [ 'px', 'em' ] }
							defaultLocked={ true }
							min={ [ 0, 0 ] }
							sliderMax={ [ 200, 30 ] }
							placeholder={ isOnlyBlock ? '0' : '12' }
							helpTooltip={ {
								description: __( 'Sets the paddings between the column content and the border.', i18n ),
							} }
							visualGuide={ {
								selector: '.stk-%s-container',
								highlight: 'column-spacing',
								defaultValue: '12px',
							} }
						/>
					</InspectorLayoutControls>

					<Alignment.InspectorControls hasContainerSize={ true } hasColumnAlignment={ true } />
					<BlockDiv.InspectorControls />
					<BlockLink.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-column" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />

					<InspectorLayoutControls>
						<AdvancedToggleControl
							label={ __( 'Align Last Block to Bottom', i18n ) }
							checked={ props.attributes.alignLastBlockToBottom }
							onChange={ alignLastBlockToBottom => props.setAttributes( { alignLastBlockToBottom } ) }
						/>
					</InspectorLayoutControls>

					<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />
				</>
			) }

			<BlockStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-column" />

			<Column isHovered={ isHovered } showHandle={ isHovered } context={ props.context }>
				<Linking show={ isHovered } />
				<BlockDiv
					blockHoverClass={ props.blockHoverClass }
					clientId={ props.clientId }
					attributes={ props.attributes }
					className={ blockClassNames }
					data-v={ props.attributes.version || 4 }
				>
					<ContainerDiv className={ contentClassNames }>
						<InnerBlocks
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							templateLock={ props.attributes.templateLock || false }
							orientation={ blockOrientation }
							renderAppender={ ! hasInnerBlocks ? InnerBlocks.ButtonBlockAppender : InnerBlocks.DefaultBlockAppender }
						/>
					</ContainerDiv>
				</BlockDiv>
			</Column>
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
