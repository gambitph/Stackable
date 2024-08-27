/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	getRowClasses,
	Separator,
	getSeparatorClasses,
	getContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassName = classnames( [
		props.className,
		'stk-block-tabs',
		responsiveClass,
		separatorClass,
	] )

	const contentClassNames = classnames( applyFilters( 'stackable.tabs.save.contentClassNames', [
		[
			rowClass,
			'stk-inner-blocks',
			blockAlignmentClass,
			'stk-block-content',
			{
				'stk-block-tabs--vertical': props.attributes.tabOrientation === 'vertical',
				'stk-block-tabs--horizontal': props.attributes.tabOrientation !== 'vertical',
				'stk-block-tabs--fade': props.attributes.tabPanelEffect !== 'immediate',
				'stk-block-tabs--immediate': props.attributes.tabPanelEffect === 'immediate',
			},
		],
		getContentAlignmentClasses( props.attributes ),
	], props ) )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			attributes={ attributes }
			version={ props.version }
			data-initial-tab={ props.attributes.initialTabOpen || '1' }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<div className={ contentClassNames }>
					<InnerBlocks.Content />
				</div>
			</Separator.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
