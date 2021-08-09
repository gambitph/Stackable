/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

export const useImage = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const onChange = useCallback(
		image => {
			updateBlockAttributes( clientId, {
				imageUrl: image.url,
				imageId: image.id,
				imageHeightAttribute: image.height,
				imageWidthAttribute: image.width,
				imageAlt: image.alt,
			} )
		}
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
			updateBlockAttributes( clientId, size )
		},
		[ clientId, updateBlockAttributes ]
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
			updateBlockAttributes( clientId, size )
		},
		[ clientId, updateBlockAttributes ]
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
			updateBlockAttributes( clientId, size )
		},
		[ clientId, updateBlockAttributes ]
	)

	const onRemove = useCallback(
		() => {
			updateBlockAttributes( clientId, {
				imageUrl: '',
				imageId: '',
				imageHeightAttribute: '',
				imageWidthAttribute: '',
				imageAlt: '',
			} )
		},
		[ clientId, updateBlockAttributes ]
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

