/**
 * Internal dependencies
 */
export { default as createImageAttributes } from './attributes'
export { createImageAttributeNames } from './attributes'
export { default as createImageStyles } from './styles'
export { createImageStyleSet, createImageMask } from './styles'

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data'

const getDefaultImageSize = ( imageData = {} ) => {
	return {
		width: imageData.media_details ? imageData.media_details.width : '',
		height: imageData.media_details ? imageData.media_details.height : '',
		source_url: imageData.source_url || '', // eslint-disable-line
	}
}

export const getImageSize = ( imageData = {}, imageSize = '' ) => {
	if ( ! imageData ) {
		return null
	}
	if ( ! imageData.media_details ) {
		return getDefaultImageSize( imageData )
	}
	if ( ! imageData.media_details.sizes ) {
		return getDefaultImageSize( imageData )
	}

	return imageData.media_details.sizes[ imageSize ] || getDefaultImageSize( imageData )
}

// Keep the cached image data in window so that other libraries (premium) can use this.
window._stackableCachedImageData = {}

/**
 * Caches the image data. To be called inside a `withSelect` HOC.
 *
 * @param {number} imageId The image ID to cache
 * @param {Object} select The select prop given by the `withSelect` HOC
 *
 * @return {Object} Image data being cached
 */
export const cacheImageData = ( imageId, select ) => {
	const { getMedia } = select( 'core' )
	const imageData = imageId ? getMedia( imageId ) : null
	if ( imageData && typeof imageData.id !== 'undefined' ) {
		window._stackableCachedImageData[ imageData.id ] = imageData
	}
	return imageData
}

/**
 * Gets the URL of the image of the given size from the cache. If size is not available, the full size is returned.
 *
 * @param {number} imageId The image ID
 * @param {string} size The image size to get
 *
 * @return {string} The URL of the image of the given size
 */
export const getImageUrlFromCache = ( imageId, size = 'full' ) => {
	const imageData = getImageDataFromCache( imageId ) || cacheImageData( imageId, select )
	if ( imageData ) {
		return imageData.media_details.sizes[ size ] ? imageData.media_details.sizes[ size ].source_url : imageData.source_url
	}
	return ''
}

/**
 * Gets the image data of the given image from the cache.
 *
 * @param {number} imageId The image ID
 *
 * @return {Object} The image data
 */
export const getImageDataFromCache = imageId => {
	return window._stackableCachedImageData[ imageId ] || null
}
