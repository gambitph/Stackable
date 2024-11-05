/**
 * Internal dependencies
 */
import blockStyles from './style'
import variations from './variations'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	ColumnInnerBlocks, ControlSeparator, InspectorBottomTip, InspectorLayoutControls, InspectorStyleControls, InspectorTabs,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	getRowClasses,
	MarginBottom,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	Columns,
} from '~stackable/block-components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

const ALLOWED_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		className,
	} = props

	const { hasInnerBlocks } = useSelect( select => {
		const { getBlockOrder } = select( 'core/block-editor' )
		return {
			hasInnerBlocks: getBlockOrder( props.clientId ).length > 0,
		}
	}, [ props.clientId ] )
	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-feature-grid',
		'stk-block-columns', // We need to add the columns class to make fit all and column gap to work properly.
		rowClass,
		separatorClass,
		columnTooltipClass,
	], {
		'stk--column-wrap-desktop': props.attributes.columnWrapDesktop,
	} )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( props.attributes ) )

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
			<InspectorControls />

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-feature-grid" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<Separator>
					<div className={ contentClassNames }>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							template={ TEMPLATE }
							// templateLock="insert"
							allowedBlocks={ ALLOWED_BLOCKS }
							orientation="horizontal"
							renderAppender={ false }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs />

			<Columns.InspectorControls />
			<InspectorLayoutControls>
				<ControlSeparator />
			</InspectorLayoutControls>
			<ContentAlign.InspectorControls />
			<Alignment.InspectorControls hasColumnJustify={ true } hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature-grid" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
