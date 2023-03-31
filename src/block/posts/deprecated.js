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
import { Image } from '~stackable/block-components'

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
