/**
 * Internal dependencies
 */
import variations from './variations'
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks, InspectorBottomTip, InspectorStyleControls, InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
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
} from '~stackable/block-components'
import { useBlockContext, useBlockHoverState } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const [ blockState ] = useBlockHoverState()
	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()
	const { hasInnerBlocks } = useBlockContext()

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

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<ContentAlign.InspectorControls />
			<ContainerDiv.InspectorControls />
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

			<BlockStyles
				version={ VERSION }
				blockState={ blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-feature" />

			<BlockDiv className={ blockClassNames } enableVariationPicker={ true }>
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
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
