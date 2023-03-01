/**
 * Internal dependencies
 */

import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-text',
		responsiveClass,
	] )

	//this is the thing
	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<CustomCSS.Content attributes={ attributes } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
