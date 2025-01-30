/**
 * Internal dependencies
 */
import blockStyles from './style'
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
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
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
	BlockLink,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
} from '~stackable/block-components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		className,
	} = props

	const { hasInnerBlocks, innerBlocks } = useSelect( select => {
		const { getBlock } = select( 'core/block-editor' )
		const innerBlocks = getBlock( props.clientId ).innerBlocks
		return {
			hasInnerBlocks: innerBlocks.length > 0,
			innerBlocks,
		}
	}, [ props.clientId ] )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-call-to-action',
		separatorClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-call-to-action__content',
		`stk-${ props.attributes.uniqueId }-inner-blocks`,
	], getContentAlignmentClasses( props.attributes ) )

	const lastBlockName = last( innerBlocks )?.name
	const renderAppender = hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( lastBlockName ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender

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
			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }
				<CustomCSS mainBlockClass="stk-block-call-to-action" />

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
			<BlockLink.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<Separator.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-call-to-action" />
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
