/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames/dedupe'
import {
	BlockDiv,
	ContainerDiv,
	getAlignmentClasses,
	CustomCSS,
	getResponsiveClasses,
	Separator,
	getSeparatorClasses,
	getContentAlignmentClasses,
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
		className,
	} = props

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const separatorClass = getSeparatorClasses( attributes )
	const responsiveClass = getResponsiveClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-hero',
		responsiveClass,
		separatorClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-hero__content',
	], getContentAlignmentClasses( attributes ) )

	const innerClassNames = classnames( applyFilters( 'stackable.hero.save.innerClassNames',
		[
			'stk-block-content',
			'stk-inner-blocks',
			blockAlignmentClass,
			`stk-${ attributes.uniqueId }-inner-blocks`,
		],
		props
	) )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
			data-v={ props.attributes.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<ContainerDiv.Content
					className={ contentClassNames }
					attributes={ attributes }
				>
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
