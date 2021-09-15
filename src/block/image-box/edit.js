/**
 * Internal dependencies
 */
import { ImageBoxStyles } from './style'
import { blockStyles } from './block-styles'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { last } from 'lodash'
import { version as VERSION, i18n } from 'stackable'
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
	BlockStyle,
	MarginBottom,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import {
	Fragment, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

const TEMPLATE = [
	[ 'stackable/image', {} ],
	[ 'stackable/column', { templateLock: false }, [
		[ 'stackable/subtitle', { text: __( 'Subtitle', i18n ) } ],
		[ 'stackable/heading', { text: __( 'Title', i18n ) } ],
		[ 'stackable/text', { text: __( 'Description', i18n ) } ],
		[ 'stackable/icon', { icon: '<svg data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>' } ],
	] ],
]

const ALLOWED_BLOCKS = [
	'stackable/subtitle',
	'stackable/heading',
	'stackable/text',
	'stackable/icon',
]

const Edit = props => {
	const { hasInnerBlocks } = useBlockContext()

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
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		rowClass,
		'stk-hover-parent',
	] )

	const renderAppender = useCallback(
		() => hasInnerBlocks ? false : <InnerBlocks.DefaultBlockAppender />,
		[ hasInnerBlocks ]
	)

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls hasColumnAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<BlockLink.InspectorControls />
			<BlockStyle.InspectorControls styles={ blockStyles } />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

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

	return ! allowedInnerBlocks.length ? false : allowedInnerBlocks
} )

export default Edit

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/image-box', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/image-box' ? false : enabled
} )
