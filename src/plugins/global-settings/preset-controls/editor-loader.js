/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { compact } from 'lodash'

const PRESET_MAPPING = {
	fontSizes: {
		prefix: 'font-size',
	},
	spacingSizes: {
		prefix: 'spacing',
	},
	blockHeights: {
		prefix: 'block-height',
	},
	borderRadius: {
		prefix: 'border-radius',
	},
	shadows: {
		prefix: 'shadow',
		valueKey: 'shadow',
	},
}

/**
 * Render editor-only variables for custom presets.
 *
 * PHP emits the base preset variables for the frontend and editor.
 * This style element reflects unsaved Global Design System changes immediately.
 *
 * @param {Object}   customPresets Custom presets grouped by preset family.
 * @param {Function} setStyles     Updates the editor style element.
 */
const renderGlobalStyles = ( customPresets, setStyles ) => {
	let css = ''

	Object.entries( customPresets ).forEach( ( [ key, presets ] ) => {
		const mapping = PRESET_MAPPING[ key ]
		if ( ! mapping || ! Array.isArray( presets ) ) {
			return
		}
		const valueKey = mapping.valueKey || 'size'
		const styleRules = presets?.map( preset => {
			if ( ! preset || preset.isDiscarded ) {
				return ''
			}
			const presetValue = preset[ valueKey ] || ''
			return '--stk--preset--' + mapping.prefix + '--' + ( preset.slug || '' ) + ': ' + presetValue + ';'
		} )
		css += compact( styleRules ).join( '' )
	} )

	css = `:root { ${ css } }`
	setStyles( css )
}

export const GlobalPresetControlsStyles = () => {
	const { customPresets } = useSelect( select => {
		const _customPresetControls = select( 'stackable/global-preset-controls.custom' )?.getCustomPresetControls()
		return { customPresets: { ..._customPresetControls } ?? [] }
	}, [] )
	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( customPresets && typeof customPresets === 'object' ) {
			renderGlobalStyles( customPresets, setStyles )
		}
	}, [ customPresets ] )

	return styles
}
