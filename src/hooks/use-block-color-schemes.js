import { i18n } from 'stackable'
import { cloneDeep, kebabCase } from 'lodash'

import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { getPropertyLabel } from '~stackable/util'

// Check if the color scheme contains a value for any of the states
const schemeHasValue = scheme => {
	const hasValue = Object.values( scheme ).some( states => {
		return Object.values( states ).some( value => value !== '' )
	} )

	return hasValue
}

export const useBlockColorSchemes = () => {
	const {
		getScheme,
		getColorGroups,
		allColorSchemes,
		colorSchemesCollection,
		getSortedColorSchemes,
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
			disabled: ! schemeHasValue( scheme.colorScheme ),
		} ) ) ]

		const colorSchemesCollection = allColorSchemes.reduce( ( obj, _scheme ) => {
			const scheme = cloneDeep( _scheme )

			if ( ! schemeHasValue( scheme.colorScheme ) ) {
				return obj
			}
			// if ( scheme.key === 'scheme-default-2' && ! schemeHasValue( scheme.colorScheme ) ) {
			// 	scheme.colorScheme.backgroundColor.desktop = 'var(--stk-block-background-color)'
			// }

			const desktopColors = {}
			const desktopHoverColors = {}
			const desktopParentHoverColors = {}

			Object.entries( scheme.colorScheme ).forEach( ( [ key, value ] ) => {
				if ( 'desktop' in value ) {
					desktopColors[ key ] = value.desktop
				}

				if ( 'desktopHover' in value ) {
					desktopHoverColors[ key ] = value.desktopHover
				}

				if ( 'desktopParentHover' in value ) {
					desktopParentHoverColors[ key ] = value.desktopParentHover
				}
			} )

			obj[ scheme.key ] = scheme
			obj[ scheme.key ].normal = desktopColors
			obj[ scheme.key ].hover = desktopHoverColors
			obj[ scheme.key ].parentHover = desktopParentHoverColors

			return obj
		}, {} )

		// Returns the color scheme slug if it exists, otherwise return a fallback value
		const getScheme = ( key, { mode = '', returnFallback = true } = {} ) => {
			const fallback = mode === 'background' ? 'scheme-default-2' : 'scheme-default-1'

			return COLOR_SCHEME_OPTIONS.find( scheme => scheme.value === key )?.value || ( returnFallback ? fallback : 'scheme-unavailable' )
		}

		// Converts property name to kebab-cased string with scheme key as prefix
		// (e.g., backgroundColor --> --stk-scheme-default-1-background-color)
		const toKebab = ( property, slug ) => {
			const result = kebabCase( property )
			return '--stk-' + slug + '-' + result
		}

		const getSortedColorSchemes = () => {
			// Get the color schemes in the desired order:
			// 1. base color scheme
			// 2. background color scheme
			// 3. container color scheme
			// 4. the rest

			const baseKey = getScheme( _baseColorScheme )
			const backgroundKey = getScheme( _backgroundModeColorScheme, { mode: 'background' } )
			const containerKey = getScheme( _containerModeColorScheme )

			const sortedArray = []

			if ( baseKey in colorSchemesCollection ) {
				const baseScheme = colorSchemesCollection[ baseKey ]
				baseScheme.schemeType = __( 'Base Color Scheme', i18n )
				sortedArray.push( baseScheme )
			}

			if ( backgroundKey in colorSchemesCollection ) {
				const backgroundScheme = colorSchemesCollection[ backgroundKey ]
				backgroundScheme.schemeType = __( 'Background Color Scheme', i18n )
				sortedArray.push( backgroundScheme )
			}

			if ( baseKey !== containerKey && containerKey in colorSchemesCollection ) {
				const containerScheme = colorSchemesCollection[ containerKey ]
				containerScheme.schemeType = __( 'Container Color Scheme', i18n )
				sortedArray.push( containerScheme )
			} else if ( baseKey in colorSchemesCollection ) {
				sortedArray[ 0 ].schemeType = __( 'Base/Container Color Scheme', i18n )
			}

			// Filter out the base, background, and container schemes from the rest
			const restSchemes = Object.values( colorSchemesCollection ).filter(
				scheme =>
					scheme.key !== baseKey &&
					scheme.key !== backgroundKey &&
					scheme.key !== containerKey
			)
			// Return the sorted array, omitting undefineds if any scheme is missing
			return sortedArray.concat( restSchemes )
		}

		// get color groups for color palette picker.
		const getColorGroups = () => {
			if ( hideColorSchemeColors ) {
				return { colorSchemeColors: [], colorSchemeGradients: [] }
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
							name: getPropertyLabel( property ),
							slug: toKebab( property, scheme.key ),
						} )

						return
					}

					colors.push( {
						color: value?.desktop,
						name: getPropertyLabel( property ),
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
			colorSchemesCollection,
			getSortedColorSchemes,
			COLOR_SCHEME_OPTIONS,
			baseColorScheme: getScheme( _baseColorScheme ),
			backgroundModeColorScheme: getScheme( _backgroundModeColorScheme, { mode: 'background' } ),
			containerModeColorScheme: getScheme( _containerModeColorScheme ),
		}
	}, [] )

	return {
		getScheme,
		getColorGroups,
		allColorSchemes,
		colorSchemesCollection,
		getSortedColorSchemes,
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	}
}
