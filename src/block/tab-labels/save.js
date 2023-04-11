import { TabLabelStyle } from './style'

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
import { RichText } from '@wordpress/block-editor'

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

	const tabs = props.attributes.tabs.map( ( tab, index ) => {
		return (
			<button className="stk-block-tabs__tab stk-tabs__tab-desktop"
				key={ index }
			>
				<RichText.Content
					tagName="p"
					value={ tab.label }
				/>
			</button>
		 )
	} )

	//this is the thing
	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<TabLabelStyle.Content
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ props.clientId }
			/>
			<div className="stk-block-tab-labels__wrapper">
				{ tabs }
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
