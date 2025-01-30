/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import { InspectorTabs, useBlockCssGenerator } from '~stackable/components'
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
	Transform,
	getAlignmentClasses,
} from '~stackable/block-components'
import { useBlockStyle } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import { memo } from '@wordpress/element'

/**
 * Internal dependencies
 */
import buttonStyles from './style'
import { blockStyles } from './block-styles'

const Edit = props => {
	const {
		className,
		onReplace,
		attributes,
		setAttributes,
	} = props

	const typographyInnerClasses = getTypographyClasses( props.attributes )
	const customAttributes = CustomAttributes.getCustomAttributes( props.attributes )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockStyle = useBlockStyle( blockStyles )

	const blockClassNames = classnames( [
		className,
		'stk-block-button',
		blockAlignmentClass,
		// We need to add the blockStyle here to append the class alongside `.stk-block`
		// Only in the editor.
		{
			[ `is-style-${ blockStyle }` ]: blockStyle,
		},
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles: buttonStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls
				contentAlign={ attributes.contentAlign }
				setAttributes={ setAttributes }
				blockState={ props.blockState }
			/>
			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-button" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				applyCustomAttributes={ false }
			>
				<Button
					buttonProps={ {
						tagName: props.attributes.linkTag,
						id: props.attributes.anchorId || undefined,
						...customAttributes,
					} }
				>
					<Typography
						tagName="span"
						className={ typographyInnerClassNames }
						placeholder={ __( 'Button text', i18n ) }
						withoutInteractiveFormatting={ true }
						onReplace={ onReplace }
					/>
				</Button>
			</BlockDiv>

		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ props.contentAlign }
					onChange={ contentAlign => props.setAttributes( { contentAlign } ) }
				/>
			</BlockControls>

			<InspectorTabs hasLayoutPanel={ false } />

			<BlockStyle.InspectorControls styles={ blockStyles }>
				<Button.InspectorControls.HoverEffects />
			</BlockStyle.InspectorControls>
			<Button.InspectorControls
				blockState={ props.blockState }
				borderSelector=".stk-button"
				hasFullWidth={ true }
			/>
			<Typography.InspectorControls
				{ ...props }
				hasTextTag={ false }
				initialOpen={ false }
				hasColor={ false }
			/>

			<BlockDiv.InspectorControls initialOpen="spacing" />

			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-button" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
