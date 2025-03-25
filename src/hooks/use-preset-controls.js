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
	// Get the base presets
	const [ themePresets ] = useSettings( PRESET_MAPPING[ property ].settings.join( '.' ) )
	const basePresets = Array.isArray( themePresets ) && themePresets.length > 0
		? themePresets
		: PRESET_MAPPING[ property ].settings.reduce( ( acc, key ) => acc?.[ key ], DEFAULT_PRESETS.settings )

	// Get the custom presets
	const { customPresets } = useSelect( select => {
		const _customPresetControls = select( 'stackable/global-preset-controls.custom' )?.getCustomPresetControls()
		return { customPresets: { ..._customPresetControls }[ property ] ?? [] }
	}, [] )

	// Convert custom presets into a lookup object for fast access
	const customMap = customPresets.reduce( ( acc, item ) => {
		acc[ item.slug ] = item
		return acc
	}, {} )

	// Merge base presets with custom presets (priority)
	const mergedPresets = basePresets.map( baseItem =>
		customMap[ baseItem.slug ]
			? { ...baseItem, ...customMap[ baseItem.slug ] }
			: baseItem
	)

	const prefix = PRESET_MAPPING[ property ].prefix

	return mergedPresets.map( preset => ( {
		label: preset.name,
		slug: preset.slug,
		size: preset.size,
		value: `var(--stk--preset--${ prefix }--${ preset.slug }, ${ preset.size })`,
	} ) )
}
