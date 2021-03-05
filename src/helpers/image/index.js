export { default as imageAttributes } from './attributes'
export { default as useImage } from './use-image'
export { default as addImageStyles } from './style'

export const getImageProps = attributes => {
	return {
		imageId: attributes.imageId,
		imageURL: attributes.imageUrl,
		size: attributes.imageSize,
		src: attributes.imageUrl,

		width: attributes.imageWidth || 150,
		widthTablet: attributes.imageWidthTablet,
		widthMobile: attributes.imageWidthMobile,
		widthUnit: attributes.imageWidthUnit || '%',
		widthUnitTablet: attributes.imageWidthUnitTablet,
		widthUnitMobile: attributes.imageWidthUnitMobile,

		height: attributes.imageHeight || 300,
		heightTablet: attributes.imageHeightTablet,
		heightMobile: attributes.imageHeightMobile,
		heightUnit: attributes.imageHeightUnit || 'px',
		heightUnitTablet: attributes.imageHeightUnitTablet,
		heightUnitMobile: attributes.imageHeightUnitMobile,
	}
}
