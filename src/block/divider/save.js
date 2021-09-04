/**
 * Internal dependencies
 */
import { DividerStyles } from './style'
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

const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { name: blockStyle } = getBlockStyle( blockStyles, className ) || {}

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
		>
			<DividerStyles.Content version={ props.version } attributes={ attributes } />
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
