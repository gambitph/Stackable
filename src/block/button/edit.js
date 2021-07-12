/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	getTypographyClasses,
	BlockDiv,
	Advanced, CustomCSS,
	Responsive,
	Linking,
	Button,
	Typography,
	BlockStyle,
	CustomAttributes,
	EffectsAnimations,
} from '~stackable/block-components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
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
		isHovered,
		onReplace,
	} = props

	const typographyInnerClasses = getTypographyClasses( props.attributes )

	const blockHoverClass = useBlockHoverClass()
	const buttonClassNames = classnames( [
		'stk-button__button',
	] )

	const blockClassNames = classnames( [
		className,
		'stk-button',
		blockHoverClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<Fragment>

			<InspectorTabs />
			<BlockDiv.InspectorControls />

			<BlockStyle.InspectorControls styles={ blockStyles } />
			<Button.InspectorControls
				hasIconGradient={ false }
				hasIconShape={ false }
				hasIconBackgroundShape={ false }
			/>
			<Typography.InspectorControls
				hasTextTag={ false }
				initialOpen={ false }
				hasColor={ false }
			/>

			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-button" />
			<Responsive.InspectorControls />

			<ButtonStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-button" />

			<Linking show={ isHovered } />
			<BlockDiv className={ blockClassNames }>
				<Button className={ buttonClassNames }>
					<Typography
						tagName="span"
						className={ typographyInnerClassNames }
						placeholder={ __( 'Button text', i18n ) }
						withoutInteractiveFormatting={ true }
						keepPlaceholderOnFocus
						onReplace={ onReplace }
						onSplit={ value => createBlock(
							'stackable/button',
							{ ...props.attributes, text: value }
						) }
					/>
				</Button>
			</BlockDiv>
		</Fragment>
	)
}

export default compose(
	withIsHovered
)( Edit )
