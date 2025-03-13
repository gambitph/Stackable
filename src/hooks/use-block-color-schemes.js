import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

export const useBlockColorSchemes = () => {
	const {
		colorSchemes,
		_baseColorScheme,
		_backgroundModeColorScheme,
		_containerModeColorScheme,
	} = useSelect( select => {
		const {
			colorSchemes, baseColorScheme: _baseColorScheme, backgroundModeColorScheme: _backgroundModeColorScheme, containerModeColorScheme: _containerModeColorScheme,
		} = select( 'stackable/global-color-schemes' ).getSettings()

		return {
			colorSchemes,
			_baseColorScheme,
			_backgroundModeColorScheme,
			_containerModeColorScheme,
		}
	} )

	const allColorSchemes = applyFilters( 'stackable.global-settings.global-color-schemes.custom-color-schemes', colorSchemes, true )

	const COLOR_SCHEME_OPTIONS = allColorSchemes?.map( scheme => ( {
		label: scheme.name,
		value: scheme.key,
	} ) )

	const getScheme = ( key, mode = 'base' ) => {
		const fallback = mode === 'background' ? 'scheme-default-2' : 'scheme-default-1'

		return COLOR_SCHEME_OPTIONS.find( scheme => scheme.value === key )?.value || fallback
	}

	return {
		COLOR_SCHEME_OPTIONS,
		getScheme,
		baseColorScheme: getScheme( _baseColorScheme ),
		backgroundModeColorScheme: getScheme( _backgroundModeColorScheme, 'background' ),
		containerModeColorScheme: getScheme( _containerModeColorScheme ),
	}
}
