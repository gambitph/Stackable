/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'
import { applyFilters, addFilter } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import { useDeviceType } from './use-device-type'

export const usePlaceholder = ( attribute = '' ) => {
	const placeholders = useMemo( () => applyFilters( 'stackable.placeholders', {} ), [] )

	const deviceType = useDeviceType()
	const appendDeviceAttr = deviceType === 'Desktop' ? '' : deviceType

	const placeholder = useMemo( () => {
		let key

		if ( typeof attribute === 'string' ) {
			key = Object.keys( placeholders ).findIndex( key => key === attribute + appendDeviceAttr )
			if ( key !== -1 ) {
				return placeholders[ attribute + appendDeviceAttr ]
			}
		} else if ( Array.isArray( attribute ) ) {
			key = []
			attribute.forEach( k => {
				if ( Object.keys( placeholders ).includes( k + appendDeviceAttr ) ) {
					key.push( k )
				}
			} )

			return key.reduce( ( acc, curr ) => {
				return { ...acc, [ curr ]: placeholders[ curr + appendDeviceAttr ] }
			}, {} )
		}

		return null
	}, [ placeholders, attribute, appendDeviceAttr ] )

	return placeholder
}

/**
 * Default block placeholders
 *
 * @example
 * ```
 * {
 * 		containerPaddingTop: 32, // handled by four range control. attribute = 'containerPadding'
 * 		buttonBorderRadiusTablet: 32,
 * 		buttonBorderRadiusMobile: 8,
 * }
 * ```
 */
addFilter( 'stackable.placeholders', 'default', placeholders => ( {
	...placeholders,
	containerPaddingTop: 32,
	containerPaddingRight: 32,
	containerPaddingBottom: 32,
	containerPaddingLeft: 32,
} ) )
