import { i18n } from 'stackable'
import { kebabCase } from 'lodash'

import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

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
			hideColorSchemeColors,
			baseColorScheme: _baseColorScheme,
			backgroundModeColorScheme: _backgroundModeColorScheme,
			containerModeColorScheme: _containerModeColorScheme,
		} = select( 'stackable/global-color-schemes' ).getSettings()

		const allColorSchemes = applyFilters( 'stackable.global-settings.global-color-schemes.custom-color-schemes', colorSchemes, true )
		const COLOR_SCHEME_OPTIONS = [ {
			label: __( 'Scheme unavailable', i18n ), // This will be displayed when a custom color scheme is deleted or when a license gets deactivated
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
			const result = kebabCase( property )
			return '--stk-' + slug + '-' + result
		}

		// get color groups for color palette picker.
		const getColorGroups = () => {
			if ( hideColorSchemeColors ) {
				return []
			}

			const colorSchemeColors = []
			const colorSchemeGradients = []

			allColorSchemes.forEach( scheme => {
				// only add colors if the option to add color scheme in the picker is enabled.
				if ( scheme.hideInPicker ) {
					return
				}

				const colors = []
				const gradients = []

				// Add name and slug to each color in the color scheme
				Object.entries( scheme.colorScheme ).forEach( ( [ property, value ] ) => {
					// Only add colors that have values.
					if ( ! value?.desktop ) {
						return colors
					}

					if ( value?.desktop.startsWith( 'linear-' ) || value?.desktop.startsWith( 'radial-' ) ) {
						gradients.push( {
							gradient: value?.desktop,
							name: getLabel( property ),
							slug: toKebab( property, scheme.key ),
						} )

						return
					}

					colors.push( {
						color: value?.desktop,
						name: getLabel( property ),
						slug: toKebab( property, scheme.key ),
					} )
				} )

				if ( colors.length !== 0 ) {
					colorSchemeColors.push( {
						name: scheme.name,
						id: scheme.key,
						colors,
					} )
				}

				if ( gradients.length !== 0 ) {
					colorSchemeGradients.push( {
						name: scheme.name,
						id: scheme.key,
						gradients,
					} )
				}
			} )

			return { colorSchemeColors, colorSchemeGradients }
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
