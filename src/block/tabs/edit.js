/**
 * External dependencies
 */
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	Transform,
	ContentAlign,
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
import { ButtonBlockAppender, InnerBlocks } from '@wordpress/block-editor'

const Edit = props => {
	const {
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-tabs',
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
					<ContentAlign.InspectorControls hasColumnCount={ true } />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className="stk-block-tabs__group">
					<div className="stk-block-tabs__tab">
						<div className="stk-block-tabs__tab-wrapper">
							Tab 1
						</div>
					</div>
					<div className="stk-block-tabs__tab stk-block-tabs__tab-appender">
						<ButtonBlockAppender rootClientId={ props.clientId } />
					</div>
				</div>
				<div className="stk-block-tabs__content">
					<div className="stk-block-tabs__content-wrapper">
						<InnerBlocks
							allowedBlocks={ true }
							templateLock={ false }
							orientation="horizontal"
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>
				</div>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
