/**
 * External dependencies
 */
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	Transform,
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

const Edit = props => {
	const {
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
	] )

	return (
		<>
			{ isSelected && (
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
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className="stk-block-tab-labels__wrapper">
					<div className="stk-block-tabs__tab stk-tabs__tab-desktop" aria-selected="true">
						Tab 1
					</div>
					<div className="stk-block-tabs__tab stk-tabs__tab-desktop" >
						Tab 2
					</div>
					<div className="stk-block-tabs__tab stk-tabs__tab-desktop" >
						Tab 3
					</div>
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
