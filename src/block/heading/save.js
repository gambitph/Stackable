/**
 * Internal dependencies
 */
import { HeadingStyles } from './style'

/**
 * External dependencies
 */
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
import { sanitizeIdAttr } from '~stackable/util'

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
		'stk-block-heading',
		responsiveClass,
	] )

	const textClassNames = classnames( [
		'stk-block-heading__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			enableId={ false }
		>
			<HeadingStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ props.attributes.showTopLine && <div className="stk-block-heading__top-line" /> }
			<Typography.Content
				attributes={ attributes }
				className={ textClassNames }
				defaultTag="h2"
				id={ attributes.anchor || sanitizeIdAttr( attributes.text ) }
			/>
			{ props.attributes.showBottomLine && <div className="stk-block-heading__bottom-line" /> }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
