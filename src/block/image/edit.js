/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import { InspectorTabs } from '~stackable/components'
import { useBlockContext, useBlockHoverState } from '~stackable/hooks'
import {
	BlockDiv,
	useGeneratedCss,
	Image,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
	getAlignmentClasses,
	Link,
} from '~stackable/block-components'
import {
	withBlockAttributeContext,
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'

const heightUnit = [ 'px', 'vh', '%' ]

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const [ blockState ] = useBlockHoverState()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useBlockContext( clientId )

	// Allow special or layout blocks to disable the link for the image block,
	// e.g. image box doesn't need the image to have a link since it has it's
	// own link.
	const enableLink = applyFilters( 'stackable.edit.image.enable-link', true, parentBlock )

	const blockClassNames = classnames( [
		className,
		'stk-block-image',
		blockAlignmentClass,
	] )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<Image.InspectorControls
				initialOpen={ true }
				heightUnits={ heightUnit }
			/>
			{ enableLink && <Link.InspectorControls hasTitle={ true } /> }
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles
				version={ VERSION }
				blockState={ blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-image" />

			<BlockDiv className={ blockClassNames }>
				<Image
					heightUnits={ heightUnit }
					defaultWidth="100"
					defaultHeight="auto"
				/>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
