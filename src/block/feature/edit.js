/**
 * Internal dependencies
 */
import variations from './variations'
import blockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks, InspectorBottomTip, InspectorStyleControls, InspectorTabs,
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
	ContainerDiv,
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

const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()
	const { hasInnerBlocks } = useSelect( select => {
		const { getBlockOrder } = select( 'core/block-editor' )
		return {
			hasInnerBlocks: getBlockOrder( props.clientId ).length > 0,
		}
	}, [ props.clientId ] )

	const blockClassNames = classnames( [
		className,
		'stk-block-feature',
		rowClass,
		separatorClass,
		columnTooltipClass,
	] )

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
			<CustomCSS mainBlockClass="stk-block-feature" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<Separator>
					<ContainerDiv className={ contentClassNames }>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							template={ TEMPLATE }
							templateLock="insert"
							orientation={ props.attributes.alignVertical ? 'vertical' : 'horizontal' }
						/>
					</ContainerDiv>
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

			<Columns.InspectorControls hasColumnsControl={ false } />
			<ContentAlign.InspectorControls />
			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<ContainerDiv.InspectorControls hasContentVerticalAlign={ true } />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature" />
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
