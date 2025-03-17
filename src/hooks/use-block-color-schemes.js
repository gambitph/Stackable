import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

export const useBlockColorSchemes = () => {
	const {
		getScheme,
		getColorGroups,
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

		// Converts property name to space separated string (e.g., backgroundColor --> Background Color)
		const getLabel = property => {
			const result = property.replace( /([a-z])([A-Z])/g, '$1 $2' )
				.replace( /^([a-z])/, match => match.toUpperCase() )
			return result
		}

		// Converts property name to kebab-cased string with scheme key as prefix
		// (e.g., backgroundColor --> --stk-scheme-default-1-background-color)
		const toKebab = ( property, slug ) => {
			const result = property.replace( /([a-z0-9])([A-Z])/g, '$1-$2' )
			return '--stk-' + slug + '-' + result.toLowerCase()
		}

		// get color groups for color palette picker.
		const getColorGroups = () => {
			const colorGroups = allColorSchemes.reduce( ( groups, scheme ) => {
				// only add colors if the option to add color scheme in the picker is enabled.
				if ( ! scheme.showInPicker ) {
					return groups
				}

				// Add name and slug to each color in the color scheme
				const colors = Object.entries( scheme.colorScheme ).reduce( ( colors, [ property, value ] ) => {
					// Only add colors that have values.
					if ( ! value?.desktop ) {
						return colors
					}
					return [
						...colors,
						{
							color: value?.desktop,
							name: getLabel( property ),
							slug: toKebab( property, scheme.key ),
						},
					]
				}, [] )

				// Only add groups that have colors.
				if ( colors.length === 0 ) {
					return groups
				}

				// return color schemes as groups
				return [
					...groups,
					{
						name: scheme.name,
						id: scheme.key,
						colors,
					},
				]
			}, [] )

			return colorGroups
		}

		return {
			getScheme,
			getColorGroups,
			allColorSchemes,
			COLOR_SCHEME_OPTIONS,
			baseColorScheme: getScheme( _baseColorScheme ),
			backgroundModeColorScheme: getScheme( _backgroundModeColorScheme, 'background' ),
			containerModeColorScheme: getScheme( _containerModeColorScheme ),
		}
	}, [] )

	return {
		getScheme,
		getColorGroups,
		allColorSchemes,
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	}
}
