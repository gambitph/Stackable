/**
 * Internal dependencies
 */
import { IconListStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	getResponsiveClasses, BlockDiv, CustomCSS, Typography, getTypographyClasses, getAlignmentClasses,
} from '~stackable/block-components'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
		className,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const tagName = attributes.ordered ? 'ol' : 'ul'

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list',
		blockAlignmentClass,
		responsiveClass,
		textClasses,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			<IconListStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Typography.Content
				tagName={ tagName }
				attributes={ attributes }
				multiline="li"
			/>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
