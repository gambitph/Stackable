/**
 * Internal dependencies
 */
import BlockStyles from './style'
import variations from './variations'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
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

const ALLOWED_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const [ blockState ] = useBlockHoverState()
	const { hasInnerBlocks } = useBlockContext()
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
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature-grid" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
			<ContentAlign.InspectorControls hasColumnCount={ true } />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<BlockStyles
				version={ VERSION }
				blockState={ blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-feature-grid" />

			<BlockDiv className={ blockClassNames } enableVariationPicker={ true }>
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
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
