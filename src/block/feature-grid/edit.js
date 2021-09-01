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
	getRowClasses,
	MarginBottom,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useBlockHoverClass } from '~stackable/hooks'

const ALLOWED_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = [
	[ 'stackable/column', { templateLock: true, hasContainer: true }, [
		[ 'stackable/image' ],
		[ 'stackable/heading', {
			text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
		} ],
		[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
		[ 'stackable/button-group', {}, [
			[ 'stackable/button', {
				text: 'Button',
				buttonBackgroundColor: 'transparent',
				className: 'is-style-plain',
			} ],
		] ],
	] ],
	[ 'stackable/column', { templateLock: true, hasContainer: true }, [
		[ 'stackable/image' ],
		[ 'stackable/heading', {
			text: __( 'Title', i18n ), textTag: 'h3', textRemoveTextMargins: true,
		} ],
		[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
		[ 'stackable/button-group', {}, [
			[ 'stackable/button', {
				text: 'Button',
				buttonBackgroundColor: 'transparent',
				className: 'is-style-plain',
			} ],
		] ],
	] ],
]

const TABS = [ 'block', 'advanced' ]

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-feature-grid',
		rowClass,
		blockHoverClass,
		columnTooltipClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	return (
		<>

			<InspectorTabs tabs={ TABS } />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature-grid" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-feature-grid" />

			<BlockDiv className={ blockClassNames }>
				<div className={ contentClassNames }>
					<ColumnInnerBlocks
						providerValue={ columnProviderValue }
						template={ TEMPLATE }
						// templateLock="insert"
						allowedBlocks={ ALLOWED_BLOCKS }
						orientation="horizontal"
					/>
				</div>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
