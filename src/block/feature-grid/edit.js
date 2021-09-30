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
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	useContentAlignmentClasses,
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

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-feature-grid',
		rowClass,
		blockHoverClass,
		separatorClass,
		columnTooltipClass,
		'stk-block-feature-grid__inner-container',
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
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature-grid" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
			<ContentAlign.InspectorControls hasColumnCount={ true } />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-feature-grid" />

			<BlockDiv className={ blockClassNames }>
				<Separator>
					<div className={ contentClassNames }>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							template={ TEMPLATE }
							// templateLock="insert"
							allowedBlocks={ ALLOWED_BLOCKS }
							orientation="horizontal"
							renderAppender={ false }
						/>
					</div>
				</Separator>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
