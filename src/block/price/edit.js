/**
 * Internal dependencies
 */
import { PriceStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
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

export const defaultIcon = '<svg data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>'

const TEMPLATE = [
	[ 'stackable/text', {
		text: '$', htmlTag: 'span', innerTextTag: 'span',
	} ],
	[ 'stackable/text', {
		text: '99', htmlTag: 'span', innerTextTag: 'span', className: 'stk-block-price__price',
	} ],
	[ 'stackable/text', {
		text: '.00', htmlTag: 'span', innerTextTag: 'span',
	} ],
]

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-price',
		rowClass,
		blockAlignmentClass,
	] )

	return (
		<>
			<InspectorControls />

			<PriceStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-price" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="all"
				/>
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
			<CustomCSS.InspectorControls mainBlockClass="stk-block-price" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/price', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/price' ? false : enabled
} )

// Disable columns for child text blocks.
addFilter( 'stackable.text.edit.enable-column', 'stackable/price', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/price' ? false : enabled
} )

// Add custom text placeholders
addFilter( 'stackable.text.edit.placeholder', 'stackable/price', ( placeholder, {
	parentBlock, isFirstBlock, isLastBlock,
} ) => {
	if ( parentBlock?.name !== 'stackable/price' ) {
		return placeholder
	}

	if ( isFirstBlock ) {
		return '$'
	}

	if ( isLastBlock ) {
		return '.00'
	}

	return '100'
} )

