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
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useBlockHoverClass } from '~stackable/hooks'

const ALLOWED_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = [
	[ 'stackable/column', { templateLock: true, hasContainer: true }, [
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
	] ],
	[ 'stackable/column', { templateLock: true, hasContainer: true }, [
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
		'stk-block-pricing-box',
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
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-pricing-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-pricing-box" />

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
