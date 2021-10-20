/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	getRowClasses,
	Separator,
	getSeparatorClasses,
	getContentAlignmentClasses,
	ContainerDiv,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		attributes,
	} = props

	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )
	const contentAlignmentClasses = getContentAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-feature',
		responsiveClass,
		separatorClass,
	] )

	const contentClassNames = classnames(
		applyFilters( 'stackable.feature.save.contentClassNames', {
			[ contentAlignmentClasses ]: contentAlignmentClasses,
		}, props ) )

	const innerClassNames = classnames(
		applyFilters( 'stackable.feature.save.innerClassNames', {
			'stk-inner-blocks': true,
			[ blockAlignmentClass ]: blockAlignmentClass,
			'stk-block-content': true,
			[ rowClass ]: [ rowClass ],
		}, props )
	)

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
					<div className={ innerClassNames }>
						<InnerBlocks.Content />
					</div>
				</ContainerDiv.Content>
			</Separator.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
