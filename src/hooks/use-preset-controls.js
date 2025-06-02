import { i18n } from 'stackable'
import DEFAULT_PRESETS from '~stackable/plugins/global-settings/preset-controls/presets.json'
import { useSettings } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const PRESET_MAPPING = {
	fontSizes: {
		settings: [ 'typography', 'fontSizes' ],
		prefix: 'font-size',
	},
	spacingSizes: {
		settings: [ 'spacing', 'spacingSizes' ],
		prefix: 'spacing',
	},
	blockHeights: {
		settings: [ 'blockHeights' ],
		prefix: 'block-height',
	},
	borderRadius: {
		settings: [ 'borderRadius' ],
		prefix: 'border-radius',
	},
}

const nonePreset = {
	name: __( 'None', i18n ),
	size: '0rem',
	slug: 'none',
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
