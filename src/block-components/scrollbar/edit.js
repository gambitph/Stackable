/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorStyleControls,
	AdvancedRangeControl,
	ColorPaletteControl,
} from '~stackable/components'

import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const Edit = () => {
	const showScrollbar = useBlockAttributesContext( attributes => attributes.showScrollbar )
	const setAttributes = useBlockSetAttributesContext()
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Scrollbar Bar', i18n ) }
				initialOpen={ false }
				hasToggle
				checked={ showScrollbar }
				onChange={ showScrollbar => setAttributes( { showScrollbar } ) }
			>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					attribute="scrollbarHeight"
					min="0"
					sliderMin={ 0 }
					sliderMax={ 25 }
					step="1"
				/>
				<ColorPaletteControl
					label={ __( 'Track Color', i18n ) }
					attribute="scrollbarTrackColor"
				/>
				<ColorPaletteControl
					label={ __( 'Thumb Color', i18n ) }
					attribute="scrollbarThumbColor"
					hasTransparent={ true }
				/>
				<AdvancedRangeControl
					label={ __( 'Thumb Radius', i18n ) }
					attribute="scrollbarThumbRadius"
					allowReset={ true }
					min="0"
					units={ [ 'px', '%', 'rem' ] }
					step="1"
					sliderMax="25"
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
