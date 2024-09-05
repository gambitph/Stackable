/**
 * Internal dependencies
 */
import blockStyles from './style'

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
	useBlockCssGenerator,
} from '~stackable/components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import {
	Column,
	getColumnClasses,
	BlockDiv,
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
import { useSelect } from '@wordpress/data'
import { memo } from '@wordpress/element'

const ButtonBlockAppender = memo( props => {
	return <InnerBlocks.ButtonBlockAppender { ...props } />
} )

const Edit = props => {
	const {
		clientId,
		className,
		isHovered,
	} = props

	const {
		hasInnerBlocks, isOnlyBlock, useZeroColumnSpacing, parentBlock,
	} = useSelect(
		select => {
			const {
				getBlockOrder, getBlockRootClientId, getBlock,
			} =
				select( 'core/block-editor' )

			const rootClientId = getBlockRootClientId( clientId )
			const parentBlock = getBlock( rootClientId )

			return {
				hasInnerBlocks: getBlockOrder( clientId ).length > 0,
				rootClientId,
				isOnlyBlock: getBlockOrder( rootClientId ).length === 1,
				parentBlock,
				useZeroColumnSpacing: ! [ 'stackable/timeline' ].includes( parentBlock.name ),
			}
		},
		[ clientId ]
	)

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

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls
				isOnlyBlock={ isOnlyBlock }
				useZeroColumnSpacing={ useZeroColumnSpacing }
				alignLastBlockToBottom={ props.attributes.alignLastBlockToBottom }
				setAttributes={ props.setAttributes }
			/>
			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-column" />

			<Column
				clientId={ clientId }
				parentBlock={ parentBlock }
				isHovered={ isHovered }
				showHandle={ isHovered }
				context={ props.context }
				columnWidth={ props.attributes.columnWidth }
				columnWidthTablet={ props.attributes.columnWidthTablet }
				columnWidthMobile={ props.attributes.columnWidthMobile }
			>
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
							renderAppender={ hasInnerBlocks ? false : ButtonBlockAppender }
						/>
					</ContainerDiv>
				</BlockDiv>
			</Column>
		</>
	)
}

// Inspector controls for the block, it's important that we only pass only the
// props used by controls to prevent rerenders of all the inspector controls.
const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<InspectorLayoutControls>
				<FourRangeControl
					label={ __( 'Column Spacing', i18n ) }
					attribute="columnSpacing"
					responsive="all"
					units={ [ 'px', 'em', 'vw' ] }
					defaultLocked={ true }
					min={ [ 0, 0 ] }
					sliderMax={ [ 200, 30 ] }
					placeholder={ props.isOnlyBlock && props.useZeroColumnSpacing ? '0' : '12' }
					helpTooltip={ {
						video: 'inner-block-padding',
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
					checked={ props.alignLastBlockToBottom }
					onChange={ alignLastBlockToBottom => props.setAttributes( { alignLastBlockToBottom } ) }
				/>
			</InspectorLayoutControls>

			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
