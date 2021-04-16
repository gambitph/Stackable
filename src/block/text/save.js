/**
 * Internal dependencies
 */
import createStyles from './style'

import {
	BlockDiv,
	CustomCSS,
	Style,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'
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

	const {
		text,
	} = props.attributes

	const blockClassNames = classnames( [
		className,
		'stk-advanced-text',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<Style.Content
				styleFunc={ createStyles( VERSION ) }
				attributes={ attributes }
			/>
			<CustomCSS.Content attributes={ attributes } />
			<RichText.Content
				className="stk-advanced-text__text"
				tagName="p"
				value={ text }
			/>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
