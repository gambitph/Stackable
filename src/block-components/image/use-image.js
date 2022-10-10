/**
 * WordPress Dependencies
 */
import { useBlockSetAttributesContext } from '~stackable/hooks'

export const useImage = () => {
	const setAttributes = useBlockSetAttributesContext()

	const onChange = image => {
		setAttributes( {
			imageUrl: image.url,
			imageId: image.id,
			imageHeightAttribute: image.height,
			imageWidthAttribute: image.width,
			imageAlt: image.alt,
		} )
	}

	const onChangeSizeDesktop = ( {
		width, height, widthUnit, heightUnit,
	} ) => {
		const size = {}
		if ( typeof width !== 'undefined' ) {
			size.imageWidth = width
		}
		if ( typeof height !== 'undefined' ) {
			size.imageHeight = height
		}
		if ( typeof heightUnit !== 'undefined' ) {
			size.imageHeightUnit = heightUnit
		}
		if ( typeof widthUnit !== 'undefined' ) {
			size.imageWidthUnit = widthUnit
		}
		setAttributes( size )
	}

	const onChangeSizeTablet = ( {
		width, height, widthUnit, heightUnit,
	} ) => {
		const size = {}
		if ( typeof width !== 'undefined' ) {
			size.imageWidthTablet = width
		}
		if ( typeof height !== 'undefined' ) {
			size.imageHeightTablet = height
		}
		if ( typeof heightUnit !== 'undefined' ) {
			size.imageHeightUnitTablet = heightUnit
		}
		if ( typeof widthUnit !== 'undefined' ) {
			size.imageWidthUnitTablet = widthUnit
		}
		setAttributes( size )
	}

	const onChangeSizeMobile = ( {
		width, height, widthUnit, heightUnit,
	} ) => {
		const size = {}
		if ( typeof width !== 'undefined' ) {
			size.imageWidthMobile = width
		}
		if ( typeof height !== 'undefined' ) {
			size.imageHeightMobile = height
		}
		if ( typeof heightUnit !== 'undefined' ) {
			size.imageHeightUnitMobile = heightUnit
		}
		if ( typeof widthUnit !== 'undefined' ) {
			size.imageWidthUnitMobile = widthUnit
		}
		setAttributes( size )
	}

	const onRemove = () => {
		setAttributes( {
			imageUrl: '',
			imageId: '',
			imageHeightAttribute: '',
			imageWidthAttribute: '',
			imageAlt: '',
		} )
	}

	return {
		setImage: {
			onChange,
			onChangeSizeDesktop,
			onChangeSizeTablet,
			onChangeSizeMobile,
			onRemove,
		},
	}
}

