/**
 * Internal dependencies
 */
import { ImageBoxStyles } from './style'
import variations from './variations'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { last } from 'lodash'
import { version as VERSION } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	useBlockContext, useBlockHoverClass,
} from '~stackable/hooks'
import {
	BlockDiv,
	getAlignmentClasses,
	Alignment,
	useAlignment,
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
	ContentAlign,
	useContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import {
	Fragment, useMemo,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

const TEMPLATE = variations[ 0 ].innerBlocks

const ALLOWED_BLOCKS = [
	'stackable/subtitle',
	'stackable/heading',
	'stackable/text',
	'stackable/icon',
]

const Edit = props => {
	const { hasInnerBlocks, innerBlocks } = useBlockContext()

	const {
		className,
	} = props

	const { blockOrientation } = useAlignment()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const rowClass = getRowClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-image-box',
		'stk-block-image-box__inner-container',
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		rowClass,
		'stk-hover-parent',
	], useContentAlignmentClasses( props.attributes ) )

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender
	}, [ hasInnerBlocks, innerBlocks ] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
			<ContentAlign.InspectorControls />

			<ImageBoxStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-image-box" />

			<BlockDiv className={ blockClassNames } enableVariationPicker={ true }>
				<div className={ contentClassNames }>
					<InnerBlocks
						templateLock="insert"
						template={ TEMPLATE }
						orientation={ blockOrientation }
						renderAppender={ renderAppender }
					/>
				</div>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</Fragment>
	)
}

addFilter( 'stackable.block.column.allowed-inner-blocks', 'stackable/image-box', ( allowedBlocks, select ) => {
	const { getBlock, getBlockParents } = select( 'core/block-editor' )
	const { clientId } = useBlockEditContext()
	const parentClientId = last( getBlockParents( clientId ) )
	const hasParent = parentClientId && parentClientId !== clientId

	if ( ! hasParent ) {
		return allowedBlocks
	}

	const parentBlock = hasParent ? getBlock( parentClientId ) : null
	const innerBlocks = getBlock( clientId ).innerBlocks

	if ( parentBlock.name !== 'stackable/image-box' ) {
		return allowedBlocks
	}

	const currentInnerBlocks = innerBlocks?.map( ( { name } ) => name ) || []
	const allowedInnerBlocks = ALLOWED_BLOCKS.filter( allowedBlock => ! currentInnerBlocks.includes( allowedBlock ) )

	return ! allowedInnerBlocks.length ? [] : allowedInnerBlocks
} )

export default Edit

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/image-box', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/image-box' ? false : enabled
} )
