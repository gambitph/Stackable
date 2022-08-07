/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	getTypographyClasses,
	BlockDiv,
	CustomCSS,
	Button,
	Typography,
	getResponsiveClasses,
	CustomAttributes,
	getAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { useBlockProps } from '@wordpress/block-editor'

/**
 * Internal dependencies
 */
import { ButtonStyles } from './style'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		className,
		...propsToPass
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const customAttributes = CustomAttributes.getCustomAttributes( props.attributes )

	const typographyInnerClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const fullWidthClass = props.attributes.buttonFullWidth ? 'stk-button--full-width' : ''

	const blockClassNames = classnames(
		applyFilters( 'stackable.button.save.blockClassNames', [
			className,
			'stk-block-button',
			blockAlignmentClass,
			responsiveClass,
			fullWidthClass,
		], props )
	)

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<BlockDiv.Content
			{ ...useBlockProps.save( { className: blockClassNames } ) }
			attributes={ props.attributes }
			applyAdvancedAttributes={ false }
			applyCustomAttributes={ false }
		>
			<ButtonStyles.Content { ...propsToPass } />
			<CustomCSS.Content attributes={ props.attributes } />
			<Button.Content
				{ ...propsToPass }
				attributes={ props.attributes }
				buttonProps={ {
					id: props.attributes.anchor || undefined,
					...customAttributes,
				} }
			>
				<Typography.Content
					attributes={ props.attributes }
					tagName="span"
					className={ typographyInnerClassNames }
				/>
			</Button.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
