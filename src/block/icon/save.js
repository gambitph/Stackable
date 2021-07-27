/**
 * Internal dependencies
 */
import { IconStyles } from './style'

import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	Icon,
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes, className,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-icon',
		blockAlignmentClass,
		responsiveClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<IconStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Icon.Content attributes={ attributes } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
