/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
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
	getRowClasses,
	MarginBottom,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	useContentAlignmentClasses,
	ContainerDiv,
	BlockStyle,
} from '~stackable/block-components'
import { useBlockHoverClass, useBlockContext } from '~stackable/hooks'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/column', { columnAlign: 'center' }, [
		[ 'stackable/heading', { text: _x( 'Title for This Block', 'Heading placeholder', i18n ) } ],
		[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
		[ 'stackable/button-group', {}, [
			[ 'stackable/button', { text: _x( 'Button', 'Button placeholder', i18n ) } ],
		] ],
	] ],
	[ 'stackable/column', { templateLock: 'insert', columnAlign: 'center' }, [
		[ 'stackable/image', {} ],
	] ],
]

const Edit = props => {
	const {
		className,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()
	const { hasInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-feature',
		rowClass,
		blockHoverClass,
		separatorClass,
		columnTooltipClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], useContentAlignmentClasses( props.attributes ) )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<BlockStyle.InspectorControls styles={ blockStyles } />
			<ContentAlign.InspectorControls />
			<ContainerDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-feature" />

			<BlockDiv className={ blockClassNames }>
				<Separator>
					<ContainerDiv className={ contentClassNames }>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							template={ TEMPLATE }
							templateLock="insert"
							orientation={ props.attributes.alignVertical ? 'vertical' : 'horizontal' }
						/>
					</ContainerDiv>
				</Separator>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default withQueryLoopContext( Edit )
