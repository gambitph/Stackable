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
		...propsToPass
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-icon-button',
		responsiveClass,
	] )

	return (
		<BlockDiv.Content className={ blockClassNames } attributes={ props.attributes }>
			<IconButtonStyles.Content { ...propsToPass } />
			<CustomCSS.Content attributes={ props.attributes } />
			<Button.Content
				{ ...propsToPass }
				attributes={ props.attributes }
			>
			</Button.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
