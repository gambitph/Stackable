import { dispatch, useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

export const useBlockColorSchemes = () => {
	const {
		getScheme,
		updateColorSchemesInUse,
		initializeColorSchemesInUse,
		allColorSchemes,
		colorSchemesInUse,
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
			colorSchemesInUse,
		} = select( 'stackable/global-color-schemes' ).getSettings()

		const allColorSchemes = applyFilters( 'stackable.global-settings.global-color-schemes.custom-color-schemes', colorSchemes, true )
		const COLOR_SCHEME_OPTIONS = [ {
			label: 'Scheme unavailable',
			value: 'scheme-unavailable',
			hidden: true,
			disabled: true,
		}, ...allColorSchemes?.map( scheme => ( {
			label: scheme.name,
			value: scheme.key,
		} ) ) ]

		const getScheme = ( key, { mode = '', returnFallback = true } = {} ) => {
			const fallback = mode === 'background' ? 'scheme-default-2' : 'scheme-default-1'

			return COLOR_SCHEME_OPTIONS.find( scheme => scheme.value === key )?.value || ( returnFallback ? fallback : 'scheme-unavailable' )
		}

		const updateColorSchemesInUse = ( newScheme, oldScheme, mode = 'container' ) => {
			const clientIds = select( 'core/block-editor' ).getSelectedBlockClientIds()
			clientIds.forEach( clientId => {
				dispatch( 'stackable/global-color-schemes' ).updateColorSchemesInUse( {
					newScheme, oldScheme, clientId, mode,
				} )
			} )
		}

		const initializeColorSchemesInUse = clientIds => {
			clientIds.forEach( clientId => {
				const attrs = select( 'core/block-editor' ).getBlockAttributes( clientId )

				if ( attrs && attrs.backgroundColorScheme ) {
					dispatch( 'stackable/global-color-schemes' ).updateColorSchemesInUse( {
						newScheme: attrs.backgroundColorScheme, oldScheme: '', clientId, mode: 'background',
					} )
				}
				if ( attrs && attrs.containerColorScheme ) {
					dispatch( 'stackable/global-color-schemes' ).updateColorSchemesInUse( {
						newScheme: attrs.containerColorScheme, oldScheme: '', clientId,
					} )
				}
			} )
		}

		return {
			getScheme,
			updateColorSchemesInUse,
			initializeColorSchemesInUse,
			allColorSchemes,
			colorSchemesInUse,
			COLOR_SCHEME_OPTIONS,
			baseColorScheme: getScheme( _baseColorScheme ),
			backgroundModeColorScheme: getScheme( _backgroundModeColorScheme, 'background' ),
			containerModeColorScheme: getScheme( _containerModeColorScheme ),
		}
	}, [] )

	return {
		getScheme,
		updateColorSchemesInUse,
		initializeColorSchemesInUse,
		allColorSchemes,
		colorSchemesInUse: Object.keys( colorSchemesInUse ),
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	}
}
