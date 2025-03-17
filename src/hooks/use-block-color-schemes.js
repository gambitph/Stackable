import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

export const useBlockColorSchemes = () => {
	const {
		getScheme,
		allColorSchemes,
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	} = useSelect( select => {
		const {
			colorSchemes,
			baseColorScheme: _baseColorScheme,
			backgroundModeColorScheme: _backgroundModeColorScheme,
			containerModeColorScheme: _containerModeColorScheme,
		} = select( 'stackable/global-color-schemes' ).getSettings()

		const allColorSchemes = applyFilters( 'stackable.global-settings.global-color-schemes.custom-color-schemes', colorSchemes, true )
		const COLOR_SCHEME_OPTIONS = [ {
			label: 'Scheme unavailable', // This will be displayed when a custom color scheme is deleted or when a license gets deactivated
			value: 'scheme-unavailable',
			hidden: true,
			disabled: true,
		}, ...allColorSchemes?.map( scheme => ( {
			label: scheme.name,
			value: scheme.key,
		} ) ) ]

		// Returns the color scheme slug if it exists, otherwise return a fallback value
		const getScheme = ( key, { mode = '', returnFallback = true } = {} ) => {
			const fallback = mode === 'background' ? 'scheme-default-2' : 'scheme-default-1'

			return COLOR_SCHEME_OPTIONS.find( scheme => scheme.value === key )?.value || ( returnFallback ? fallback : 'scheme-unavailable' )
		}

		return {
			getScheme,
			allColorSchemes,
			COLOR_SCHEME_OPTIONS,
			baseColorScheme: getScheme( _baseColorScheme ),
			backgroundModeColorScheme: getScheme( _backgroundModeColorScheme, 'background' ),
			containerModeColorScheme: getScheme( _containerModeColorScheme ),
		}
	}, [] )

	return {
		getScheme,
		allColorSchemes,
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	}
}
