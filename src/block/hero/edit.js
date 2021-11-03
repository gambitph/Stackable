/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
import { blockStyles } from './block-styles'

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
	useContentAlignmentClasses,
	BlockStyle,
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'
import { __, _x } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ) } ],
	[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
	] ],
]

const Edit = props => {
	const {
		className,
	} = props

	useGeneratedCss( props.attributes )

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
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-hero__content',
	], useContentAlignmentClasses( props.attributes ) )

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender
	}, [ hasInnerBlocks, innerBlocks ] )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls hasBlockAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-hero" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyle.InspectorControls styles={ blockStyles } />
			<ContentAlign.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

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
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default withQueryLoopContext( Edit )
