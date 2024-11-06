/**
 * Internal dependencies
 */
import blockStyles from './style'
import variations from './variations'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { last } from 'lodash'
import { version as VERSION } from 'stackable'
import {
	InspectorBlockControls,
	InspectorBottomTip,
	InspectorTabs,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import {
	BlockDiv,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	BlockLink,
	ConditionalDisplay,
	getRowClasses,
	MarginBottom,
	Transform,
	getBlockOrientation,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { Fragment, memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

export const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const { hasInnerBlocks, innerBlocks } = useSelect( select => {
		const { getBlock } = select( 'core/block-editor' )
		const innerBlocks = getBlock( props.clientId ).innerBlocks
		return {
			hasInnerBlocks: innerBlocks.length > 0,
			innerBlocks,
		}
	}, [ props.clientId ] )

	const {
		className,
	} = props

	const blockOrientation = getBlockOrientation( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const rowClass = getRowClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-image-box',
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		rowClass,
		'stk-hover-parent',
		'stk-block-image-box__content',
	] )

	const lastBlockName = last( innerBlocks )?.name
	const renderAppender = hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( lastBlockName ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<Fragment>

			<InspectorControls />

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-image-box" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<div className={ contentClassNames }>
					<InnerBlocks
						templateLock="insert"
						template={ TEMPLATE }
						orientation={ blockOrientation }
						renderAppender={ renderAppender }
					/>
				</div>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</Fragment>
	)
}

const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<BlockLink.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image-box" />
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
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/image-box', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/image-box' ? false : enabled
} )

// Disable links for image block.
addFilter( 'stackable.edit.image.enable-link', 'stackable/image-box', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/image-box' ? false : enabled
} )

// Prevent the text from being being styled with a saved default style.
addFilter( 'stackable.block-default-styles.use-saved-style', 'stackable/image-box', ( enabled, block, parentBlockNames ) => {
	if ( [ 'stackable/heading', 'stackable/subtitle', 'stackable/text' ].includes( block.name ) && parentBlockNames.length >= 2 && parentBlockNames[ parentBlockNames.length - 2 ] === 'stackable/image-box' ) {
		return false
	}
	return enabled
} )
