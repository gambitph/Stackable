import { i18n } from 'stackable'
import DEFAULT_PRESETS from '~stackable/plugins/global-settings/preset-controls/presets.json'
import { useSettings } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const PRESET_MAPPING = {
	fontSizes: {
		settings: [ 'typography', 'fontSizes' ],
		defaultSizes: 'typography.fontSizes.default',
		defaultEnabled: 'typography.defaultFontSizes',
		prefix: 'font-size',
	},
	spacingSizes: {
		settings: [ 'spacing', 'spacingSizes' ],
		defaultSizes: 'spacing.spacingSizes.default',
		defaultEnabled: 'spacing.defaultSpacingSizes',
		prefix: 'spacing',
	},
	blockHeights: {
		settings: [ 'blockHeights' ],
		defaultSizes: '',
		defaultEnabled: '',
		prefix: 'block-height',
	},
	borderRadius: {
		settings: [ 'borderRadius' ],
		defaultSizes: '',
		defaultEnabled: '',
		prefix: 'border-radius',
	},
}

const nonePreset = {
	name: __( 'None', i18n ),
	size: '0px',
	slug: 'none',
}

export const usePresetControls = property => {
	// Get the theme presets for the property
	const [
		_themePresets,

		/**
		 * Dev note:
		 * In theme.json version 3, `typography.defaultFontSizes` and `spacing.defaultSpacingSizes` default to `true`.
		 * These settings must be explicitly set to `false` to override default presets. When enabled, themes with matching slugs
		 * will use default presets, and theme presets with the same slugs will be ignored.
		 * Therefore, we also need to get the default presets if the `defaultSizesEnabled` is `true` and merge it with the theme presets.
		 *
		 * See: https://make.wordpress.org/core/2024/06/19/theme-json-version-3/#:~:text=Breaking%20changes%20in%20version%203
		 * */
		wpDefaultPresets,
		defaultSizesEnabled,
	] = useSettings(
		PRESET_MAPPING[ property ].settings.join( '.' ),
		PRESET_MAPPING[ property ].defaultSizes,
		PRESET_MAPPING[ property ].defaultEnabled
	)

	// Get all custom presets
	const { allCustomPresets } = useSelect( select => {
		const _customPresetControls = select( 'stackable/global-preset-controls.custom' )?.getCustomPresetControls()
		return { allCustomPresets: { ..._customPresetControls } }
	}, [] )

	let themePresets = _themePresets
	const hasThemePresets = Array.isArray( themePresets ) && themePresets.length > 0

	// Merge theme presets with default presets when default sizes are enabled.
	// This happens when settings like `typography.defaultFontSizes` or `spacing.defaultSpacingSizes`
	// are not explicitly set to `false` in theme.json v3.
	if ( hasThemePresets && wpDefaultPresets && defaultSizesEnabled !== false ) {
		// Create a set for removing duplicates.
		const existingSlugs = new Set()
		_themePresets.forEach( item => {
			if ( item && typeof item.slug === 'string' ) {
				existingSlugs.add( item.slug )
			}
		} )

		themePresets = [
			..._themePresets,
			...wpDefaultPresets.filter( item => ! existingSlugs.has( item.slug ) ),
		]
	}

	// Get the theme/default presets if the user have one, else return the stackable presets
	const basePresets = hasThemePresets
		? themePresets
		: PRESET_MAPPING[ property ].settings.reduce( ( acc, key ) => acc?.[ key ], DEFAULT_PRESETS.settings )

	// Returns the base presets overriden by the custom presets
	const getMergedPresets = () => {
		const customPresets = allCustomPresets[ property ] ?? []
		// Convert custom presets into a lookup object for fast access
		const customMap = customPresets.reduce( ( acc, item ) => {
			acc[ item.slug ] = item
			return acc
		}, {} )

		// Merge base presets with custom presets (priority)
		return basePresets.map( baseItem =>
			customMap[ baseItem.slug ]
				? { ...baseItem, ...customMap[ baseItem.slug ] }
				: baseItem
		)
	}

	// Get the merge preset marks with the CSS Variable value
	// Setting customOnly to true returns the preset marks for custom presets only
	// Setting addNonePreset to true adds a none preset with a value of 0
	const getPresetMarks = ( { customOnly = false, addNonePreset = false } = {} ) => {
		const prefix = PRESET_MAPPING[ property ].prefix
		let presets = customOnly ? allCustomPresets[ property ] ?? [] : getMergedPresets()
		// Add the none preset
		presets = [ ...( addNonePreset ? [ nonePreset ] : [] ), ...presets ]

		return presets
			.filter( preset => ! ( preset?.isDiscarded ) )
			.map( preset => ( {
				...preset,
				value: `var(--stk--preset--${ prefix }--${ preset.slug }, ${ preset.size })`,
			} ) )
	}

	return {
		hasThemePresets,
		basePresets,
		allCustomPresets,
		getMergedPresets,
		getPresetMarks,
	}
}
