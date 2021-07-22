/**
 * Internal dependencies
 */

/***
 * External dependencies
 */
import classnames from 'classnames'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import {
	Typography,
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	Fragment,
} from '@wordpress/element'

const Edit = props => {
	const {
		className,
	} = props

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-icon-list',
		blockHoverClass,
	] )

	return (
		<Fragment>
			<InspectorTabs />

			<BlockDiv.InspectorControls />

			<Typography.InspectorControls
				isMultiline={ true }
				initialOpen={ false }
				hasTextTag={ false }
			/>
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-icon-list" />
			<Responsive.InspectorControls />

			<CustomCSS mainBlockClass="stk-icon-list" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					defaultTag="ul"
					multiline="li"
					keepPlaceholderOnFocus
				/>
			</BlockDiv>

		</Fragment>
	)
}

export default Edit
