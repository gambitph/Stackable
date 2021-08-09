/**
 * Internal dependencies
 */
import { PriceStyles } from './style'

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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

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
		className, attributes,
	} = props

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
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-price" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<PriceStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-price" />

			<BlockDiv className={ blockClassNames }>
				<>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
					/>
				</>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}
export default Edit

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/price', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/price' ? false : enabled
} )

// Disable columns for child text blocks.
addFilter( 'stackable.edit.text.enable-column', 'stackable/price', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/price' ? false : enabled
} )
