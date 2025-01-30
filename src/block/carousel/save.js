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
import { SvgIcon } from '~stackable/components'
import { defaultIconNext, defaultIconPrev } from './schema'

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
			'stk--infinite-scroll': attributes.carouselType === '' && attributes.infiniteScroll,
			'stk--hide-mobile-arrows': attributes.showArrowsOnMobile === false,
			'stk--hide-mobile-dots': attributes.showDotsOnMobile === false,

			'stk--arrows-outside': attributes.arrowPosition === 'outside',
			'stk--dots-outline': attributes.dotsStyle === 'outline',
			[ `stk--arrows-justify-${ attributes.arrowJustify || 'space-between' }` ]: attributes.arrowJustify || 'space-between',
			[ `stk--arrows-align-${ attributes.arrowAlign || 'center' }` ]: attributes.arrowAlign || 'center',
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
			data-slides-to-show={ attributes.slidesToShow }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<div className="stk-block-carousel__content-wrapper">
					<div className={ contentClassNames }>
						<div
							className="stk-block-carousel__slider"
							role="list"
							data-autoplay={ attributes.autoplay ? ( attributes.autoplaySpeed || '4000' ) : undefined }
							data-label-slide-of={ attributes.ariaLabelPrev || 'Slide %%d of %%d' }
						>
							<InnerBlocks.Content />
						</div>
						{ attributes.showArrows && (
							<div className="stk-block-carousel__buttons">
								<button className="stk-block-carousel__button stk-block-carousel__button__prev" aria-label={ attributes.ariaLabelPrev || 'Previous slide' }>
									<SvgIcon.Content
										value={ attributes.arrowIconPrev || defaultIconPrev }
									/>
								</button>
								<button className="stk-block-carousel__button stk-block-carousel__button__next" aria-label={ attributes.ariaLabelNext || 'Next slide' }>
									<SvgIcon.Content
										value={ attributes.arrowIconNext || defaultIconNext }
									/>
								</button>
							</div>
						) }
					</div>
					{ attributes.showDots && <div className="stk-block-carousel__dots" role="list" data-label={ attributes.ariaLabelSlide || 'Slide %%d' }></div> }
				</div>
			</Separator.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
