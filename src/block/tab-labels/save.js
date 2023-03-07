/**
 * Internal dependencies
 */

import {
	BlockDiv,
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
		'stk-block-tab-labels',
		responsiveClass,
	] )

	//this is the thing
	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<div className="stk-block-tab-labels__wrapper">
				<div className="stk-block-tabs__tab stk-tabs__tab-desktop" aria-selected="true">
					Tab 1
				</div>
				<div className="stk-block-tabs__tab stk-tabs__tab-desktop" >
					Tab 2
				</div>
				<div className="stk-block-tabs__tab stk-tabs__tab-desktop" >
					Tab 3
				</div>
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
