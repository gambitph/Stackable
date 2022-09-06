/**
 * WordPress Dependencies
 */
import { useCallback } from '@wordpress/element'
import { useBlockSetAttributesContext } from '~stackable/hooks'

export const useImage = () => {
	const setAttributes = useBlockSetAttributesContext()

	const onChange = useCallback(
		image => {
			setAttributes( {
				imageUrl: image.url,
				imageId: image.id,
				imageHeightAttribute: image.height,
				imageWidthAttribute: image.width,
				imageAlt: image.alt,
			} )
		},
		[ setAttributes ]
	)

	const onChangeSizeDesktop = useCallback(
		( {
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
		},
		[ setAttributes ]
	)

	const onChangeSizeTablet = useCallback(
		( {
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
		},
		[ setAttributes ]
	)

	const onChangeSizeMobile = useCallback(
		( {
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
		},
		[ setAttributes ]
	)

	const onRemove = useCallback(
		() => {
			setAttributes( {
				imageUrl: '',
				imageId: '',
				imageHeightAttribute: '',
				imageWidthAttribute: '',
				imageAlt: '',
			} )
		},
		[ setAttributes ]
	)

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

