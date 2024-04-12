/**
 * Internal dependencies
 */
import { TabStyles } from './style'

import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
	getTypographyClasses,
	getAlignmentClasses,
	Icon,
} from '~stackable/block-components'
import { RichText } from '~stackable/components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
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
		{
			'stk-block-tab-labels--wrap-mobile': ! props.attributes.scrollableOnMobile,
		},
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
			<TabStyles.Content version={ props.version } attributes={ attributes } />
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
							id={ props.attributes.tabLabels[ index ].anchor ?? undefined }
						>
							{ props.attributes.showIcon && (
								<Icon.Content
									attributes={ attributes }
									value={ props.attributes.tabLabels[ index ].icon }
								/>
							) }
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
