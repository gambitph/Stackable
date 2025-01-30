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

export const Save = props => {
	const {
		attributes,
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
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ props.attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ props.attributes } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
