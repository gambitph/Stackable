/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
} from '~stackable/block-components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

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
		customAttributes: [ [ 'aria-hidden', 'false' ], [ 'role', 'button' ] ],
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
		customAttributes: [ [ 'aria-hidden', 'true' ], [ 'role', 'button' ] ],
	} ],
]

const TABS = [ 'block', 'advanced' ]

const Edit = props => {
	const {
		className,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-expand',
		blockHoverClass,
		'stk--revert',
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	return (
		<>

			<InspectorTabs tabs={ TABS } />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-expand" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-expand" />

			<style>{ `.stk-block.stk-block-expand .stk-block-expand__short-text::before { content: "${ __( 'Less text', i18n ) }" !important; }` }</style>
			<style>{ `.stk-block.stk-block-expand .stk-block-expand__more-text::before { content: "${ __( 'More text', i18n ) }" !important; }` }</style>
			<BlockDiv className={ blockClassNames }>
				<div className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
						orientation="horizontal"
					/>
				</div>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit

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

