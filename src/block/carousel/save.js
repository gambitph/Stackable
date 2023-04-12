/**
 * Internal dependencies
 */
import BlockStyles from './style'

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
		'stk-block-carousel',
		responsiveClass,
		separatorClass,
		{
			'stk--is-slide': attributes.carouselType === '',
			'stk--is-fade': attributes.carouselType === 'fade',
			'stk--hide-others': attributes.carouselType === 'fade' && attributes.fadeOutOtherSlides,
			'stk--hide-mobile-arrows': attributes.showArrowsOnMobile === false,
			'stk--hide-mobile-dots': attributes.showDotsOnMobile === false,
		},
	] )

	const contentClassNames = classnames( applyFilters( 'stackable.carousel.save.contentClassNames', [
		[
			rowClass,
			'stk-inner-blocks',
			blockAlignmentClass,
			'stk-block-content',
			'stk-block-carousel__slider-wrapper',
		],
		getContentAlignmentClasses( props.attributes ),
	], props ) )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			attributes={ attributes }
			version={ props.version }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<div className={ contentClassNames }>
					<div className="stk-block-carousel__slider" role="list">
						<InnerBlocks.Content />
					</div>
					{ attributes.showArrows && (
						<div className="stk-block-carousel__buttons">
							<button className="stk-block-carousel__button stk-block-carousel__button__prev" aria-label="Previous item">{ '<' }</button>
							<button className="stk-block-carousel__button stk-block-carousel__button__next" aria-label="Next item">{ '>' }</button>
						</div>
					) }
				</div>
				{ attributes.showDots && <div className="stk-block-carousel__dots" role="list" data-label="Slide %d"></div> }
			</Separator.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
