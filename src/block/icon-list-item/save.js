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
	Icon,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { getUseSvgDef } from '../icon-list/util'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list-item',
		responsiveClass,
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
				{ ! attributes.ordered && attributes.icon &&
					<Icon.Content
						value={ attributes.icon }
						attributes={ attributes }
						hasLinearGradient={ false }
					/> }
				{ ! attributes.ordered && ! attributes.icon &&
					<Icon.Content
						attributes={ attributes }
						useSvgDef={ true }
						value={ getUseSvgDef(
							`#stk-icon-list__icon-svg-def-${ attributes.parentUniqueId }`
						) }
						hasLinearGradient={ false }
					/> }
				{ attributes.ordered && <span className="stk-block-icon-list-item__marker" aria-hidden="true"></span> }
				<Typography.Content
					attributes={ attributes }
					tagName="span"
					className={ textClassNames }
				/>
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
