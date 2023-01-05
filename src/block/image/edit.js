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
import { useBlockContext } from '~stackable/hooks'
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
	withBlockWrapperIsHovered,
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
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

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
			{ isSelected && (
				<>
					<InspectorTabs />

					<Alignment.InspectorControls />
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<Image.InspectorControls
						{ ...props }
						initialOpen={ true }
						heightUnits={ heightUnit }
					/>
					{ enableLink && <Link.InspectorControls hasTitle={ true } /> }
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-image" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<BlockStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-image" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Image
					showTooltips
					heightUnits={ heightUnit }
					defaultWidth="100"
					defaultHeight="auto"
				/>
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
