import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	Icon,
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	Link,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { useBlockProps } from '@wordpress/block-editor'

export const Save = props => {
	const {
		attributes, className,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon',
		blockAlignmentClass,
		responsiveClass,
	] )

	return (
		<BlockDiv.Content
			{ ...useBlockProps.save( { className: blockClassNames } ) }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			{ /** Don't add an `a` tag if linkUrl is not defined. **/ }
			{ attributes.linkUrl ? (
				<Link.Content attributes={ attributes }>
					<Icon.Content attributes={ attributes } />
				</Link.Content>
			) : <Icon.Content attributes={ attributes } /> }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
