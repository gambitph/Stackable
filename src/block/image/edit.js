/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'
import {
	BlockDiv,
	Image,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const heightUnit = [ 'px', 'vh' ]

const Edit = props => {
	const {
		className,
	} = props

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-image',
		blockHoverClass,
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls hasColumnAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Image.InspectorControls
				initialOpen={ true }
				heightUnits={ heightUnit }
			/>
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-image" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-image" />

			<BlockDiv className={ blockClassNames }>
				<Image
					heightUnits={ heightUnit }
					defaultWidth="100"
					defaultHeight="auto"
				/>
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
