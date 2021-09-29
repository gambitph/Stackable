/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
import SVGDefaultQuote from './images/round-thin.svg'
import { QUOTE_ICONS } from './quotes'
import variations from './variations'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	AdvancedToolbarControl,
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
import { renderToString } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

export const defaultIcon = renderToString( <SVGDefaultQuote /> )

const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		className,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const { hasInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-blockquote',
		'stk-block-blockquote__inner-container',
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-blockquote__content',
	], useContentAlignmentClasses( props.attributes ) )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls hasBlockAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-blockquote" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ContentAlign.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<BlockDiv className={ blockClassNames } enableVariationPicker={ true }>
				<ContainerStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-blockquote" />

				<ContainerDiv className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
					/>
				</ContainerDiv>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default Edit

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/blockquote', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/blockquote' ? false : enabled
} )

// Add more quotation mark icons in the Icon Block if it's inside the blockquote block.
addFilter( 'stackable.block-component.icon.after', 'stackable/blockquote', output => {
	const { parentBlock } = useBlockContext()
	if ( parentBlock?.name === 'stackable/blockquote' ) {
		return (
			<>
				<AdvancedToolbarControl
					label={ __( 'Quotation Mark Icons', i18n ) }
					multiline={ true }
					controls={ Object.values( QUOTE_ICONS ) }
					attribute="icon"
					default={ QUOTE_ICONS[ 'round-thin' ].value }
				/>
			</>
		)
	}
	return output
} )

// Change the icon picker label for the Icon Block if it's inside the blockquote block.
addFilter( 'stackable.block-component.icon.label', 'stackable/blockquote', label => {
	const { parentBlock } = useBlockContext()
	if ( parentBlock?.name === 'stackable/blockquote' ) {
		return __( 'Pick another icon', i18n )
	}
	return label
} )
