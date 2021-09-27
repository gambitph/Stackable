/**
 * Internal dependencies
 */
import variations from './variations'
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
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
} from '~stackable/block-components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const TEMPLATE = variations[ 0 ].innerBlocks

const TABS = [ 'block', 'advanced' ]

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

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
	] )

	return (
		<>
			<InspectorTabs tabs={ TABS } />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-feature" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-feature" />

			<BlockDiv className={ blockClassNames } enableVariationPicker={ true }>
				<Separator>
					<div className={ contentClassNames }>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							template={ TEMPLATE }
							templateLock="insert"
						/>
					</div>
				</Separator>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
