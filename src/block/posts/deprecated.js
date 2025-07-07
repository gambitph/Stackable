/**
 * Internal dependencies
 */
import { attributes } from './schema'
import { Save } from './save'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import {
	Image, deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity,
	deprecateTypographyGradientColor, deprecationImageOverlayOpacity,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateShadowColor,
	deprecateTypographyFontSize, deprecateBlockHeight, deprecateImageBorderRadius,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { addFilter } from '@wordpress/hooks'
import { select } from '@wordpress/data'

// Version 3.0.2 Deprecations
const addUndefinedAttributes = ( attributes, version ) => {
	if ( compareVersions( version, '3.0.3' ) === -1 ) {
		return { ...attributes, attributes: undefined }
	}

	return attributes
}

const determineFeatureImage = ( featuredImage, version ) => {
	return ( compareVersions( '3.6.3', version ) === -1 ) ? featuredImage : <Image.Content />
}

addFilter( 'stackable.posts.title.typography-content', 'stackable/3_0_2', addUndefinedAttributes )
addFilter( 'stackable.posts.title.category-content', 'stackable/3_0_2', addUndefinedAttributes )
addFilter( 'stackable.posts.title.readmore-content', 'stackable/3_0_2', addUndefinedAttributes )
addFilter( 'stackable.posts.feature-image', 'stackable/3_6_3', determineFeatureImage )

const deprecated = [
	{
		// Support the change of type for border radius
		attributes: attributes( '3.16.3' ),
		save: withVersion( '3.16.3' )( Save ),
		isEligible: attributes => {
			const hasNumberBorderRadius = deprecateImageBorderRadius.isEligible( attributes )

			return hasNumberBorderRadius
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// We used to have an "Inner content width" which is now just the block width
			const hasOldInnerContentWidth = attributes.innerBlockContentWidth || attributes.innerBlockContentWidthTablet || attributes.innerBlockContentWidthMobile

			if ( hasOldInnerContentWidth ) {
				newAttributes = {
					...newAttributes,
					innerBlockContentWidth: '',
					innerBlockContentWidthTablet: '',
					innerBlockContentWidthMobile: '',
					innerBlockContentWidthUnit: 'px',
					innerBlockContentWidthUnitTablet: '',
					innerBlockContentWidthUnitMobile: '',
					blockWidth: attributes.innerBlockContentWidth,
					blockWidthTablet: attributes.innerBlockContentWidthTablet,
					blockWidthMobile: attributes.innerBlockContentWidthMobile,
					blockWidthUnit: attributes.innerBlockContentWidthUnit,
					blockWidthUnitTablet: attributes.innerBlockContentWidthUnitTablet,
					blockWidthUnitMobile: attributes.innerBlockContentWidthUnitMobile,
					innerBlockAlign: '',
					innerBlockAlignTablet: '',
					innerBlockAlignMobile: '',
					blockHorizontalAlign: attributes.innerBlockAlign,
					blockHorizontalAlignTablet: attributes.innerBlockAlignTablet,
					blockHorizontalAlignMobile: attributes.innerBlockAlignMobile,
				}
			}

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			newAttributes = deprecateTypographyFontSize.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockHeight.migrate( newAttributes )
			newAttributes = deprecateImageBorderRadius.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Handle the migration of shadow attributes with the change of type in 3.15.3
		attributes: attributes( '3.16.2' ),
		save: withVersion( '3.16.2' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasImageShadow = deprecateShadowColor.isEligible( 'image%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasImageShadow
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// We used to have an "Inner content width" which is now just the block width
			const hasOldInnerContentWidth = attributes.innerBlockContentWidth || attributes.innerBlockContentWidthTablet || attributes.innerBlockContentWidthMobile

			if ( hasOldInnerContentWidth ) {
				newAttributes = {
					...newAttributes,
					innerBlockContentWidth: '',
					innerBlockContentWidthTablet: '',
					innerBlockContentWidthMobile: '',
					innerBlockContentWidthUnit: 'px',
					innerBlockContentWidthUnitTablet: '',
					innerBlockContentWidthUnitMobile: '',
					blockWidth: attributes.innerBlockContentWidth,
					blockWidthTablet: attributes.innerBlockContentWidthTablet,
					blockWidthMobile: attributes.innerBlockContentWidthMobile,
					blockWidthUnit: attributes.innerBlockContentWidthUnit,
					blockWidthUnitTablet: attributes.innerBlockContentWidthUnitTablet,
					blockWidthUnitMobile: attributes.innerBlockContentWidthUnitMobile,
					innerBlockAlign: '',
					innerBlockAlignTablet: '',
					innerBlockAlignMobile: '',
					blockHorizontalAlign: attributes.innerBlockAlign,
					blockHorizontalAlignTablet: attributes.innerBlockAlignTablet,
					blockHorizontalAlignMobile: attributes.innerBlockAlignMobile,
				}
			}

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			newAttributes = deprecateTypographyFontSize.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockHeight.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the change of type for fontSize and blockHeight
		attributes: attributes( '3.15.3' ),
		save: withVersion( '3.15.3' )( Save ),
		isEligible: attributes => {
			const hasNumberFontSizeTitle = deprecateTypographyFontSize.isEligible( 'title%s' )( attributes )
			const hasNumberFontSizeCategory = deprecateTypographyFontSize.isEligible( 'category%s' )( attributes )
			const hasNumberFontSizeExcerpt = deprecateTypographyFontSize.isEligible( 'excerpt%s' )( attributes )
			const hasNumberFontSizeMeta = deprecateTypographyFontSize.isEligible( 'meta%s' )( attributes )
			const hasNumberFontSizeReadmore = deprecateTypographyFontSize.isEligible( 'readmore%s' )( attributes )
			const hasNumberBlockHeight = deprecateBlockHeight.isEligible( attributes )

			return hasNumberFontSizeTitle || hasNumberFontSizeCategory || hasNumberFontSizeExcerpt ||
				hasNumberFontSizeMeta || hasNumberFontSizeReadmore || hasNumberBlockHeight
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// We used to have an "Inner content width" which is now just the block width
			const hasOldInnerContentWidth = attributes.innerBlockContentWidth || attributes.innerBlockContentWidthTablet || attributes.innerBlockContentWidthMobile

			if ( hasOldInnerContentWidth ) {
				newAttributes = {
					...newAttributes,
					innerBlockContentWidth: '',
					innerBlockContentWidthTablet: '',
					innerBlockContentWidthMobile: '',
					innerBlockContentWidthUnit: 'px',
					innerBlockContentWidthUnitTablet: '',
					innerBlockContentWidthUnitMobile: '',
					blockWidth: attributes.innerBlockContentWidth,
					blockWidthTablet: attributes.innerBlockContentWidthTablet,
					blockWidthMobile: attributes.innerBlockContentWidthMobile,
					blockWidthUnit: attributes.innerBlockContentWidthUnit,
					blockWidthUnitTablet: attributes.innerBlockContentWidthUnitTablet,
					blockWidthUnitMobile: attributes.innerBlockContentWidthUnitMobile,
					innerBlockAlign: '',
					innerBlockAlignTablet: '',
					innerBlockAlignMobile: '',
					blockHorizontalAlign: attributes.innerBlockAlign,
					blockHorizontalAlignTablet: attributes.innerBlockAlignTablet,
					blockHorizontalAlignMobile: attributes.innerBlockAlignMobile,
				}
			}

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			newAttributes = deprecateTypographyFontSize.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockHeight.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			if ( ( typeof attributes?.titleFontSize === 'string' ||
				typeof attributes?.titleFontSizeTablet === 'string' ||
				typeof attributes?.titleFontSizeMobile === 'string' ||
				typeof attributes?.categoryFontSize === 'string' ||
				typeof attributes?.categoryFontSizeTablet === 'string' ||
				typeof attributes?.categoryFontSizeMobile === 'string' ||
				typeof attributes?.excerptFontSize === 'string' ||
				typeof attributes?.excerptFontSizeTablet === 'string' ||
				typeof attributes?.excerptFontSizeMobile === 'string' ||
				typeof attributes?.metaFontSize === 'string' ||
				typeof attributes?.metaFontSizeTablet === 'string' ||
				typeof attributes?.metaFontSizeMobile === 'string' ||
				typeof attributes?.readmoreFontSize === 'string' ||
				typeof attributes?.readmoreFontSizeTablet === 'string' ||
				typeof attributes?.readmoreFontSizeMobile === 'string' ||
				typeof attributes?.blockHeight === 'string' ||
				typeof attributes?.blockHeightTablet === 'string' ||
				typeof attributes?.blockHeightMobile === 'string' )
			) {
				return false
			}

			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasImageShadow = deprecateShadowColor.isEligible( 'image%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasImageShadow
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// We used to have an "Inner content width" which is now just the block width
			const hasOldInnerContentWidth = attributes.innerBlockContentWidth || attributes.innerBlockContentWidthTablet || attributes.innerBlockContentWidthMobile

			if ( hasOldInnerContentWidth ) {
				newAttributes = {
					...newAttributes,
					innerBlockContentWidth: '',
					innerBlockContentWidthTablet: '',
					innerBlockContentWidthMobile: '',
					innerBlockContentWidthUnit: 'px',
					innerBlockContentWidthUnitTablet: '',
					innerBlockContentWidthUnitMobile: '',
					blockWidth: attributes.innerBlockContentWidth,
					blockWidthTablet: attributes.innerBlockContentWidthTablet,
					blockWidthMobile: attributes.innerBlockContentWidthMobile,
					blockWidthUnit: attributes.innerBlockContentWidthUnit,
					blockWidthUnitTablet: attributes.innerBlockContentWidthUnitTablet,
					blockWidthUnitMobile: attributes.innerBlockContentWidthUnitMobile,
					innerBlockAlign: '',
					innerBlockAlignTablet: '',
					innerBlockAlignMobile: '',
					blockHorizontalAlign: attributes.innerBlockAlign,
					blockHorizontalAlignTablet: attributes.innerBlockAlignTablet,
					blockHorizontalAlignMobile: attributes.innerBlockAlignMobile,
				}
			}

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new combined opacity and color.
		// We have to repeat this because the older deprecations are not called when this triggers.
		// This deprecation entry is for the New UI where we changed how the
		// layout & containers work.
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasImageOpacity = deprecationImageOverlayOpacity.isEligible( attributes )
			const hasTitleGradient = deprecateTypographyGradientColor.isEligible( 'title%s' )( attributes )
			const hasCategoryGradient = deprecateTypographyGradientColor.isEligible( 'category%s' )( attributes )
			const hasExcerptGradient = deprecateTypographyGradientColor.isEligible( 'excerpt%s' )( attributes )
			const hasMetaGradient = deprecateTypographyGradientColor.isEligible( 'meta%s' )( attributes )
			const hasReadmoreGradient = deprecateTypographyGradientColor.isEligible( 'readmore%s' )( attributes )

			return hasContainerOpacity ||
				hasBlockOpacity ||
				hasImageOpacity ||
				hasTitleGradient ||
				hasCategoryGradient ||
				hasExcerptGradient ||
				hasMetaGradient ||
				hasReadmoreGradient
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// We used to have an "Inner content width" which is now just the block width
			const hasOldInnerContentWidth = attributes.innerBlockContentWidth || attributes.innerBlockContentWidthTablet || attributes.innerBlockContentWidthMobile

			if ( hasOldInnerContentWidth ) {
				newAttributes = {
					...newAttributes,
					innerBlockContentWidth: '',
					innerBlockContentWidthTablet: '',
					innerBlockContentWidthMobile: '',
					innerBlockContentWidthUnit: 'px',
					innerBlockContentWidthUnitTablet: '',
					innerBlockContentWidthUnitMobile: '',
					blockWidth: attributes.innerBlockContentWidth,
					blockWidthTablet: attributes.innerBlockContentWidthTablet,
					blockWidthMobile: attributes.innerBlockContentWidthMobile,
					blockWidthUnit: attributes.innerBlockContentWidthUnit,
					blockWidthUnitTablet: attributes.innerBlockContentWidthUnitTablet,
					blockWidthUnitMobile: attributes.innerBlockContentWidthUnitMobile,
					innerBlockAlign: '',
					innerBlockAlignTablet: '',
					innerBlockAlignMobile: '',
					blockHorizontalAlign: attributes.innerBlockAlign,
					blockHorizontalAlignTablet: attributes.innerBlockAlignTablet,
					blockHorizontalAlignMobile: attributes.innerBlockAlignMobile,
				}
			}

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		// This deprecation entry is for the New UI where we changed how the
		// layout & containers work.
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// We used to have an "Inner content width" which is now just the block width
			const hasOldInnerContentWidth = attributes.innerBlockContentWidth || attributes.innerBlockContentWidthTablet || attributes.innerBlockContentWidthMobile

			if ( hasOldInnerContentWidth ) {
				newAttributes = {
					...newAttributes,
					innerBlockContentWidth: '',
					innerBlockContentWidthTablet: '',
					innerBlockContentWidthMobile: '',
					innerBlockContentWidthUnit: 'px',
					innerBlockContentWidthUnitTablet: '',
					innerBlockContentWidthUnitMobile: '',
					blockWidth: attributes.innerBlockContentWidth,
					blockWidthTablet: attributes.innerBlockContentWidthTablet,
					blockWidthMobile: attributes.innerBlockContentWidthMobile,
					blockWidthUnit: attributes.innerBlockContentWidthUnit,
					blockWidthUnitTablet: attributes.innerBlockContentWidthUnitTablet,
					blockWidthUnitMobile: attributes.innerBlockContentWidthUnitMobile,
					innerBlockAlign: '',
					innerBlockAlignTablet: '',
					innerBlockAlignMobile: '',
					blockHorizontalAlign: attributes.innerBlockAlign,
					blockHorizontalAlignTablet: attributes.innerBlockAlignTablet,
					blockHorizontalAlignMobile: attributes.innerBlockAlignMobile,
				}
			}

			// Container borders while the container was turned off was allowed
			// before, now it's not allowed. Turn on the container to mimic the
			// effect. This goes first before the container paddings check below
			// because we need to set the paddings to zero for this to work.
			const hasContainerBorders = !! attributes.containerBorderType ||
				( typeof attributes.containerBorderRadius !== 'undefined' && attributes.containerBorderRadius !== '' ) ||
				!! attributes.containerShadow

			if ( ! attributes.hasContainer && hasContainerBorders ) {
				newAttributes = {
					...newAttributes,
					hasContainer: true,
					containerPadding: {
						top: 0, right: 0, bottom: 0, left: 0,
					},
					containerBackgroundColor: 'transparent',
				}
			}

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'category%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'excerpt%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'meta%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'readmore%s' )( newAttributes )

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
	},
	{
		attributes: attributes( '3.6.3' ),
		save: withVersion( '3.6.3' )( Save ),
	},
	{
		attributes: attributes( '3.0.2' ),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated

// Backward compatibility: In v3.1.4 the Default layout didn't show the featured
// image because "featured-image" was missing in the contentOrder attribute.
// This silently adds the missing value to contentOrder.
const withFeaturedImageFix = createHigherOrderComponent( BlockEdit => {
	return props => {
		if ( props.name === 'stackable/posts' ) {
			const { name, attributes } = props
			const activeVariation = select( 'core/blocks' ).getActiveBlockVariation( name, attributes )
			if ( activeVariation?.name === 'default' ) {
				if ( attributes.contentOrder.indexOf( 'featured-image' ) === -1 ) {
					attributes.contentOrder.splice( 1, 0, 'featured-image' )
				}
			}
		}

		return <BlockEdit { ...props } />
	}
}, 'withFeaturedImageFix' )

addFilter(
	'editor.BlockEdit',
	'stackable/posts-block-featured-image-fix',
	withFeaturedImageFix
)
