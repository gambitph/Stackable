/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorStyleControls,
	AdvancedRangeControl,
	AdvancedSelectControl,
} from '~stackable/components'
import { ColumnsControl } from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const Edit = () => (
	<InspectorStyleControls>
		<PanelAdvancedSettings
			title={ __( 'Horizontal Scroll', i18n ) }
			id="horizontal-scroll"
			initialOpen={ true }
		>
			<ColumnsControl sliderMax={ 10 } />
			<AdvancedSelectControl
				label={ __( 'Snapping', i18n ) }
				attribute="horizontalScrollerSnap"
				options={ [
					{ value: 'start', label: __( 'Snap to Start', i18n ) },
					{ value: 'center', label: __( 'Snap to Center', i18n ) },
					{ value: 'none', label: __( 'No Snapping', i18n ) },
				] }
				default="center"
			/>
			<AdvancedRangeControl
				label={ __( 'Item Width', i18n ) }
				attribute="horizontalScrollerColumnWidth"
				responsive="all"
				units={ [ 'px', 'em', '%' ] }
				min={ [ 0, 0, 0 ] }
				sliderMax={ [ 500, 40, 50 ] }
				step={ [ 1, 0.1, 1 ] }
				placeholder={ 300 }
			/>
			<AdvancedRangeControl
				label={ __( 'Height', i18n ) }
				attribute="horizontalScrollerHeight"
				min="0"
				sliderMin={ 0 }
				sliderMax={ 500 }
				step="1"
			/>
			<AdvancedRangeControl
				label={ __( 'Gap', i18n ) }
				attribute="horizontalScrollerColumnGap"
				responsive="all"
				min={ 0 }
				sliderMax={ 100 }
				placeholder="0"
			/>
			<AdvancedRangeControl
				label={ __( 'Left Offset', i18n ) }
				attribute="horizontalScrollerLeftOffset"
				responsive="all"
				units={ [ 'px', 'em', '%' ] }
				min={ [ 0, 0, 0 ] }
				sliderMax={ [ 500, 40, 50 ] }
				step={ [ 1, 0.1, 1 ] }
			/>
		</PanelAdvancedSettings>
	</InspectorStyleControls>
)
