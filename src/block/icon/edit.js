/**
 * Internal dependencies
 */
import { IconStyles } from './style'
/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import {
	BlockDiv,
	Icon,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const Edit = props => {
	const { className, attributes } = props

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-icon',
		blockHoverClass,
		blockAlignmentClass,
	] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<Icon.InspectorControls initialOpen={ true } />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<IconStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-icon" />
			<BlockDiv className={ blockClassNames }>
				<Icon />
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default Edit
