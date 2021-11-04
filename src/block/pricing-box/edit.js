/** Internal dependencies
 */
import BlockStyles from './style'
import { blockStyles } from './block-styles'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import { last } from 'lodash'
import {
	ColumnInnerBlocks, InspectorBottomTip, InspectorStyleControls, InspectorTabs,
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
	ContainerDiv,
	BlockLink,
	ContentAlign,
	useContentAlignmentClasses,
	BlockStyle,
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { useMemo } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'

const TEMPLATE = [
	[ 'stackable/heading', {
		text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
	} ],
	[ 'stackable/price', {} ],
	[ 'stackable/subtitle', { text: _x( 'Subtitle for This Block', 'Subtitle placeholder', i18n ) } ],
	[ 'stackable/icon-list', {
		text: sprintf( '<li>%s</li><li>%s</li><li>%s</li>', ...[ __( 'one', i18n ), __( 'two', i18n ), __( 'three' ) ].map( v => sprintf( __( 'Package inclusion %s', i18n ), v ) ) ),
	} ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', {
			text: _x( 'Button', 'Button placeholder', i18n ),
		} ],
	] ],
]

const Edit = props => {
	const {
		className,
	} = props

	useGeneratedCss( props.attributes )

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
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
		'stk-block-pricing-box__content',
	], useContentAlignmentClasses( props.attributes ) )

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender
	}, [ hasInnerBlocks, innerBlocks ] )

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
			<BlockStyle.InspectorControls styles={ blockStyles } />
			<ContentAlign.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

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
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default withQueryLoopContext( Edit )
