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
}

const renderGlobalStyles = ( customPresets, setStyles ) => {
	let css = ''

	Object.entries( customPresets ).forEach( ( [ key, presets ] ) => {
		const styleRules = presets?.map( preset => {
			return preset && ( ! preset?.isDiscarded )
				? `--stk--preset--${ PRESET_MAPPING[ key ]?.prefix }--${ preset?.slug || '' }: ${ preset?.size || '' };`
				: ''
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
	}, [ JSON.stringify( customPresets ) ] )

	return styles
}
