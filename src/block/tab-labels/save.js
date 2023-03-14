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
import { __ } from '@wordpress/i18n'

const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
		responsiveClass,
	] )

	const tabs = []

	for ( let i = 1; i <= attributes.tabCount; i++ ) {
		tabs.push(
			<button
				data-tab={ i }
				data-initial-open={ attributes.initialTabOpen === i.toString() ? true : false }
				className="stk-block-tabs__tab stk-tabs__tab-desktop"
			>
				Tab { i }
			</button>
		)
	}

	//this is the thing
	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<div className="stk-block-tab-labels__wrapper">
				{ tabs }
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
