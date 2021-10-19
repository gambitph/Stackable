/**
 * Internal dependencies
 */
import { CardStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	ContainerDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	Image,
} from '~stackable/block-components'
import { BlockLink } from '~stackable/block-components/block-link'

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

	const contentClassNames = classnames( {
		...applyFilters( 'stackable.card.save.contentClassNames', {
			'stk--no-padding': true,
		}, props.version ),
	} )

	const wrapperClassNames = classnames( {
		'stk-container-padding': hasContainer,
		'stk-block-card__content': true,
		...applyFilters( 'stackable.card.save.wrapperClassNames', {}, props.version ),
	} )

	const innerClassNames = classnames( {
		'stk-block-content': true,
		'stk-inner-blocks': true,
		[ blockAlignmentClass ]: blockAlignmentClass,
		...applyFilters( 'stackable.card.save.innerClassNames', {}, props.version, props.attributes ),
	} )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<CardStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<ContainerDiv.Content
				className={ contentClassNames }
				attributes={ attributes }
			>
				{ props.attributes.imageUrl &&
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
				), props.version, innerClassNames ) }
				<BlockLink.Content attributes={ attributes } />
			</ContainerDiv.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
