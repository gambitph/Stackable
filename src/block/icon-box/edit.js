/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
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
	getAlignmentClasses,
	EffectsAnimations,
	CustomAttributes,
	CustomCSS,
	Responsive,
	Advanced,
	MarginBottom,
	BlockLink,
	Transform,
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

export const TEMPLATE = [
	[ 'stackable/icon-label', { blockMargin: { bottom: 0 } }, [
		[ 'stackable/icon', { contentAlign: 'left' } ],
		[ 'stackable/heading', {
			text: __( 'Icon Box', i18n ), hasP: true, textTag: 'h4',
		} ],
	] ],
	[ 'stackable/text', {
		text: 'Description for this block. Use this space for describing your block.',
	} ],
]

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-box',
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-icon-box__content',
	] )

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
			>
				<ContainerStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-icon-box" />

				<ContainerDiv className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ renderAppender }
					/>
				</ContainerDiv>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs hasLayoutPanel={ false } />

			<BlockDiv.InspectorControls />
			<BlockLink.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ContainerDiv.InspectorControls
				sizeSelector=".stk-block-content"
				hasContentVerticalAlign={ true }
			/>

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
