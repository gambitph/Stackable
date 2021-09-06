/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	getTypographyClasses,
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	Button,
	Typography,
	BlockStyle,
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
import { __ } from '@wordpress/i18n'
import { createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import { ButtonStyles } from './style'
import { blockStyles } from './block-styles'

const Edit = props => {
	const {
		className,
		onReplace,
	} = props

	const typographyInnerClasses = getTypographyClasses( props.attributes )
	const customAttributes = CustomAttributes.getCustomAttributes( props.attributes )

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-button',
		blockHoverClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<>

			<InspectorTabs />
			<BlockDiv.InspectorControls />

			<BlockStyle.InspectorControls styles={ blockStyles } />
			<Button.InspectorControls
				borderSelector=".stk-button"
			/>
			<Typography.InspectorControls
				hasTextTag={ false }
				initialOpen={ false }
				hasColor={ false }
			/>

			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-button" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ButtonStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-button" />

			<BlockDiv
				className={ blockClassNames }
				applyAdvancedAttributes={ false }
				applyCustomAttributes={ false }
			>
				<Button
					buttonProps={ {
						tagName: props.attributes.linkTag,
						id: props.attributes.anchor || undefined,
						...customAttributes,
					} }
				>
					<Typography
						tagName="span"
						className={ typographyInnerClassNames }
						placeholder={ __( 'Button text', i18n ) }
						withoutInteractiveFormatting={ true }
						onReplace={ onReplace }
						onSplit={ value => createBlock(
							'stackable/button',
							{ ...props.attributes, text: value }
						) }
					/>
				</Button>
			</BlockDiv>
		</>
	)
}

export default Edit
