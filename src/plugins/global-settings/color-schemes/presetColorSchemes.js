/**
 * Internal dependencies
 */
import COLOR_SCHEMES from './preset-color-schemes.json'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { ColorSchemePreview } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const PRESETS = [ ...COLOR_SCHEMES ]

export const PresetColorSchemesPicker = ( { onPresetClick } ) => {
	return (
		<BaseControl label={ __( 'Preset Color Schemes', i18n ) } >
			<div className="stk-color-schemes__preset-wrapper">
				{ PRESETS.map( ( colors, index ) => {
					return <ColorSchemePreview key={ index } colors={ colors } onClick={ () => onPresetClick( colors ) } />
				} ) }
			</div>
		</BaseControl>
	)
}
