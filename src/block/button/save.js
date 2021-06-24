/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	getTypographyClasses,
	BlockDiv,
	Button,
	Icon,
	getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'

/**
 * Internal dependencies
 */
import { ButtonStyles } from './style'

export const Save = props => {
	const {
		...propsToPass
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )

	const typographyInnerClasses = getTypographyClasses( props.attributes )

	const buttonClassNames = classnames( [
		'stk-button__button',
	] )

	const blockClassNames = classnames( [
		props.className,
		'stk-button',
		responsiveClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<BlockDiv.Content className={ blockClassNames } attributes={ props.attributes }>
			<ButtonStyles.Content { ...propsToPass } />
			<Button.Content { ...propsToPass } className={ buttonClassNames } enableLinearGradient={ false }>
				<Icon.Content attributes={ props.attributes } />
				{ props.attributes.showText && (
					<RichText.Content
						tagName="span"
						className={ typographyInnerClassNames }
						value={ props.attributes.text }
					/>
				) }
			</Button.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
