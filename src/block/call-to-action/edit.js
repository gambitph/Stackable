/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
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
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
	[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', { text: 'Button' } ],
	] ],
]

const Edit = props => {
	const {
		className,
	} = props

	const { hasInnerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-call-to-action',
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-call-to-action__content',
	] )

	const renderAppender = useCallback(
		() => hasInnerBlocks ? false : <InnerBlocks.DefaultBlockAppender />,
		[ hasInnerBlocks ]
	)

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls hasBlockAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-call-to-action" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<BlockDiv className={ blockClassNames }>
				<ContainerStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-call-to-action" />

				<ContainerDiv className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ renderAppender }
					/>
				</ContainerDiv>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
