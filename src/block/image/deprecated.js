import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecationImageOverlayOpacity,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateShadowColor, deprecateTypographyFontSize,
	deprecateBlockHeight, deprecateImageBorderRadius,
} from '~stackable/block-components'

import { RichText } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

addFilter( 'stackable.image.save.wrapper', 'stackable/image-link-wrapper', ( output, props, imageWrapperClasses, image, figcaptionClassnames ) => {
	if ( ! props.version ) {
		return output
	}

	if ( ! props.hasWrapper ) { // Image block is the only one with a wrapper
		return output
	}

	if ( semverCompare( props.version, '<', '3.12.7' ) ) {
		const Wrapper = props.customWrapper || 'figure'
		return (
			<Wrapper>
				<div className={ imageWrapperClasses }>
					{ image.props.children }
				</div>
				{ props.figcaptionShow && props.src && <RichText.Content tagName="figcaption" className={ figcaptionClassnames } value={ props.figcaption } /> }
				{ props.children }
			</Wrapper>
		)
	}

	return output
} )

addFilter( 'stackable.image.save.wrapper', 'stackable/image-caption-wrapper', ( output, props, imageWrapperClasses, image ) => {
	if ( ! props.version ) {
		return output
	}

	if ( ! props.hasWrapper ) { // Image block is the only one with a wrapper
		return output
	}

	// Get the children of wrapped img
	if ( semverCompare( props.version, '<', '3.12.4' ) ) {
		const Wrapper = props.customWrapper || 'figure'
		return (
			<Wrapper className={ imageWrapperClasses }>
				{ image.props.children }
			</Wrapper>
		 )
	}

	return output
} )

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
			let newAttributes = { ...attributes }

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'figcaption%s' )( newAttributes )
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
			let newAttributes = { ...attributes }

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'figcaption%s' )( newAttributes )
			newAttributes = deprecateBlockHeight.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the change of type for fontSize
		attributes: attributes( '3.15.3' ),
		save: withVersion( '3.15.3' )( Save ),
		isEligible: attributes => {
			const hasNumberFontSize = deprecateTypographyFontSize.isEligible( 'figcaption%s' )( attributes )
			const hasNumberBlockHeight = deprecateBlockHeight.isEligible( attributes )
			return hasNumberFontSize || hasNumberBlockHeight
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( 'figcaption%s' )( newAttributes )
			newAttributes = deprecateBlockHeight.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			if ( ( typeof attributes?.figcaptionFontSize === 'string' ||
				typeof attributes?.figcaptionFontSizeTablet === 'string' ||
				typeof attributes?.figcaptionFontSizeMobile === 'string' ||
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
			let newAttributes = { ...attributes }

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		attributes: attributes( '3.12.6' ),
		save: withVersion( '3.12.6' )( Save ),
	},
	{
		attributes: attributes( '3.12.3' ),
		save: withVersion( '3.12.3' )( Save ),
	},
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasImageOpacity = deprecationImageOverlayOpacity.isEligible( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasImageOpacity
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
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
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecationImageOverlayOpacity.migrate( attributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'image%s' )( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
