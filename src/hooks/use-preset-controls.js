import { useSettings } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import DEFAULT_PRESETS from '~stackable/plugins/global-settings/preset-controls/presets.json'

const PRESET_MAPPING = {
	fontSizes: {
		settings: [ 'typography', 'fontSizes' ],
		prefix: 'font-size',
	},
	spacingSizes: {
		settings: [ 'spacing', 'spacingSizes' ],
		prefix: 'spacing-size',
	},
}

export const usePresetControls = property => {
	// Get the theme presets for the property
	const [ themePresets ] = useSettings( PRESET_MAPPING[ property ].settings.join( '.' ) )
	// Get all custom presets
	const { allCustomPresets } = useSelect( select => {
		const _customPresetControls = select( 'stackable/global-preset-controls.custom' )?.getCustomPresetControls()
		return { allCustomPresets: { ..._customPresetControls } }
	}, [] )

	const hasThemePresets = Array.isArray( themePresets ) && themePresets.length > 0

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
	const getPresetMarks = () => {
		const prefix = PRESET_MAPPING[ property ].prefix
		const mergedPresets = getMergedPresets()

		return mergedPresets
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
