/**
 * External dependencies
 */
import classnames from 'classnames'
import { InspectorTabs, ColumnInnerBlocks } from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	CustomAttributes,
} from '~stackable/block-components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		columnTooltipClass,
		'stk-block-tab-content',
	] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />
					<BlockDiv.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-tab-content" />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className="stk-block-tab-content__wrapper">
					<ColumnInnerBlocks
						providerValue={ columnProviderValue }
						orientation="horizontal"
						renderAppender={ false }
						template={ TEMPLATE }
						allowedBlocks={ ALLOWED_INNER_BLOCKS }
						templateLock={ props.attributes.templateLock || false }
					/>
				</div>
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
