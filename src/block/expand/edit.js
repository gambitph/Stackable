/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorBlockControls, InspectorBottomTip, InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { memo } from '@wordpress/element'

const TEMPLATE = [
	[ 'stackable/text', {
		text: __( 'Some short text that can be expanded to show more details.', i18n ),
		className: 'stk-block-expand__short-text',
		customAttributes: [ [ 'aria-hidden', 'false' ] ],
	} ],
	[ 'stackable/button', {
		text: __( 'Show more', i18n ),
		linkUrl: '#',
		className: 'is-style-link stk-block-expand__show-button',
		customAttributes: [ [ 'aria-hidden', 'false' ], [ 'role', 'button' ], [ 'aria-expanded', 'false' ] ],
	} ],
	[ 'stackable/text', {
		text: __( 'Some long text that will be expanded when the show more button is clicked by the visitor.', i18n ),
		className: 'stk-block-expand__more-text',
		customAttributes: [ [ 'aria-hidden', 'true' ] ],
	} ],
	[ 'stackable/button', {
		text: __( 'Show less', i18n ),
		linkUrl: '#',
		className: 'is-style-link stk-block-expand__hide-button',
		customAttributes: [ [ 'aria-hidden', 'true' ], [ 'role', 'button' ], [ 'aria-expanded', 'true' ] ],
	} ],
]

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-expand',
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	return (
		<>
			<InspectorControls />

			<BlockStyles
				version={ VERSION }
				clientId={ clientId }
				blockState={ props.blockState }
			/>
			<CustomCSS mainBlockClass="stk-block-expand" />

			<style>{ `.stk-block.stk-block-expand .stk-block-expand__short-text::before { content: "${ __( 'Less text', i18n ) }" !important; }` }</style>
			<style>{ `.stk-block.stk-block-expand .stk-block-expand__more-text::before { content: "${ __( 'More text', i18n ) }" !important; }` }</style>
			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
						orientation="horizontal"
					/>
				</div>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-expand" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorBlockControls>
				<InspectorBottomTip />
			</InspectorBlockControls>
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/expand', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/expand' ? false : enabled
} )

// Disable link for button blocks.
addFilter( 'stackable.edit.button.enable-link', 'stackable/expand', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/expand' ? false : enabled
} )

// Disable link popup for button blocks.
addFilter( 'stackable.edit.link.enable-link-popup', 'stackable/expand', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/expand' ? false : enabled
} )

// Prevent the expand block link from being being styled with a saved default style.
addFilter( 'stackable.block-default-styles.use-saved-style', 'stackable/expand', ( enabled, block, parentBlockNames ) => {
	if ( block.name === 'stackable/button' && parentBlockNames.length >= 1 && parentBlockNames[ parentBlockNames.length - 1 ] === 'stackable/expand' ) {
		return false
	}
	return enabled
} )
