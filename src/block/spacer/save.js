/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

/**
 * Internal dependencies
 */
import { SpacerStyles } from './style'

export const Save = props => {
	const {
		...propsToPass
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		propsToPass.className,
		'stk-block-spacer',
		responsiveClass,
		'stk--no-padding',
	] )

	return (
		<BlockDiv.Content className={ blockClassNames } attributes={ props.attributes }>
			<SpacerStyles.Content { ...propsToPass } />
			<CustomCSS.Content attributes={ props.attributes } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
