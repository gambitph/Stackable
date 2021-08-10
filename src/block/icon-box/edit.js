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
	[ 'stackable/icon-label', {}, [
		[ 'stackable/icon', { contentAlign: 'left' } ],
		[ 'stackable/heading', {
			text: __( 'Icon Box' ), hasP: true, textTag: 'h4',
		} ],
	] ],
	[ 'stackable/text', {
		text: 'Description for this block. Use this space for describing your block.',
	} ],
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
		'stk-block-icon-box',
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-icon-box__content',
	] )

	const renderAppender = useCallback(
		() => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender />,
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
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<BlockDiv className={ blockClassNames }>
				<ContainerStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-icon-box" />

				<ContainerDiv className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						templateInsertUpdatesSelection={ true }
						renderAppender={ renderAppender }
					/>
				</ContainerDiv>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
