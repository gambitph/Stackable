/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import { InspectorTabs } from '~stackable/components'
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
} from '~stackable/block-components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/column', {}, [
		[ 'stackable/heading', { text: __( 'Feature' ) } ],
		[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
		[ 'stackable/button-group', {}, [
			[ 'stackable/button', { text: __( 'Button' ) } ],
		] ],
	] ],
	[ 'stackable/column', { templateLock: 'insert' }, [
		[ 'stackable/image', {} ],
	] ],
]

const TABS = [ 'block', 'advanced' ]

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-feature',
		rowClass,
		blockHoverClass,
		separatorClass,
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
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-feature" />

			<BlockDiv className={ blockClassNames }>
				<Separator>
					<div className={ contentClassNames }>
						<InnerBlocks
							template={ TEMPLATE }
							templateLock="insert"
							orientation="horizontal"
						/>
					</div>
				</Separator>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
