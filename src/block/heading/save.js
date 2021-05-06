/**
 * Internal dependencies
 */
import createStyles from './style'

import {
	BlockDiv,
	CustomCSS,
	Style,
	getResponsiveClasses,
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
		text, textTag,
	} = attributes

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-advanced-text',
		responsiveClass,
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
				className="stk-advanced-heading__text"
				tagName={ textTag }
				value={ text }
			/>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
