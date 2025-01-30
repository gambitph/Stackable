/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'

import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
	getAlignmentClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { getBlockStyle } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { name: blockStyle } = getBlockStyle( blockStyles, className || attributes.className ) || {}

	const blockClassNames = classnames( [
		className,
		'stk-block-divider',
		responsiveClass,
		blockAlignmentClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			{ [ 'dots', 'asterisks' ].includes( blockStyle ) ? (
				<div className="stk-block-divider__dots" aria-hidden="true">
					<div className="stk-block-divider__dot" />
					<div className="stk-block-divider__dot" />
					<div className="stk-block-divider__dot" />
				</div>
			) : <hr className="stk-block-divider__hr" /> }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
