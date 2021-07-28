/**
 * Internal dependencies
 */
import { TextStyles } from './style'

import {
	BlockDiv,
	CustomCSS,
	Typography,
	getResponsiveClasses,
	getTypographyClasses,
	getAlignmentClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
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

	const responsiveClass = getResponsiveClasses( props.attributes )
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-text',
		responsiveClass,
	] )

	const textClassNames = classnames( [
		'stk-block-text__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<TextStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Typography.Content
				attributes={ attributes }
				className={ textClassNames }
				tagName="p"
			/>

		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
