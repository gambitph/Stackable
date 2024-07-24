/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	Advanced, CustomCSS,
	Responsive,
	Button,
	BlockStyle,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { defaultIcon } from './schema'
import { IconButtonStyles } from './style'
import { blockStyles } from './block-styles'

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const customAttributes = CustomAttributes.getCustomAttributes( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-button',
	] )

	return (
		<>
			<>
				<InspectorTabs hasLayoutPanel={ false } />

				<BlockStyle.InspectorControls styles={ blockStyles }>
					<Button.InspectorControls.HoverEffects />
				</BlockStyle.InspectorControls>
				<Button.InspectorControls.Link />
				<Button.InspectorControls.Colors
					hasTextColor={ false }
					hasIconColor={ true }
				/>
				<Button.InspectorControls.Icon hasColor={ false } defaultValue={ defaultIcon } />
				<Button.InspectorControls.Size hasWidth={ true } />
				<Button.InspectorControls.Borders
					borderSelector=".stk-button"
					placeholder="24"
				/>

				<BlockDiv.InspectorControls initialOpen="spacing" />

				<Advanced.InspectorControls />
				<Transform.InspectorControls />
				<EffectsAnimations.InspectorControls />
				<CustomAttributes.InspectorControls />
				<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-button" />
				<Responsive.InspectorControls />
				<ConditionalDisplay.InspectorControls />
			</>

			<IconButtonStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-icon-button" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				applyCustomAttributes={ false }
			>
				<Button
					linkTrigger=".stk--inner-svg"
					buttonProps={ {
						id: props.attributes.anchorId || undefined,
						...customAttributes,
					} }
				/>
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
