/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	Button,
	getResponsiveClasses,
	CustomAttributes,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

/**
 * Internal dependencies
 */
import { IconButtonStyles } from './style'

export const Save = props => {
	const {
		className,
		...propsToPass
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const customAttributes = CustomAttributes.getCustomAttributes( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-button',
		responsiveClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ props.attributes }
			applyCustomAttributes={ false }
			version={ props.version }
		>
			<IconButtonStyles.Content { ...propsToPass } />
			<CustomCSS.Content attributes={ props.attributes } />
			<Button.Content
				{ ...propsToPass }
				attributes={ props.attributes }
				buttonProps={ {
					id: props.attributes.anchorId || undefined,
					...customAttributes,
				} }
			>
			</Button.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
