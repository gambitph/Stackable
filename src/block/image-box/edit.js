/**
 * Internal dependencies
 */
import { ImageBoxStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import {
	Fragment, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

const TEMPLATE = [
	[ 'stackable/image', {} ],
	[ 'stackable/column', {}, [
		[ 'stackable/icon', {} ],
		[ 'stackable/subtitle', { text: __( 'Subtitle', i18n ) } ],
		[ 'stackable/heading', { text: __( 'Title', i18n ) } ],
		[ 'stackable/text', { text: __( 'Description', i18n ) } ],
	] ],
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
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ImageBoxStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-image-box" />

			<BlockDiv className={ blockClassNames }>
				<div className={ contentClassNames }>
					<InnerBlocks
						templateLock="all"
						template={ TEMPLATE }
						orientation={ blockOrientation }
						renderAppender={ renderAppender }
					/>
				</div>
			</BlockDiv>
		</Fragment>
	)
}

addFilter( 'stackable.block.column.allowed-inner-blocks', 'stackable/image-box', template => {
	const { parentBlock, innerBlocks } = useBlockContext()

	if ( parentBlock.name !== 'stackable/image-box' ) {
		return template
	}

	const allowedInnerBlocks = TEMPLATE[ 1 ][ 2 ].filter( blockTemplate => ! innerBlocks?.map( ( { name } ) => name ).includes( blockTemplate[ 0 ] )
	).map( ( [ name ] ) => name )

	return allowedInnerBlocks
} )

export default Edit
