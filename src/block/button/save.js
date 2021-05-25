/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	getColumnClasses,
	getTypographyClasses,
	BlockDiv,
	Button,
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

	const [ columnClass ] = getColumnClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const [ typographyWrapperClass, typographyInnerClasses ] = getTypographyClasses( props.attributes, { hoverAttrNameTemplate: 'hover%s' } )

	const buttonClassNames = classnames( [
		'stk-button__button',
		typographyWrapperClass,
	] )

	const blockClassNames = classnames( [
		props.className,
		'stk-button',
		columnClass,
		responsiveClass,
	] )

	const typographyInnerClassNames = classnames( [
		typographyInnerClasses,
		'stk-button__inner-text',
	] )

	return (
		<BlockDiv.Content className={ blockClassNames } attributes={ props.attributes }>
			<ButtonStyles.Content { ...propsToPass } />
			<Button.Content { ...propsToPass } className={ buttonClassNames }>
				<RichText.Content
					tagName="span"
					className={ typographyInnerClassNames }
					value={ props.attributes.text }
				/>
			</Button.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
