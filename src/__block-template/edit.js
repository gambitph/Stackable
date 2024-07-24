/**
 * Internal dependencies
 */
import { BlockStyles } from './style'

/**
 * External dependencies
 */
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
	InspectorLayoutControls,
} from '~stackable/components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'

const Edit = props => {
	const {
		className,
		clientId,
	} = props

	useGeneratedCss( props.attributes )

	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-text',
	] )

	const textClassNames = classnames( [
		'stk-block-text__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<>
			<InspectorTabs />

			<Typography.InspectorControls
				{ ...props }
				hasTextTag={ false }
				isMultiline={ true }
				initialOpen={ true }
				hasTextShadow={ true }
			/>
			<Alignment.InspectorControls />
			<InspectorLayoutControls>
				{ /** Add Layout controls specific for this block here */ }
			</InspectorLayoutControls>

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />

			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-text" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-text" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Typography
					tagName={ props.attributes.innerTextTag || 'p' }
					className={ textClassNames }
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
