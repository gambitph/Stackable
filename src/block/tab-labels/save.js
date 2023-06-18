/**
 * Internal dependencies
 */
import { TextStyles } from './style'

import {
	BlockDiv,
	CustomCSS,
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
import { RichText } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
		responsiveClass,
	] )

	const textClassNames = classnames( [
		'stk-block-tab-labels__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			<TextStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div
				className="stk-block-tab-labels__wrapper"
				role="tablist"
			>
				{ props.attributes.tabLabels.map( ( tab, index ) => {
					return (
						<button
							className="stk-block-tabs__tab"
							role="tab"
							key={ index }
						>
							{ /* { attributes.iconPosition !== 'right' && <Icon.Content attributes={ attributes } /> } */ }
							<div className={ textClassNames }>
								<RichText.Content
									tagName="span"
									value={ tab.label }
								/>
							</div>
						</button>
					)
				} ) }
			</div>

		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
