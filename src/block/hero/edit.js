/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import { last } from 'lodash'
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
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	useContentAlignmentClasses,
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/heading', { text: __( 'Hero Section' ) } ],
	[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', { text: 'Button' } ],
	] ],
]

const Edit = props => {
	const {
		className,
	} = props

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const separatorClass = getSeparatorClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-hero',
		blockHoverClass,
		separatorClass,
		'stk-content-align',
		'stk-block-hero__inner-container',
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-hero__content',
	], useContentAlignmentClasses( props.attributes ) )

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? InnerBlocks.DefaultBlockAppender : () => <></> ) : InnerBlocks.ButtonBlockAppender
	}, [ hasInnerBlocks, innerBlocks ] )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls hasBlockAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-hero" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ContentAlign.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<BlockDiv className={ blockClassNames }>
				<ContainerStyles version={ VERSION } />
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
			<MarginBottom />
		</>
	)
}

export default Edit
