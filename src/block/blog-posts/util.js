/**
 * External dependencies
 */
import { isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		postType = 'post',
		showImage = true,
		showTitle = true,
		showCategory = true,
		showExcerpt = true,
		showMeta = true,
		showReadmore = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.blog-posts.show', {
		columnBackground: ! [ 'basic', 'list' ].includes( design ),
		showBackgroundInItem: design === 'vertical-card2',
		showBackgroundInContent: [ 'vertical-card', 'horizontal-card', 'image-card' ].includes( design ),
		borderRadius: true,
		shadow: true,
		imageShadow: [ 'basic', 'list' ].includes( design ),
		postType: isPro,
		imageHeight: design !== 'portfolio' && design !== 'portfolio2',
		imageWidth: design === 'horizontal-card' || design === 'list',
		showCategory: postType === 'post',
		imageAsBackground: [ 'portfolio', 'portfolio2', 'image-card' ].includes( design ),
		imageOutsideContainer: [ 'list', 'vertical-card', 'horizontal-card', 'image-card' ].includes( design ),
		imageSpacing: showImage && [ 'basic', 'list', 'vertical-card2' ].includes( design ),
		categorySpacing: showCategory,
		titleSpacing: showTitle,
		excerptSpacing: showExcerpt,
		metaSpacing: showMeta,
		readmoreSpacing: showReadmore,
		contentOrderStyles: design !== 'image-card',
	}, blockProps )
}
