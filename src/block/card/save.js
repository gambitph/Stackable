/**
 * Internal dependencies
 */
import { CardStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	BlockLink,
	ContainerDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	Image,
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
	const {
		hasContainer,
	} = props.attributes

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-card',
		responsiveClass,
	] )

	const contentClassNames = classnames(
		applyFilters( 'stackable.card.save.contentClassNames', {
			'stk--no-padding': true,
		}, props ) )

	const wrapperClassNames = classnames(
		applyFilters( 'stackable.card.save.wrapperClassNames', {
			'stk-container-padding': hasContainer,
			'stk-block-card__content': true,
		}, props )
	)

	const innerClassNames = classnames(
		applyFilters( 'stackable.card.save.innerClassNames', [
			{
				'stk-block-content': true,
				'stk-inner-blocks': true,
				[ blockAlignmentClass ]: blockAlignmentClass,
			},
			`stk-${ attributes.uniqueId }-inner-blocks`,
		], props ) )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
			data-v={ props.attributes.version }
		>
			<CardStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ attributes.uniqueId && <ContainerDiv.Content
				className={ contentClassNames }
				attributes={ attributes }
			>
				{ ( props.attributes.imageUrl || props.attributes.imageExternalUrl ) &&
					<Image.Content
						className="stk-block-card__image"
						attributes={ attributes }
					/>
				}
				{ applyFilters( 'stackable.card.save.container-div.content', (
					<div className={ wrapperClassNames }>
						<div className={ innerClassNames }>
							<InnerBlocks.Content />
						</div>
					</div>
				), props, innerClassNames ) }
				<BlockLink.Content attributes={ attributes } />
			</ContainerDiv.Content> }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
