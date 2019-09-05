export { default as createImageAttributes } from './attributes'
export { createImageAttributeNames } from './attributes'
export { default as createImageStyles } from './styles'
export { createImageStyleSet } from './styles'

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
