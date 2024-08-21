/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
import variations from './variations'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import { last } from 'lodash'
import classnames from 'classnames'
import {
	InspectorBottomTip,
	InspectorStyleControls,
	InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	ContainerDiv,
	ConditionalDisplay,
	Alignment,
	getAlignmentClasses,
	EffectsAnimations,
	CustomAttributes,
	CustomCSS,
	Responsive,
	Advanced,
	MarginBottom,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
	} = props

	useGeneratedCss( props.attributes )

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-hero',
		separatorClass,
		'stk-content-align',
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-hero__content',
		`stk-${ attributes.uniqueId }-inner-blocks`,
	], getContentAlignmentClasses( props.attributes ) )

	const lastBlockName = last( innerBlocks )?.name
	const renderAppender = hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( lastBlockName ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender

	return (
		<>
			<InspectorControls />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<ContainerStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-hero" />

				<Separator>
					<ContainerDiv className={ contentClassNames }>
						<InnerBlocks
							template={ TEMPLATE }
							templateLock={ false }
							renderAppender={ renderAppender }
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

			<ContentAlign.InspectorControls />
			<Alignment.InspectorControls hasContainerSize={ true } hasBlockAlignment={ true } />
			<BlockDiv.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-hero" />
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
