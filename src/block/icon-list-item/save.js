/**
 * Internal dependencies
 */
import { TextStyles } from './style'

import {
	BlockDiv,
	CustomCSS,
	Typography,
	// getResponsiveClasses,
	getTypographyClasses,
	getAlignmentClasses,
	Icon,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { getUseSvgDef } from '../icon-list-new/util'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list-item',
	] )

	const textClassNames = classnames( [
		'stk-block-icon-list-item__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<BlockDiv.Content
			blockHoverClass={ props.blockHoverClass }
			clientId={ props.clientId }
			attributes={ props.attributes }
			className={ blockClassNames }
			blockTag="li"
			renderHtmlTag={ false }
		>
			<TextStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className="stk-block-icon-list-item__content">
				<Icon.Content attributes={ attributes } />
				{ ! attributes.ordered && attributes.icon && <Icon.Content value={ attributes.icon } attributes={ attributes } /> }
				{ ! attributes.ordered && ! attributes.icon && <Icon.Content attributes={ attributes } useSvgDef={ true } value={ getUseSvgDef( `#stk-icon-list__icon-svg-def-${ attributes.parentUniqueId }` ) } /> }
				<Typography.Content
					attributes={ attributes }
					tagName="span"
					className={ textClassNames }
				/>
			</div>
			<InnerBlocks.Content />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
