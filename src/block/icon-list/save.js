/**
 * Internal dependencies
 */
import { IconListStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	getResponsiveClasses, BlockDiv, CustomCSS, Typography, getTypographyClasses,
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

	const tagName = attributes.ordered ? 'ol' : 'ul'

	const blockClassNames = classnames( [
		className,
		'stk-icon-list',
		responsiveClass,
		textClasses,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
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
