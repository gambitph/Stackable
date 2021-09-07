/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import { ColumnInnerBlocks, InspectorTabs } from '~stackable/components'
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
	Transform,
	ContainerDiv,
	BlockLink,
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useCallback } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'

const TEMPLATE = [
	[ 'stackable/heading', {
		text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
	} ],
	[ 'stackable/price', {} ],
	[ 'stackable/icon-list', { text: '<li>Feature</li><li>Benefit</li><li>Description</li>' } ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', {
			text: 'Button',
		} ],
	] ],
]

const Edit = props => {
	const {
		className,
	} = props

	const { hasInnerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-pricing-box',
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		`stk-${ props.attributes.uniqueId }-container`,
	] )

	const renderAppender = useCallback(
		() => hasInnerBlocks ? false : <InnerBlocks.DefaultBlockAppender />,
		[ hasInnerBlocks ]
	)

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
			<CustomCSS.InspectorControls mainBlockClass="stk-block-pricing-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-pricing-box" />

			<BlockDiv className={ blockClassNames }>
				<ContainerDiv className={ contentClassNames }>
					<ColumnInnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ renderAppender }
					/>
				</ContainerDiv>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
