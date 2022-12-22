/**
 * Internal dependencies
 */
import SeparatorControl from './separator-control'
import {
	AdvancedRangeControl,
	InspectorBlockControls,
	PanelAdvancedSettings,
	ColorPaletteControl,
	AdvancedToggleControl,
	ProControlButton,
	ShadowControl,
} from '~stackable/components'
import {
	useAttributeEditHandlers, useBlockAttributesContext, useBlockSetAttributesContext,
} from '~stackable/hooks'

/*
 * External dependencies
 */
import { i18n, showProNotice } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'

const SEPARATOR_SHADOWS = [
	'none',
	'0px 0 1px rgba(120, 120, 120, 0.5)',
	'0px 0 2px rgba(120, 120, 120, 0.5)',
	'2px 4px 6px #000', // This is a dark shadow similar to the shadow we used by default in v2.
	'0px 5px 10px rgba(153, 153, 153, 0.35)',
	'0px 2px 20px rgba(153, 153, 153, 0.2)',
	'25px 10px 30px rgba(18, 63, 82, 0.3)',
	'0px 10px 30px rgba(0, 0, 0, 0.05)',
	'7px 5px 30px rgba(72, 73, 121, 0.15)',
	'0px 10px 60px rgba(0, 0, 0, 0.1)',
	'70px 130px -60px rgba(72, 73, 121, 0.38) ',
]

const SeparatorControls = props => {
	const {
		attrNameTemplate,
		hasFlipVertically,
	} = props

	const {
		getAttrName,
	} = useAttributeEditHandlers( attrNameTemplate )

	const separatorShadowOptions = applyFilters( 'stackable.separator.shadows', SEPARATOR_SHADOWS )

	return (
		<>
			<SeparatorControl
				label={ __( 'Design', i18n ) }
				attribute={ getAttrName( 'separatorDesign' ) }
			/>
			<ColorPaletteControl
				label={ __( 'Color', i18n ) }
				attribute={ getAttrName( 'separatorColor' ) }
			/>
			<AdvancedRangeControl
				label={ __( 'Height', i18n ) }
				min={ 30 }
				sliderMax={ 400 }
				placeholder=""
				attribute={ getAttrName( 'separatorHeight' ) }
				responsive="all"
			/>
			<AdvancedRangeControl
				label={ __( 'Width', i18n ) }
				attribute={ getAttrName( 'separatorWidth' ) }
				min={ 1 }
				sliderMax={ 4 }
				step={ 0.1 }
			/>
			<ShadowControl
				isFilter={ true }
				label={ __( 'Shadow / Outline', i18n ) }
				attribute={ getAttrName( 'separatorShadow' ) }
				options={ separatorShadowOptions }
				placeholder="5"
			/>
			<AdvancedToggleControl
				label={ __( 'Invert Design', i18n ) }
				attribute={ getAttrName( 'separatorInverted' ) }
			/>
			<AdvancedToggleControl
				label={ __( 'Flip Horizontally', i18n ) }
				attribute={ getAttrName( 'separatorFlipHorizontally' ) }
			/>
			{ hasFlipVertically && (
				<AdvancedToggleControl
					label={ __( 'Flip Vertically', i18n ) }
					attribute={ getAttrName( 'separatorFlipVertically' ) }
				/>
			) }
			<AdvancedToggleControl
				label={ __( 'Bring to Front', i18n ) }
				attribute={ getAttrName( 'separatorBringToFront' ) }
			/>
		</>
	)
}

SeparatorControls.defaultProps = {
	attrNameTemplate: '%s',
	hasFlipVertically: false,
}

export const Edit = props => {
	const PremiumTopSeparatorControls = useMemo( applyFilters( 'stackable.block-component.separator.top.after', null ), [] )
	const PremiumBottomSeparatorControls = useMemo( applyFilters( 'stackable.block-component.separator.bottom.after', null ), [] )

	const setAttributes = useBlockSetAttributesContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			topSeparatorShow: attributes.topSeparatorShow,
			bottomSeparatorShow: attributes.bottomSeparatorShow,
		}
	} )

	return (
		<InspectorBlockControls>
			<PanelAdvancedSettings
				title={ __( 'Top Separator', i18n ) }
				id="top-separator"
				hasToggle={ true }
				checked={ attributes.topSeparatorShow }
				onChange={ topSeparatorShow => setAttributes( { topSeparatorShow } ) }
			>
				<SeparatorControls attrNameTemplate="top%s" />
				{ PremiumTopSeparatorControls && <PremiumTopSeparatorControls { ...props } /> }
				{ showProNotice && (
					<ProControlButton
						title={ __( 'Say Hello to Gorgeous Separators 👋', i18n ) }
						description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
					/>
				) }
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Bottom Separator', i18n ) }
				id="bottom-separator"
				hasToggle={ true }
				checked={ attributes.bottomSeparatorShow }
				onChange={ bottomSeparatorShow => setAttributes( { bottomSeparatorShow } ) }
			>
				<SeparatorControls attrNameTemplate="bottom%s" />
				{ PremiumBottomSeparatorControls && <PremiumBottomSeparatorControls { ...props } /> }
				{ showProNotice && (
					<ProControlButton
						title={ __( 'Say Hello to Gorgeous Separators 👋', i18n ) }
						description={ __( 'Add a second & third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium', i18n ) }
					/>
				) }
			</PanelAdvancedSettings>
		</InspectorBlockControls>
	)
}

Edit.SeparatorControls = SeparatorControls
