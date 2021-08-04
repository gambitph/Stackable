/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	BlockDiv,
	Advanced, CustomCSS,
	Responsive,
	Linking,
	Button,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
} from '~stackable/block-components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { IconButtonStyles } from './style'

const Edit = props => {
	const {
		className,
		isHovered,
	} = props

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-button',
		blockHoverClass,
	] )

	return (
		<>
			<InspectorTabs />
			<BlockDiv.InspectorControls />

			<Button.InspectorControls
				hasTextColor={ false }
				hasIconGap={ false }
				hasIconPosition={ false }
			/>

			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-button" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<IconButtonStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-icon-button" />

			<Linking show={ isHovered } />
			<BlockDiv className={ blockClassNames }>
				<Button />
			</BlockDiv>
		</>
	)
}

export default compose(
	withIsHovered
)( Edit )
