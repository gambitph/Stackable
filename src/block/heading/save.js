/**
 * Internal dependencies
 */
import { HeadingStyles } from './style'

import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
	getTypographyClasses,
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
	const [ wrapperClasses, textClasses ] = getTypographyClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-heading',
		responsiveClass,
		wrapperClasses,
	] )

	const textClassNames = classnames( [
		'stk-heading__text',
		textClasses,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<HeadingStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<RichText.Content
				className={ textClassNames }
				tagName={ textTag }
				value={ text }
			/>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
