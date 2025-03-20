import { useSettings } from '@wordpress/block-editor'
import DEFAULT_PRESETS from '~stackable/plugins/global-settings/preset-controls/presets.json'

const PRESET_PREFIX = {
	'spacing.spacingSizes': 'spacing-size',
	'typography.fontSizes': 'font-size',
}

export const usePresetControls = properties => {
	const property = properties.join( '.' )
	const [ themePreset ] = useSettings( property )

	const presets = Array.isArray( themePreset ) && themePreset.length > 0
		? themePreset
		: properties.reduce( ( acc, key ) => acc?.[ key ], DEFAULT_PRESETS.settings )

	const prefix = PRESET_PREFIX[ property ]

	return presets.map( preset => ( {
		label: preset.name,
		value: `var(--stk--preset--${ prefix }--${ preset.slug }, ${ preset.size })`,
	} ) )
}
