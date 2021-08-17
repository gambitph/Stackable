/*
 * External dependencies
 */
import {
	AdvancedRangeControl,
	InspectorBlockControls,
	PanelAdvancedSettings,
	ColorPaletteControl,
	AdvancedToggleControl,
	ShadowControl,
	ProControlButton,
} from '~stackable/components'
import { i18n, showProNotice } from 'stackable'
import {
	useAttributeEditHandlers,
} from '~stackable/hooks'

/**
 * Internal dependencies
 */
import SeparatorControl from './separator-control'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const Edit = props => {
	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
		getAttrName,
	} = useAttributeEditHandlers()

	return (
		<InspectorBlockControls>
			<PanelAdvancedSettings
				title={ __( 'Top Separator', i18n ) }
				id="top-separator"
				checked={ getAttribute( 'topSeparatorShow' ) }
				onChange={ updateAttributeHandler( 'topSeparatorShow' ) }
			>
				<SeparatorControl
					label={ __( 'Design', i18n ) }
					attribute="topSeparatorDesign"
				/>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					attribute="topSeparatorColor"
				/>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					min={ 30 }
					sliderMax={ 400 }
					placeholder=""
					attribute="topSeparatorHeight"
					responsive="all"
				/>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					attribute="topSeparatorWidth"
					min={ 1 }
					sliderMax={ 4 }
					step={ 0.1 }
				/>
				<ShadowControl
					label={ __( 'Shadow / Outline', i18n ) }
					attribute="topSeparatorShadow"
				/>
				<AdvancedToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					attribute="topSeparatorFlipHorizontally"
				/>
				<AdvancedToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					attribute="topSeparatorFlipVertically"
				/>
				<AdvancedToggleControl
					label={ __( 'Bring to Front', i18n ) }
					attribute="topSeparatorBringToFront"
				/>
				{ applyFilters( 'stackable.block-component.separator.top.after', null, {
					...props,
					getAttribute,
					updateAttributeHandler,
					updateAttributes,
					getAttrName,
				} ) }
				{ showProNotice && (
					<ProControlButton
						title={ __( 'Say Hello to Gorgeous Separators 👋' ) }
						description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
					/>
				) }
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Bottom Separator', i18n ) }
				id="bottom-separator"
				checked={ getAttribute( 'bottomSeparatorShow' ) }
				onChange={ updateAttributeHandler( 'bottomSeparatorShow' ) }
			>
				<SeparatorControl
					label={ __( 'Design', i18n ) }
					attribute="bottomSeparatorDesign"
				/>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					attribute="bottomSeparatorColor"
				/>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					min={ 30 }
					sliderMax={ 400 }
					placeholder=""
					attribute="bottomSeparatorHeight"
					responsive="all"
				/>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					attribute="bottomSeparatorWidth"
					min={ 1 }
					sliderMax={ 4 }
					step={ 0.1 }
				/>
				<ShadowControl
					label={ __( 'Shadow / Outline', i18n ) }
					attribute="bottomSeparatorShadow"
				/>
				<AdvancedToggleControl
					label={ __( 'Flip Horizontally', i18n ) }
					attribute="bottomSeparatorFlipHorizontally"
				/>
				<AdvancedToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					attribute="bottomSeparatorFlipVertically"
				/>
				<AdvancedToggleControl
					label={ __( 'Bring to Front', i18n ) }
					attribute="bottomSeparatorBringToFront"
				/>
				{ applyFilters( 'stackable.block-component.separator.bottom.after', null, {
					...props,
					getAttribute,
					updateAttributeHandler,
					updateAttributes,
					getAttrName,
				} ) }
				{ showProNotice && (
					<ProControlButton
						title={ __( 'Say Hello to Gorgeous Separators 👋' ) }
						description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
					/>
				) }
			</PanelAdvancedSettings>
		</InspectorBlockControls>
	)
}
