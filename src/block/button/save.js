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

	const blockClassNames = classnames( [
		className,
		'stk-block-button',
		blockAlignmentClass,
		responsiveClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		applyFilters( 'stackable.button.save.blockDiv.content', (
			<BlockDiv.Content
				{ ...useBlockProps.save( { className: blockClassNames } ) }
				attributes={ props.attributes }
				applyCustomAttributes={ false }
				version={ props.version }
				blockTag={ props.attributes.className === 'is-style-link' ? 'p' : null }
			>
				{ props.attributes.generatedCss && <style>{ props.attributes.generatedCss }</style> }
				<CustomCSS.Content attributes={ props.attributes } />
				<Button.Content
					{ ...propsToPass }
					attributes={ props.attributes }
					buttonProps={ {
						id: props.attributes.anchorId || undefined,
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
		), props, propsToPass, blockClassNames, customAttributes, typographyInnerClassNames )
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
