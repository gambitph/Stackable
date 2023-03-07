import { BlockDiv, CustomCSS } from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { TabsStyle } from './style'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

const Save = props => {
	const {
		className,
		attributes,
	} = props

	// const responsiveClass = getResponsiveClasses( props.attributes )
	// const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-tabs',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ props.attributes }
		>
			<TabsStyle.Content
				attributes={ attributes }
				version={ props.version }
			/>
			<CustomCSS.Content attributes={ props.attributes } />
			<InnerBlocks.Content />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
